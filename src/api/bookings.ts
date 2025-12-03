import { apiClient, handleApiError } from './client';
import type { PassengerInfo } from '../stores/bookingStore';

export interface CreateBookingData {
  busId: number;
  seatNumbers: number[];
  passengerInfo: PassengerInfo;
  from: string;
  to: string;
  date: string;
}

export interface Booking {
  id: string;
  userId: string;
  busId: number;
  busName: string;
  seatNumbers: number[];
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  passengerInfo: PassengerInfo;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export const bookingApi = {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    try {
      const response = await apiClient.post<Booking>('/bookings', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getBookings(): Promise<Booking[]> {
    try {
      const response = await apiClient.get<Booking[]>('/bookings');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await apiClient.get<Booking>(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async cancelBooking(id: string): Promise<Booking> {
    try {
      const response = await apiClient.put<Booking>(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
