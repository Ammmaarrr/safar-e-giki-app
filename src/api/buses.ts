import { apiClient, handleApiError } from './client';
import type { Bus } from '../stores/searchStore';

export interface Route {
  id: number;
  from: string;
  to: string;
  distance: number;
  estimatedDuration: string;
}

export interface SearchRoutesParams {
  from: string;
  to: string;
  date: string;
}

export interface Seat {
  id: number;
  number: number;
  isAvailable: boolean;
  type: 'window' | 'aisle' | 'middle';
  price: number;
}

export const busApi = {
  async getBuses(): Promise<Bus[]> {
    try {
      const response = await apiClient.get<Bus[]>('/buses');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getBusById(id: number): Promise<Bus> {
    try {
      const response = await apiClient.get<Bus>(`/buses/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async searchRoutes(params: SearchRoutesParams): Promise<Bus[]> {
    try {
      const response = await apiClient.get<Bus[]>('/routes', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getAvailableSeats(routeId: number): Promise<Seat[]> {
    try {
      const response = await apiClient.get<Seat[]>(`/routes/${routeId}/seats`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
