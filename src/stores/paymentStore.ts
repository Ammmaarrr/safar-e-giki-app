import { create } from 'zustand';

export type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed' | 'requires_action';

interface PaymentState {
  clientSecret: string | null;
  paymentIntentId: string | null;
  status: PaymentStatus;
  error: string | null;
  amount: number;
  currency: string;
  isStripeReady: boolean;
  setClientSecret: (secret: string | null) => void;
  setPaymentIntentId: (id: string | null) => void;
  setStatus: (status: PaymentStatus) => void;
  setError: (error: string | null) => void;
  setAmount: (amount: number) => void;
  setCurrency: (currency: string) => void;
  setStripeReady: (ready: boolean) => void;
  resetPayment: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  clientSecret: null,
  paymentIntentId: null,
  status: 'idle',
  error: null,
  amount: 0,
  currency: 'pkr',
  isStripeReady: false,
  setClientSecret: (clientSecret) => set({ clientSecret }),
  setPaymentIntentId: (paymentIntentId) => set({ paymentIntentId }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setAmount: (amount) => set({ amount }),
  setCurrency: (currency) => set({ currency }),
  setStripeReady: (isStripeReady) => set({ isStripeReady }),
  resetPayment: () =>
    set({
      clientSecret: null,
      paymentIntentId: null,
      status: 'idle',
      error: null,
      amount: 0,
    }),
}));
