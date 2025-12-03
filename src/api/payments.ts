import { apiClient, handleApiError } from './client';

export interface CreateCheckoutRequest {
  bookingId: string;
  amount: number;
  currency?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  tracker: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  tracker: string;
  sig: string;
  bookingId?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  tracker: string | null;
  paymentReference: string | null;
  amount: number;
  paidAt: string | null;
}

export const paymentsApi = {
  createCheckout: async (data: CreateCheckoutRequest): Promise<CheckoutResponse> => {
    try {
      const response = await apiClient.post<CheckoutResponse>('/payments/create-checkout', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  verify: async (data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> => {
    try {
      const response = await apiClient.post<VerifyPaymentResponse>('/payments/verify', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getPaymentStatus: async (bookingId: string): Promise<PaymentStatusResponse> => {
    try {
      const response = await apiClient.get<PaymentStatusResponse>(`/payments/${bookingId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
