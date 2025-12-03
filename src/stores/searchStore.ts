import { create } from 'zustand';

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}

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

interface SearchState {
  searchParams: SearchParams;
  results: Bus[];
  isLoading: boolean;
  error: string | null;
  setSearchParams: (params: SearchParams) => void;
  setResults: (results: Bus[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSearch: () => void;
}

const initialSearchParams: SearchParams = {
  from: 'GIKI',
  to: 'Multan',
  date: '',
};

export const useSearchStore = create<SearchState>((set) => ({
  searchParams: initialSearchParams,
  results: [],
  isLoading: false,
  error: null,
  setSearchParams: (params) => set({ searchParams: params }),
  setResults: (results) => set({ results, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearSearch: () =>
    set({
      searchParams: initialSearchParams,
      results: [],
      error: null,
    }),
}));
