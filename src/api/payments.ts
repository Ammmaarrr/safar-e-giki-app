import { apiClient, handleApiError } from './client';

export interface InitiatePaymentData {
  bookingId: string;
  amount: number;
  method: 'card' | 'jazzcash' | 'easypaisa' | 'bank_transfer';
}

export interface PaymentResponse {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  transactionId?: string;
  redirectUrl?: string;
  createdAt: string;
}

export interface ConfirmPaymentData {
  paymentId: string;
  transactionId: string;
}

export const paymentApi = {
  async initiatePayment(data: InitiatePaymentData): Promise<PaymentResponse> {
    try {
      const response = await apiClient.post<PaymentResponse>('/payments/initiate', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async confirmPayment(data: ConfirmPaymentData): Promise<PaymentResponse> {
    try {
      const response = await apiClient.post<PaymentResponse>('/payments/confirm', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
