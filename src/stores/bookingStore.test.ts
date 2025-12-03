import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookingStore } from '../stores/bookingStore';

describe('bookingStore', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useBookingStore());

    expect(result.current.bookingData.from).toBe('GIKI');
    expect(result.current.bookingData.to).toBe('Multan');
    expect(result.current.bookingData.date).toBe('');
    expect(result.current.bookingData.selectedBus).toBeNull();
    expect(result.current.bookingData.selectedSeats).toEqual([]);
    expect(result.current.bookingData.passengerInfo).toBeNull();
    expect(result.current.currentStep).toBe('search');
  });

  it('should update from location', () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setFrom('Multan');
    });

    expect(result.current.bookingData.from).toBe('Multan');
  });

  it('should update to location', () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setTo('GIKI');
    });

    expect(result.current.bookingData.to).toBe('GIKI');
  });

  it('should update date', () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setDate('spring-2025-mid');
    });

    expect(result.current.bookingData.date).toBe('spring-2025-mid');
  });

  it('should update selected seats', () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setSelectedSeats([1, 2, 3]);
    });

    expect(result.current.bookingData.selectedSeats).toEqual([1, 2, 3]);
  });

  it('should update current step', () => {
    const { result } = renderHook(() => useBookingStore());

    act(() => {
      result.current.setCurrentStep('listing');
    });

    expect(result.current.currentStep).toBe('listing');
  });

  it('should reset booking', () => {
    const { result } = renderHook(() => useBookingStore());

    // Make some changes
    act(() => {
      result.current.setFrom('Multan');
      result.current.setTo('GIKI');
      result.current.setDate('spring-2025-mid');
      result.current.setSelectedSeats([1, 2]);
      result.current.setCurrentStep('payment');
    });

    // Reset
    act(() => {
      result.current.resetBooking();
    });

    expect(result.current.bookingData.from).toBe('GIKI');
    expect(result.current.bookingData.to).toBe('Multan');
    expect(result.current.bookingData.date).toBe('');
    expect(result.current.bookingData.selectedSeats).toEqual([]);
    expect(result.current.currentStep).toBe('search');
  });

  it('should set selected bus', () => {
    const { result } = renderHook(() => useBookingStore());

    const mockBus = {
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

    act(() => {
      result.current.setSelectedBus(mockBus);
    });

    expect(result.current.bookingData.selectedBus).toEqual(mockBus);
  });

  it('should set passenger info', () => {
    const { result } = renderHook(() => useBookingStore());

    const mockPassengerInfo = {
      name: 'Test User',
      phone: '03001234567',
      email: 'test@example.com',
      cnic: '1234567890123',
      emergencyContact: '03009876543',
      gender: 'Male',
      boardingPoint: 'GIKI Main Gate',
      studentId: '2021-BSCS-01',
    };

    act(() => {
      result.current.setPassengerInfo(mockPassengerInfo);
    });

    expect(result.current.bookingData.passengerInfo).toEqual(mockPassengerInfo);
  });
});
