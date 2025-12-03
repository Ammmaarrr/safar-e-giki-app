import { create } from 'zustand';

export interface SearchParams {
  from: string;
  to: string;
  date: string;
}

export interface RouteResult {
  id: string;
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  buses: number;
}

interface SearchState {
  searchParams: SearchParams;
  results: RouteResult[];
  isSearching: boolean;
  error: string | null;
  hasSearched: boolean;
  setSearchParams: (params: Partial<SearchParams>) => void;
  setResults: (results: RouteResult[]) => void;
  setSearching: (searching: boolean) => void;
  setError: (error: string | null) => void;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchParams: {
    from: '',
    to: '',
    date: '',
  },
  results: [],
  isSearching: false,
  error: null,
  hasSearched: false,
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),
  setResults: (results) => set({ results, hasSearched: true }),
  setSearching: (isSearching) => set({ isSearching }),
  setError: (error) => set({ error }),
  clearResults: () => set({ results: [], hasSearched: false, error: null }),
}));
