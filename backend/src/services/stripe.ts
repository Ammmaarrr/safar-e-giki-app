import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set. Payment features will not work.');
}

export const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })
  : null;

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  bookingId: string;
  customerEmail?: string;
}

export const stripeService = {
  createPaymentIntent: async ({
    amount,
    currency = 'pkr',
    bookingId,
    customerEmail,
  }: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent | null> => {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit (paisa for PKR)
      currency: currency.toLowerCase(),
      metadata: {
        bookingId,
      },
      receipt_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  },

  retrievePaymentIntent: async (paymentIntentId: string): Promise<Stripe.PaymentIntent | null> => {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    return stripe.paymentIntents.retrieve(paymentIntentId);
  },

  cancelPaymentIntent: async (paymentIntentId: string): Promise<Stripe.PaymentIntent | null> => {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    return stripe.paymentIntents.cancel(paymentIntentId);
  },

  constructWebhookEvent: (payload: Buffer, signature: string): Stripe.Event | null => {
    if (!stripe || !STRIPE_WEBHOOK_SECRET) {
      throw new Error('Stripe webhook is not configured');
    }

    return stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
  },
};

export const getStripeWebhookSecret = () => STRIPE_WEBHOOK_SECRET;
