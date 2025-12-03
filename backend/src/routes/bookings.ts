import { Router, Response, NextFunction } from 'express';
import { validate, createBookingSchema } from '../middleware/validation';
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// In-memory bookings store
export interface Booking {
  id: string;
  userId?: string;
  routeId: string;
  busId: number;
  busName: string;
  from: string;
  to: string;
  seats: number[];
  passengerInfo: {
    name: string;
    phone: string;
    email: string;
    cnic: string;
    emergencyContact: string;
    gender: string;
    boardingPoint: string;
    studentId?: string;
  };
  travelDate: string;
  departureTime: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentIntentId?: string;
  paymentTracker?: string;
  paymentReference?: string;
  createdAt: string;
}

export const bookings: Map<string, Booking> = new Map();

// Mock bus data for booking details
const busDetails: Record<number, { name: string; price: number; departureTime: string }> = {
  1: { name: 'Safar e GIKI Express', price: 2500, departureTime: '08:00 AM' },
  2: { name: 'Safar e GIKI Comfort', price: 2800, departureTime: '02:00 PM' },
  3: { name: 'Safar e GIKI Night', price: 2200, departureTime: '10:00 PM' },
};

// POST /api/bookings - Create a new booking
router.post(
  '/',
  optionalAuth,
  validate(createBookingSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { routeId, busId, seats, passengerInfo, travelDate } = req.body;

      const bus = busDetails[busId];
      if (!bus) {
        throw createError('Invalid bus ID', 400);
      }

      // Determine route details
      const [from, to] = routeId.includes('giki-multan')
        ? ['GIKI', 'Multan']
        : ['Multan', 'GIKI'];

      const booking: Booking = {
        id: `BK${Date.now().toString(36).toUpperCase()}`,
        userId: req.userId,
        routeId,
        busId,
        busName: bus.name,
        from,
        to,
        seats,
        passengerInfo,
        travelDate,
        departureTime: bus.departureTime,
        totalAmount: seats.length * bus.price,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      bookings.set(booking.id, booking);

      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/bookings - Get user's bookings
router.get(
  '/',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userBookings = Array.from(bookings.values()).filter(
        (b) => b.userId === req.userId
      );

      res.json(userBookings);
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/bookings/:id - Get booking by ID
router.get(
  '/:id',
  optionalAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = bookings.get(req.params.id);

      if (!booking) {
        throw createError('Booking not found', 404);
      }

      // If booking has a user, only that user can view it
      if (booking.userId && booking.userId !== req.userId) {
        throw createError('Not authorized to view this booking', 403);
      }

      res.json(booking);
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/bookings/:id/cancel - Cancel a booking
router.put(
  '/:id/cancel',
  optionalAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = bookings.get(req.params.id);

      if (!booking) {
        throw createError('Booking not found', 404);
      }

      // If booking has a user, only that user can cancel it
      if (booking.userId && booking.userId !== req.userId) {
        throw createError('Not authorized to cancel this booking', 403);
      }

      if (booking.status === 'cancelled') {
        throw createError('Booking is already cancelled', 400);
      }

      if (booking.status === 'completed') {
        throw createError('Cannot cancel a completed booking', 400);
      }

      booking.status = 'cancelled';
      if (booking.paymentStatus === 'paid') {
        booking.paymentStatus = 'refunded';
      }

      bookings.set(booking.id, booking);

      res.json(booking);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
