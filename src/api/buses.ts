import { apiClient, handleApiError } from './client';

export interface Bus {
  id: number;
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  totalSeats: number;
  type: string;
  amenities: string[];
}

export interface Route {
  id: string;
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  buses: Bus[];
}

export interface SeatInfo {
  number: number;
  status: 'available' | 'booked' | 'selected' | 'female' | 'male';
}

export interface SearchRoutesParams {
  from: string;
  to: string;
  date: string;
}

export const busesApi = {
  getBuses: async (): Promise<Bus[]> => {
    try {
      const response = await apiClient.get<Bus[]>('/buses');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getBusById: async (id: number): Promise<Bus> => {
    try {
      const response = await apiClient.get<Bus>(`/buses/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  searchRoutes: async (params: SearchRoutesParams): Promise<Route[]> => {
    try {
      const response = await apiClient.get<Route[]>('/routes', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getRouteSeats: async (routeId: string, busId: number): Promise<SeatInfo[]> => {
    try {
      const response = await apiClient.get<SeatInfo[]>(`/routes/${routeId}/seats`, {
        params: { busId },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
