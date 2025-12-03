import { Router } from 'express';
import { z } from 'zod';
import { validateBody, validateParams } from '../middleware/validation.js';
import { authenticateToken, type AuthenticatedRequest } from '../middleware/auth.js';
import { bookings, buses, generateId } from '../utils/store.js';
import type { Booking } from '../models/types.js';

const router = Router();

const passengerInfoSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  cnic: z.string().min(13, 'Valid CNIC is required'),
  emergencyContact: z.string().min(10, 'Emergency contact is required'),
  studentId: z.string().optional(),
});

const createBookingSchema = z.object({
  busId: z.number(),
  seatNumbers: z.array(z.number()).min(1, 'At least one seat must be selected'),
  passengerInfo: passengerInfoSchema,
  from: z.string(),
  to: z.string(),
  date: z.string(),
});

const idParamSchema = z.object({
  id: z.string(),
});

// POST /api/bookings - Create a booking
router.post('/', authenticateToken, validateBody(createBookingSchema), (req: AuthenticatedRequest, res) => {
  try {
    const { busId, seatNumbers, passengerInfo, from, to, date } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Find the bus
    const bus = buses.find((b) => b.id === busId);
    if (!bus) {
      res.status(404).json({ message: 'Bus not found' });
      return;
    }

    // Calculate total price
    const totalPrice = seatNumbers.length * bus.price;

    // Create booking
    const bookingId = generateId();
    const now = new Date().toISOString();

    const booking: Booking = {
      id: bookingId,
      userId,
      busId,
      busName: bus.name,
      seatNumbers,
      from,
      to,
      date,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      passengerInfo,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    bookings.set(bookingId, booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

// GET /api/bookings - Get user's bookings
router.get('/', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const userBookings = Array.from(bookings.values()).filter((b) => b.userId === userId);
  res.json(userBookings);
});

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', authenticateToken, validateParams(idParamSchema), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const booking = bookings.get(id);

  if (!booking) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }

  // Ensure user owns this booking
  if (booking.userId !== userId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  res.json(booking);
});

// PUT /api/bookings/:id/cancel - Cancel booking
router.put('/:id/cancel', authenticateToken, validateParams(idParamSchema), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const booking = bookings.get(id);

  if (!booking) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }

  // Ensure user owns this booking
  if (booking.userId !== userId) {
    res.status(403).json({ message: 'Access denied' });
    return;
  }

  // Check if booking can be cancelled
  if (booking.status === 'cancelled') {
    res.status(400).json({ message: 'Booking is already cancelled' });
    return;
  }

  // Update booking status
  const updatedBooking: Booking = {
    ...booking,
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  };

  bookings.set(id, updatedBooking);

  res.json(updatedBooking);
});

export default router;
