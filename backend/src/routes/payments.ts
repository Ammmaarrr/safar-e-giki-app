import { Router, Request, Response, NextFunction } from 'express';
import { validate, createCheckoutSchema, verifyPaymentSchema } from '../middleware/validation';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { safepayService, safepay } from '../services/safepay';
import { bookings, Booking } from './bookings';
import supabase from '../services/supabase';

const router = Router();

// Success and cancel URLs for Safepay checkout
const getSuccessUrl = () => process.env.SAFEPAY_SUCCESS_URL || 'http://localhost:5173/payment/callback';
const getCancelUrl = () => process.env.SAFEPAY_CANCEL_URL || 'http://localhost:5173/payment/cancelled';

// Check if Supabase is configured
const isSupabaseConfigured = (): boolean => {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && supabase);
};

// Helper to get booking from Supabase or in-memory
const getBooking = async (bookingId: string): Promise<Booking | null> => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      routeId: data.route_id,
      busId: data.bus_id,
      busName: data.bus_name,
      from: data.from_city,
      to: data.to_city,
      seats: data.seats,
      passengerInfo: {
        name: data.passenger_name,
        phone: data.passenger_phone,
        email: data.passenger_email || '',
        cnic: data.passenger_cnic,
        emergencyContact: data.passenger_emergency_contact || '',
        gender: data.passenger_gender || '',
        boardingPoint: data.passenger_boarding_point || '',
        studentId: data.passenger_student_id,
      },
      travelDate: data.travel_date,
      departureTime: data.departure_time,
      totalAmount: Number(data.total_amount),
      status: data.status,
      paymentStatus: data.payment_status,
      paymentTracker: data.payment_tracker,
      paymentReference: data.payment_reference,
      createdAt: data.created_at,
    };
  }
  return bookings.get(bookingId) || null;
};

// Helper to update booking in Supabase or in-memory
const updateBooking = async (bookingId: string, updates: Partial<{
  paymentTracker: string;
  paymentReference: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}>): Promise<void> => {
  if (isSupabaseConfigured()) {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.paymentTracker !== undefined) dbUpdates.payment_tracker = updates.paymentTracker;
    if (updates.paymentReference !== undefined) dbUpdates.payment_reference = updates.paymentReference;
    if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    await supabase!
      .from('bookings')
      .update(dbUpdates)
      .eq('id', bookingId);
  } else {
    const booking = bookings.get(bookingId);
    if (booking) {
      if (updates.paymentTracker !== undefined) booking.paymentTracker = updates.paymentTracker;
      if (updates.paymentReference !== undefined) booking.paymentReference = updates.paymentReference;
      if (updates.paymentStatus !== undefined) booking.paymentStatus = updates.paymentStatus;
      if (updates.status !== undefined) booking.status = updates.status;
      bookings.set(bookingId, booking);
    }
  }
};

// POST /api/payments/create-checkout
router.post(
  '/create-checkout',
  optionalAuth,
  validate(createCheckoutSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { bookingId, amount, currency = 'PKR' } = req.body;

      // Validate booking exists
      const booking = await getBooking(bookingId);
      if (!booking) {
        throw createError('Booking not found', 404);
      }

      // Create Safepay checkout session
      const checkout = await safepayService.createCheckout({
        amount,
        currency,
        bookingId,
        successUrl: `${getSuccessUrl()}?bookingId=${bookingId}`,
        cancelUrl: `${getCancelUrl()}?bookingId=${bookingId}`,
      });

      if (!checkout) {
        throw createError('Failed to create checkout session', 500);
      }

      // Update booking with tracker
      await updateBooking(bookingId, { paymentTracker: checkout.tracker });

      res.json({
        checkoutUrl: checkout.checkoutUrl,
        tracker: checkout.tracker,
        amount,
        currency: currency.toUpperCase(),
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/payments/verify
router.post(
  '/verify',
  optionalAuth,
  validate(verifyPaymentSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { tracker, sig, bookingId } = req.body;

      if (!tracker || !sig) {
        throw createError('Tracker and signature are required', 400);
      }

      // Verify payment with Safepay
      const result = safepayService.verifyPayment({ tracker, signature: sig });

      // Update booking if we have bookingId
      if (bookingId) {
        if (result.success) {
          await updateBooking(bookingId, {
            paymentStatus: 'paid',
            status: 'confirmed',
            paymentReference: sig,
          });
        } else {
          await updateBooking(bookingId, { status: 'pending' });
        }
      }

      res.json({
        success: result.success,
        message: result.success ? 'Payment verified successfully' : 'Payment verification failed',
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/payments/:bookingId - Get payment status for a booking
router.get(
  '/:bookingId',
  optionalAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = await getBooking(req.params.bookingId);

      if (!booking) {
        throw createError('Booking not found', 404);
      }

      let paymentStatus: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' = 'pending';

      if (booking.paymentStatus === 'paid') {
        paymentStatus = 'succeeded';
      } else if (booking.paymentTracker) {
        paymentStatus = 'processing';
      }

      res.json({
        status: paymentStatus,
        tracker: booking.paymentTracker || null,
        paymentReference: booking.paymentReference || null,
        amount: booking.totalAmount,
        paidAt: booking.paymentStatus === 'paid' ? booking.createdAt : null,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/webhooks/safepay - Safepay webhook handler
router.post(
  '/webhooks/safepay',
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers['x-sfpy-signature'] as string | undefined;

    if (!signature) {
      return res.status(400).json({ error: 'Missing x-sfpy-signature header' });
    }

    try {
      if (!safepay) {
        throw createError('Safepay webhook not configured', 500);
      }

      // Verify webhook signature using the SDK
      const isValid = safepayService.verifyWebhook({
        body: req.body,
        headers: { 'x-sfpy-signature': signature },
      });

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      const event = req.body;

      // Handle the webhook event
      const eventType = event.type || event.event;
      const data = event.data || event;

      switch (eventType) {
        case 'payment:created':
        case 'payment.created': {
          const bookingId = data.order_id || data.orderId;
          if (bookingId) {
            await updateBooking(bookingId, {
              paymentStatus: 'paid',
              status: 'confirmed',
              paymentReference: data.reference || data.ref,
            });
            console.log(`Payment succeeded for booking: ${bookingId}`);
          }
          break;
        }

        case 'payment:failed':
        case 'payment.failed': {
          const bookingId = data.order_id || data.orderId;
          if (bookingId) {
            await updateBooking(bookingId, { status: 'pending' });
            console.log(`Payment failed for booking: ${bookingId}`);
          }
          break;
        }

        default:
          console.log(`Unhandled Safepay event type: ${eventType}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Safepay webhook error:', error);
      next(error);
    }
  }
);

export default router;
