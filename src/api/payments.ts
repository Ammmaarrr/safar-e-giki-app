import { apiClient, handleApiError } from './client';

export interface CreatePaymentIntentRequest {
  bookingId: string;
  amount: number;
  currency?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  bookingId: string;
}

export interface PaymentStatusResponse {
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  paymentIntentId: string | null;
  amount: number;
  paidAt: string | null;
}

export const paymentsApi = {
  createPaymentIntent: async (data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> => {
    try {
      const response = await apiClient.post<PaymentIntentResponse>('/payments/create-payment-intent', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  confirmPayment: async (data: ConfirmPaymentRequest): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('/payments/confirm', data);
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
