import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaymentStore } from '../stores/paymentStore';

describe('paymentStore', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePaymentStore());

    expect(result.current.clientSecret).toBeNull();
    expect(result.current.paymentIntentId).toBeNull();
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
    expect(result.current.amount).toBe(0);
    expect(result.current.currency).toBe('pkr');
    expect(result.current.isStripeReady).toBe(false);
  });

  it('should set client secret', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.setClientSecret('pi_test_secret');
    });

    expect(result.current.clientSecret).toBe('pi_test_secret');
  });

  it('should set payment intent id', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.setPaymentIntentId('pi_test_123');
    });

    expect(result.current.paymentIntentId).toBe('pi_test_123');
  });

  it('should set status', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.setStatus('processing');
    });

    expect(result.current.status).toBe('processing');
  });

  it('should set error', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.setError('Payment failed');
    });

    expect(result.current.error).toBe('Payment failed');
  });

  it('should set amount', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.setAmount(5000);
    });

    expect(result.current.amount).toBe(5000);
  });

  it('should set currency', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.setCurrency('usd');
    });

    expect(result.current.currency).toBe('usd');
  });

  it('should set stripe ready', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.setStripeReady(true);
    });

    expect(result.current.isStripeReady).toBe(true);
  });

  it('should reset payment state', () => {
    const { result } = renderHook(() => usePaymentStore());

    // Set some values
    act(() => {
      result.current.setClientSecret('pi_test_secret');
      result.current.setPaymentIntentId('pi_test_123');
      result.current.setStatus('succeeded');
      result.current.setAmount(5000);
      result.current.setError('Some error');
    });

    // Reset
    act(() => {
      result.current.resetPayment();
    });

    expect(result.current.clientSecret).toBeNull();
    expect(result.current.paymentIntentId).toBeNull();
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
    expect(result.current.amount).toBe(0);
  });
});
