import { create } from 'zustand';
import type { Bus } from './searchStore';

export interface PassengerInfo {
  name: string;
  phone: string;
  email: string;
  cnic: string;
  emergencyContact: string;
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

export type BookingStep =
  | 'search'
  | 'listing'
  | 'seats'
  | 'details'
  | 'payment'
  | 'confirmation'
  | 'logo';

interface BookingState {
  currentStep: BookingStep;
  bookingData: BookingData;
  bookingId: string | null;
  isLoading: boolean;
  error: string | null;
  setStep: (step: BookingStep) => void;
  setBookingData: (data: Partial<BookingData>) => void;
  selectBus: (bus: Bus) => void;
  selectSeats: (seats: number[]) => void;
  setPassengerInfo: (info: PassengerInfo) => void;
  setBookingId: (id: string) => void;
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
  currentStep: 'logo',
  bookingData: initialBookingData,
  bookingId: null,
  isLoading: false,
  error: null,
  setStep: (step) => set({ currentStep: step }),
  setBookingData: (data) =>
    set((state) => ({
      bookingData: { ...state.bookingData, ...data },
    })),
  selectBus: (bus) =>
    set((state) => ({
      bookingData: { ...state.bookingData, selectedBus: bus },
      currentStep: 'seats',
    })),
  selectSeats: (seats) =>
    set((state) => ({
      bookingData: { ...state.bookingData, selectedSeats: seats },
      currentStep: 'details',
    })),
  setPassengerInfo: (info) =>
    set((state) => ({
      bookingData: { ...state.bookingData, passengerInfo: info },
      currentStep: 'payment',
    })),
  setBookingId: (id) => set({ bookingId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  resetBooking: () =>
    set({
      currentStep: 'search',
      bookingData: initialBookingData,
      bookingId: null,
      error: null,
    }),
}));
