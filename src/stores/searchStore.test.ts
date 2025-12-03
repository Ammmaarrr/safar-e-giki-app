import { describe, it, expect, beforeEach } from 'vitest';
import { useSearchStore } from '../stores/searchStore';

describe('searchStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useSearchStore.setState({
      searchParams: {
        from: 'GIKI',
        to: 'Multan',
        date: '',
      },
      results: [],
      isLoading: false,
      error: null,
    });
  });

  it('should initialize with default values', () => {
    const state = useSearchStore.getState();
    expect(state.searchParams.from).toBe('GIKI');
    expect(state.searchParams.to).toBe('Multan');
    expect(state.searchParams.date).toBe('');
    expect(state.results).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should update search parameters', () => {
    useSearchStore.getState().setSearchParams({
      from: 'Multan',
      to: 'GIKI',
      date: 'spring-2025-mid',
    });

    const state = useSearchStore.getState();
    expect(state.searchParams.from).toBe('Multan');
    expect(state.searchParams.to).toBe('GIKI');
    expect(state.searchParams.date).toBe('spring-2025-mid');
  });

  it('should set results', () => {
    const mockResults = [
      {
        id: 1,
        name: 'Test Bus',
        departureTime: '08:00 AM',
        arrivalTime: '02:00 PM',
        duration: '6 hrs',
        price: 2500,
        seatsAvailable: 28,
        totalSeats: 30,
        type: 'AC Recliner',
        amenities: ['AC', 'WiFi'],
      },
    ];

    useSearchStore.getState().setResults(mockResults);

    const state = useSearchStore.getState();
    expect(state.results).toEqual(mockResults);
    expect(state.error).toBeNull();
  });

  it('should set loading state', () => {
    useSearchStore.getState().setLoading(true);
    expect(useSearchStore.getState().isLoading).toBe(true);

    useSearchStore.getState().setLoading(false);
    expect(useSearchStore.getState().isLoading).toBe(false);
  });

  it('should set error', () => {
    useSearchStore.getState().setError('Network error');
    
    const state = useSearchStore.getState();
    expect(state.error).toBe('Network error');
    expect(state.isLoading).toBe(false);
  });

  it('should clear search', () => {
    // Set some data first
    useSearchStore.getState().setSearchParams({
      from: 'Multan',
      to: 'GIKI',
      date: 'spring-2025-mid',
    });
    useSearchStore.getState().setResults([
      {
        id: 1,
        name: 'Test Bus',
        departureTime: '08:00 AM',
        arrivalTime: '02:00 PM',
        duration: '6 hrs',
        price: 2500,
        seatsAvailable: 28,
        totalSeats: 30,
        type: 'AC Recliner',
        amenities: ['AC', 'WiFi'],
      },
    ]);

    // Clear search
    useSearchStore.getState().clearSearch();

    const state = useSearchStore.getState();
    expect(state.searchParams.from).toBe('GIKI');
    expect(state.searchParams.to).toBe('Multan');
    expect(state.searchParams.date).toBe('');
    expect(state.results).toEqual([]);
    expect(state.error).toBeNull();
  });
});
