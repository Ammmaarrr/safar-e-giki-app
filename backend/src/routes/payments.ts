import { Router } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/auth.js';
import { payments, bookings, generateId } from '../utils/store.js';
import type { Payment, Booking } from '../models/types.js';

const router = Router();

const initiatePaymentSchema = z.object({
  bookingId: z.string(),
  amount: z.number().positive(),
  method: z.enum(['card', 'jazzcash', 'easypaisa', 'bank_transfer']),
});

const confirmPaymentSchema = z.object({
  paymentId: z.string(),
  transactionId: z.string(),
});

// POST /api/payments/initiate - Initiate a payment
router.post('/initiate', authenticateToken, validateBody(initiatePaymentSchema), (req: AuthenticatedRequest, res) => {
  try {
    const { bookingId, amount, method } = req.body;
    const userId = req.userId;

    // Verify booking exists and belongs to user
    const booking = bookings.get(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.userId !== userId) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    // Check if payment already exists for this booking
    const existingPayment = Array.from(payments.values()).find(
      (p) => p.bookingId === bookingId && p.status === 'completed'
    );
    if (existingPayment) {
      res.status(400).json({ message: 'Payment already completed for this booking' });
      return;
    }

    // Create payment
    const paymentId = generateId();
    const payment: Payment = {
      id: paymentId,
      bookingId,
      amount,
      status: 'pending',
      method,
      createdAt: new Date().toISOString(),
    };

    payments.set(paymentId, payment);

    // In a real implementation, this would integrate with payment gateways
    // and return a redirect URL for the payment provider
    res.status(201).json({
      ...payment,
      redirectUrl: null, // Would be payment gateway URL in production
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
});

// POST /api/payments/confirm - Confirm a payment
router.post('/confirm', authenticateToken, validateBody(confirmPaymentSchema), (req: AuthenticatedRequest, res) => {
  try {
    const { paymentId, transactionId } = req.body;

    const payment = payments.get(paymentId);
    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    if (payment.status === 'completed') {
      res.status(400).json({ message: 'Payment already confirmed' });
      return;
    }

    // Update payment status
    const updatedPayment: Payment = {
      ...payment,
      status: 'completed',
      transactionId,
    };
    payments.set(paymentId, updatedPayment);

    // Update booking status
    const booking = bookings.get(payment.bookingId);
    if (booking) {
      const updatedBooking: Booking = {
        ...booking,
        status: 'confirmed',
        paymentStatus: 'completed',
        updatedAt: new Date().toISOString(),
      };
      bookings.set(payment.bookingId, updatedBooking);
    }

    res.json(updatedPayment);
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
});

export default router;
