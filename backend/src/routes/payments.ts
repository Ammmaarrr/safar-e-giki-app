import { Router, Request, Response, NextFunction } from 'express';
import { validate, createCheckoutSchema, verifyPaymentSchema } from '../middleware/validation';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { safepayService, safepay } from '../services/safepay';
import { bookings } from './bookings';

const router = Router();

// Success and cancel URLs for Safepay checkout
const getSuccessUrl = () => process.env.SAFEPAY_SUCCESS_URL || 'http://localhost:5173/payment/callback';
const getCancelUrl = () => process.env.SAFEPAY_CANCEL_URL || 'http://localhost:5173/payment/cancelled';

// POST /api/payments/create-checkout
router.post(
  '/create-checkout',
  optionalAuth,
  validate(createCheckoutSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { bookingId, amount, currency = 'PKR' } = req.body;

      // Validate booking exists
      const booking = bookings.get(bookingId);
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
      booking.paymentTracker = checkout.tracker;
      bookings.set(bookingId, booking);

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
        const booking = bookings.get(bookingId);
        if (booking) {
          if (result.success) {
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
            booking.paymentReference = sig;
          } else {
            booking.status = 'pending';
          }
          bookings.set(bookingId, booking);
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
      const booking = bookings.get(req.params.bookingId);

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
            const booking = bookings.get(bookingId);
            if (booking) {
              booking.paymentStatus = 'paid';
              booking.status = 'confirmed';
              booking.paymentReference = data.reference || data.ref;
              bookings.set(bookingId, booking);
              console.log(`Payment succeeded for booking: ${bookingId}`);
            }
          }
          break;
        }

        case 'payment:failed':
        case 'payment.failed': {
          const bookingId = data.order_id || data.orderId;
          if (bookingId) {
            const booking = bookings.get(bookingId);
            if (booking) {
              booking.status = 'pending';
              bookings.set(bookingId, booking);
              console.log(`Payment failed for booking: ${bookingId}`);
            }
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
