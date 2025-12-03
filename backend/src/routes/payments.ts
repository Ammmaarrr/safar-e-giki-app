import { Router, Request, Response, NextFunction } from 'express';
import { validate, createPaymentIntentSchema } from '../middleware/validation';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { stripeService, getStripeWebhookSecret, stripe } from '../services/stripe';
import { bookings } from './bookings';

const router = Router();

// POST /api/payments/create-payment-intent
router.post(
  '/create-payment-intent',
  optionalAuth,
  validate(createPaymentIntentSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { bookingId, amount, currency = 'pkr' } = req.body;

      // Validate booking exists
      const booking = bookings.get(bookingId);
      if (!booking) {
        throw createError('Booking not found', 404);
      }

      // Create payment intent
      const paymentIntent = await stripeService.createPaymentIntent({
        amount,
        currency,
        bookingId,
        customerEmail: booking.passengerInfo.email || undefined,
      });

      if (!paymentIntent) {
        throw createError('Failed to create payment intent', 500);
      }

      // Update booking with payment intent ID
      booking.paymentIntentId = paymentIntent.id;
      bookings.set(bookingId, booking);

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from smallest unit
        currency: paymentIntent.currency,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/payments/confirm
router.post(
  '/confirm',
  optionalAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { paymentIntentId, bookingId } = req.body;

      if (!paymentIntentId || !bookingId) {
        throw createError('Payment intent ID and booking ID are required', 400);
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);

      if (!paymentIntent) {
        throw createError('Payment intent not found', 404);
      }

      // Update booking based on payment status
      const booking = bookings.get(bookingId);
      if (!booking) {
        throw createError('Booking not found', 404);
      }

      if (paymentIntent.status === 'succeeded') {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        bookings.set(bookingId, booking);

        res.json({
          success: true,
          message: 'Payment confirmed successfully',
        });
      } else {
        res.json({
          success: false,
          message: `Payment status: ${paymentIntent.status}`,
        });
      }
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

      if (booking.paymentIntentId) {
        const paymentIntent = await stripeService.retrievePaymentIntent(booking.paymentIntentId);
        if (paymentIntent) {
          switch (paymentIntent.status) {
            case 'succeeded':
              paymentStatus = 'succeeded';
              break;
            case 'processing':
              paymentStatus = 'processing';
              break;
            case 'canceled':
              paymentStatus = 'cancelled';
              break;
            case 'requires_payment_method':
            case 'requires_confirmation':
            case 'requires_action':
              paymentStatus = 'pending';
              break;
            default:
              paymentStatus = 'pending';
          }
        }
      }

      res.json({
        status: paymentStatus,
        paymentIntentId: booking.paymentIntentId || null,
        amount: booking.totalAmount,
        paidAt: booking.paymentStatus === 'paid' ? booking.createdAt : null,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/webhooks/stripe - Stripe webhook handler
router.post(
  '/webhooks/stripe',
  async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    try {
      const webhookSecret = getStripeWebhookSecret();
      if (!webhookSecret || !stripe) {
        throw createError('Stripe webhook not configured', 500);
      }

      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          const bookingId = paymentIntent.metadata?.bookingId;

          if (bookingId) {
            const booking = bookings.get(bookingId);
            if (booking) {
              booking.paymentStatus = 'paid';
              booking.status = 'confirmed';
              bookings.set(bookingId, booking);
              console.log(`Payment succeeded for booking: ${bookingId}`);
            }
          }
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object;
          const bookingId = paymentIntent.metadata?.bookingId;

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
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      next(error);
    }
  }
);

export default router;
