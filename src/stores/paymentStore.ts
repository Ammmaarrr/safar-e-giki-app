import { create } from 'zustand';

export type PaymentStatus = 'idle' | 'processing' | 'succeeded' | 'failed' | 'requires_action';

interface PaymentState {
  tracker: string | null;
  status: PaymentStatus;
  error: string | null;
  amount: number;
  currency: string;
  isProcessing: boolean;
  setTracker: (tracker: string | null) => void;
  setStatus: (status: PaymentStatus) => void;
  setError: (error: string | null) => void;
  setAmount: (amount: number) => void;
  setCurrency: (currency: string) => void;
  setProcessing: (isProcessing: boolean) => void;
  resetPayment: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  tracker: null,
  status: 'idle',
  error: null,
  amount: 0,
  currency: 'PKR',
  isProcessing: false,
  setTracker: (tracker) => set({ tracker }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setAmount: (amount) => set({ amount }),
  setCurrency: (currency) => set({ currency: currency.toUpperCase() }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  resetPayment: () =>
    set({
      tracker: null,
      status: 'idle',
      error: null,
      amount: 0,
      isProcessing: false,
    }),
}));
