import { apiClient, handleApiError } from './client';

export interface PassengerInfo {
  name: string;
  phone: string;
  email: string;
  cnic: string;
  emergencyContact: string;
  gender: string;
  boardingPoint: string;
  studentId?: string;
}

export interface CreateBookingData {
  routeId: string;
  busId: number;
  seats: number[];
  passengerInfo: PassengerInfo;
  travelDate: string;
}

export interface Booking {
  id: string;
  routeId: string;
  busId: number;
  busName: string;
  from: string;
  to: string;
  seats: number[];
  passengerInfo: PassengerInfo;
  travelDate: string;
  departureTime: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export const bookingsApi = {
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    try {
      const response = await apiClient.post<Booking>('/bookings', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getBookings: async (): Promise<Booking[]> => {
    try {
      const response = await apiClient.get<Booking[]>('/bookings');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getBookingById: async (id: string): Promise<Booking> => {
    try {
      const response = await apiClient.get<Booking>(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    try {
      const response = await apiClient.put<Booking>(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
