import { create } from 'zustand';

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

export interface BookingData {
  from: string;
  to: string;
  date: string;
  selectedBus: Bus | null;
  selectedSeats: number[];
  passengerInfo: PassengerInfo | null;
}

type BookingStep = 'search' | 'listing' | 'seats' | 'details' | 'payment' | 'confirmation';

interface BookingState {
  bookingData: BookingData;
  currentStep: BookingStep;
  bookingId: string | null;
  isLoading: boolean;
  error: string | null;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  setDate: (date: string) => void;
  setSelectedBus: (bus: Bus | null) => void;
  setSelectedSeats: (seats: number[]) => void;
  setPassengerInfo: (info: PassengerInfo | null) => void;
  setCurrentStep: (step: BookingStep) => void;
  setBookingId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetBooking: () => void;
}

const initialBookingData: BookingData = {
  from: 'GIKI',
  to: 'Multan',
  date: '',
  selectedBus: null,
  selectedSeats: [],
  passengerInfo: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  bookingData: initialBookingData,
  currentStep: 'search',
  bookingId: null,
  isLoading: false,
  error: null,
  setFrom: (from) => set((state) => ({ bookingData: { ...state.bookingData, from } })),
  setTo: (to) => set((state) => ({ bookingData: { ...state.bookingData, to } })),
  setDate: (date) => set((state) => ({ bookingData: { ...state.bookingData, date } })),
  setSelectedBus: (selectedBus) => set((state) => ({ bookingData: { ...state.bookingData, selectedBus } })),
  setSelectedSeats: (selectedSeats) => set((state) => ({ bookingData: { ...state.bookingData, selectedSeats } })),
  setPassengerInfo: (passengerInfo) => set((state) => ({ bookingData: { ...state.bookingData, passengerInfo } })),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setBookingId: (bookingId) => set({ bookingId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  resetBooking: () => set({ bookingData: initialBookingData, currentStep: 'search', bookingId: null, error: null }),
}));
