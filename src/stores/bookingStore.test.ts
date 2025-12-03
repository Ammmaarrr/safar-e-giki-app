import { describe, it, expect, beforeEach } from 'vitest';
import { useBookingStore } from '../stores/bookingStore';
import type { Bus } from '../stores/searchStore';

describe('bookingStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useBookingStore.setState({
      currentStep: 'logo',
      bookingData: {
        from: 'GIKI',
        to: 'Multan',
        date: '',
        selectedBus: null,
        selectedSeats: [],
        passengerInfo: null,
      },
      bookingId: null,
      isLoading: false,
      error: null,
    });
  });

  it('should initialize with default values', () => {
    const state = useBookingStore.getState();
    expect(state.currentStep).toBe('logo');
    expect(state.bookingData.from).toBe('GIKI');
    expect(state.bookingData.to).toBe('Multan');
    expect(state.bookingData.selectedBus).toBeNull();
    expect(state.bookingData.selectedSeats).toEqual([]);
  });

  it('should change step correctly', () => {
    useBookingStore.getState().setStep('search');
    expect(useBookingStore.getState().currentStep).toBe('search');

    useBookingStore.getState().setStep('listing');
    expect(useBookingStore.getState().currentStep).toBe('listing');
  });

  it('should update booking data', () => {
    useBookingStore.getState().setBookingData({
      from: 'Multan',
      to: 'GIKI',
      date: 'spring-2025-mid',
    });

    const state = useBookingStore.getState();
    expect(state.bookingData.from).toBe('Multan');
    expect(state.bookingData.to).toBe('GIKI');
    expect(state.bookingData.date).toBe('spring-2025-mid');
  });

  it('should select bus and advance to seats step', () => {
    const mockBus: Bus = {
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
    };

    useBookingStore.getState().selectBus(mockBus);

    const state = useBookingStore.getState();
    expect(state.bookingData.selectedBus).toEqual(mockBus);
    expect(state.currentStep).toBe('seats');
  });

  it('should select seats and advance to details step', () => {
    const seats = [1, 2, 3];
    useBookingStore.getState().selectSeats(seats);

    const state = useBookingStore.getState();
    expect(state.bookingData.selectedSeats).toEqual(seats);
    expect(state.currentStep).toBe('details');
  });

  it('should set passenger info and advance to payment step', () => {
    const passengerInfo = {
      name: 'Test User',
      phone: '03001234567',
      email: 'test@example.com',
      cnic: '1234567890123',
      emergencyContact: '03009876543',
      studentId: 'STU-001',
    };

    useBookingStore.getState().setPassengerInfo(passengerInfo);

    const state = useBookingStore.getState();
    expect(state.bookingData.passengerInfo).toEqual(passengerInfo);
    expect(state.currentStep).toBe('payment');
  });

  it('should reset booking', () => {
    // Set some data first
    useBookingStore.getState().setStep('payment');
    useBookingStore.getState().setBookingData({
      from: 'Multan',
      to: 'GIKI',
      date: 'spring-2025-mid',
    });
    useBookingStore.getState().setBookingId('booking-123');

    // Reset
    useBookingStore.getState().resetBooking();

    const state = useBookingStore.getState();
    expect(state.currentStep).toBe('search');
    expect(state.bookingData.from).toBe('GIKI');
    expect(state.bookingData.to).toBe('Multan');
    expect(state.bookingId).toBeNull();
  });
});
