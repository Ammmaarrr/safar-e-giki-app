import { Safepay } from '@sfpy/node-sdk';
import dotenv from 'dotenv';

dotenv.config();

const SAFEPAY_API_KEY = process.env.SAFEPAY_API_KEY || '';
const SAFEPAY_API_SECRET = process.env.SAFEPAY_API_SECRET || '';
const SAFEPAY_WEBHOOK_SECRET = process.env.SAFEPAY_WEBHOOK_SECRET || '';
const SAFEPAY_SANDBOX = process.env.SAFEPAY_SANDBOX === 'true';

if (!SAFEPAY_API_KEY || !SAFEPAY_API_SECRET) {
  console.warn('Warning: SAFEPAY_API_KEY or SAFEPAY_API_SECRET is not set. Payment features will not work.');
}

// Environment must match the Safepay SDK enum values
const environment = SAFEPAY_SANDBOX ? 'sandbox' : 'production';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safepay = SAFEPAY_API_KEY && SAFEPAY_API_SECRET
  ? new Safepay({
      environment,
      apiKey: SAFEPAY_API_KEY,
      v1Secret: SAFEPAY_API_SECRET,
      webhookSecret: SAFEPAY_WEBHOOK_SECRET,
    } as any)
  : null;

export interface CreateCheckoutParams {
  amount: number;
  currency?: string;
  bookingId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResult {
  checkoutUrl: string;
  tracker: string;
}

export interface VerifyPaymentParams {
  tracker: string;
  signature: string;
}

export const safepayService = {
  createCheckout: async ({
    amount,
    currency = 'PKR',
    bookingId,
    successUrl,
    cancelUrl,
  }: CreateCheckoutParams): Promise<CheckoutResult | null> => {
    if (!safepay) {
      throw new Error('Safepay is not configured');
    }

    try {
      // First create a payment token using the Safepay SDK
      const paymentData = await safepay.payments.create({
        amount: amount * 100, // Convert to smallest currency unit (paisa for PKR)
        currency: currency.toUpperCase() as 'PKR' | 'USD' | 'AED' | 'SAR' | 'CAD' | 'EUR' | 'GBP',
      });

      const tracker = paymentData.token;

      // Create checkout URL using the SDK
      const checkoutUrl = safepay.checkout.create({
        token: tracker,
        orderId: bookingId,
        cancelUrl,
        redirectUrl: successUrl,
        source: 'custom',
        webhooks: true,
      });

      return {
        checkoutUrl,
        tracker,
      };
    } catch (error) {
      console.error('Failed to create Safepay checkout:', error);
      throw error;
    }
  },

  verifyPayment: ({ tracker, signature }: VerifyPaymentParams): { success: boolean } => {
    if (!safepay) {
      throw new Error('Safepay is not configured');
    }

    try {
      // Verify the payment signature using Safepay SDK
      const isValid = safepay.verify.signature({
        body: {
          sig: signature,
          tracker,
        },
      });

      return {
        success: isValid,
      };
    } catch (error) {
      console.error('Failed to verify Safepay payment:', error);
      return {
        success: false,
      };
    }
  },

  verifyWebhook: (request: { body: { data: unknown }; headers: { 'x-sfpy-signature'?: string } }): boolean => {
    if (!safepay) {
      console.warn('Safepay not configured for webhook verification');
      return false;
    }

    try {
      return safepay.verify.webhook(request);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  },
};

export const getSafepayWebhookSecret = () => SAFEPAY_WEBHOOK_SECRET;
