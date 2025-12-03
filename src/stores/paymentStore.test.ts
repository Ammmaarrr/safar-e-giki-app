import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaymentStore } from '../stores/paymentStore';

describe('paymentStore', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePaymentStore());

    expect(result.current.tracker).toBeNull();
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
    expect(result.current.amount).toBe(0);
    expect(result.current.currency).toBe('PKR');
    expect(result.current.isProcessing).toBe(false);
  });

  it('should set tracker', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.setTracker('tracker_test_123');
    });

    expect(result.current.tracker).toBe('tracker_test_123');
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

    expect(result.current.currency).toBe('USD');
  });

  it('should set processing state', () => {
    const { result } = renderHook(() => usePaymentStore());

    act(() => {
      result.current.setProcessing(true);
    });

    expect(result.current.isProcessing).toBe(true);
  });

  it('should reset payment state', () => {
    const { result } = renderHook(() => usePaymentStore());

    // Set some values
    act(() => {
      result.current.setTracker('tracker_test_123');
      result.current.setStatus('succeeded');
      result.current.setAmount(5000);
      result.current.setError('Some error');
      result.current.setProcessing(true);
    });

    // Reset
    act(() => {
      result.current.resetPayment();
    });

    expect(result.current.tracker).toBeNull();
    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
    expect(result.current.amount).toBe(0);
    expect(result.current.isProcessing).toBe(false);
  });
});
