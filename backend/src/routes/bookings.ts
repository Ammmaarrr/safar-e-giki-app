import { Router, Response, NextFunction } from 'express';
import { validate, createBookingSchema } from '../middleware/validation';
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import supabase from '../services/supabase';

const router = Router();

// In-memory bookings store (fallback when Supabase is not configured)
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
  paymentTracker?: string;
  paymentReference?: string;
  createdAt: string;
}

export const bookings: Map<string, Booking> = new Map();

// Mock bus data for booking details (fallback)
const busDetails: Record<number, { name: string; price: number; departureTime: string }> = {
  1: { name: 'Safar e GIKI Express', price: 2500, departureTime: '08:00 AM' },
  2: { name: 'Safar e GIKI Comfort', price: 2800, departureTime: '02:00 PM' },
  3: { name: 'Safar e GIKI Night', price: 2200, departureTime: '10:00 PM' },
};

// Check if Supabase is configured
const isSupabaseConfigured = (): boolean => {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && supabase);
};

// Database booking record interface
interface DbBooking {
  id: string;
  user_id: string | null;
  route_id: string;
  bus_id: number;
  bus_name: string;
  from_city: string;
  to_city: string;
  seats: number[];
  passenger_name: string;
  passenger_phone: string;
  passenger_email: string | null;
  passenger_cnic: string;
  passenger_emergency_contact: string | null;
  passenger_gender: string | null;
  passenger_boarding_point: string | null;
  passenger_student_id: string | null;
  travel_date: string;
  departure_time: string;
  total_amount: number | string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_tracker: string | null;
  payment_reference: string | null;
  created_at: string;
}

// Helper to transform DB booking to API format
const transformDbBooking = (dbBooking: DbBooking): Booking => ({
  id: dbBooking.id,
  userId: dbBooking.user_id || undefined,
  routeId: dbBooking.route_id,
  busId: dbBooking.bus_id,
  busName: dbBooking.bus_name,
  from: dbBooking.from_city,
  to: dbBooking.to_city,
  seats: dbBooking.seats,
  passengerInfo: {
    name: dbBooking.passenger_name,
    phone: dbBooking.passenger_phone,
    email: dbBooking.passenger_email || '',
    cnic: dbBooking.passenger_cnic,
    emergencyContact: dbBooking.passenger_emergency_contact || '',
    gender: dbBooking.passenger_gender || '',
    boardingPoint: dbBooking.passenger_boarding_point || '',
    studentId: dbBooking.passenger_student_id || undefined,
  },
  travelDate: dbBooking.travel_date,
  departureTime: dbBooking.departure_time,
  totalAmount: Number(dbBooking.total_amount),
  status: dbBooking.status,
  paymentStatus: dbBooking.payment_status,
  paymentTracker: dbBooking.payment_tracker || undefined,
  paymentReference: dbBooking.payment_reference || undefined,
  createdAt: dbBooking.created_at,
});

// POST /api/bookings - Create a new booking
router.post(
  '/',
  optionalAuth,
  validate(createBookingSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { routeId, busId, seats, passengerInfo, travelDate } = req.body;

      if (isSupabaseConfigured()) {
        // Get bus details from Supabase
        const { data: routeData, error: routeError } = await supabase!
          .from('routes')
          .select(`
            *,
            buses (
              id,
              name,
              bus_type,
              total_seats
            )
          `)
          .eq('bus_id', busId)
          .single();

        let busName: string;
        let price: number;
        let departureTime: string;
        let fromCity: string;
        let toCity: string;

        if (routeData && !routeError) {
          busName = routeData.buses.name;
          price = Number(routeData.price);
          departureTime = routeData.departure_time;
          fromCity = routeData.from_city;
          toCity = routeData.to_city;
        } else {
          // Fallback to mock data if route not found
          const bus = busDetails[busId];
          if (!bus) {
            throw createError('Invalid bus ID', 400);
          }
          busName = bus.name;
          price = bus.price;
          departureTime = bus.departureTime;
          const routeParts = routeId.includes('giki-multan')
            ? ['GIKI', 'Multan']
            : ['Multan', 'GIKI'];
          fromCity = routeParts[0];
          toCity = routeParts[1];
        }

        const bookingId = `BK${Date.now().toString(36).toUpperCase()}`;
        const totalAmount = seats.length * price;

        // Insert booking into Supabase
        const { data: newBooking, error: insertError } = await supabase!
          .from('bookings')
          .insert({
            id: bookingId,
            user_id: req.userId || null,
            route_id: routeId,
            bus_id: busId,
            bus_name: busName,
            from_city: fromCity,
            to_city: toCity,
            seats: seats,
            passenger_name: passengerInfo.name,
            passenger_phone: passengerInfo.phone,
            passenger_email: passengerInfo.email || null,
            passenger_cnic: passengerInfo.cnic,
            passenger_emergency_contact: passengerInfo.emergencyContact || null,
            passenger_gender: passengerInfo.gender || null,
            passenger_boarding_point: passengerInfo.boardingPoint || null,
            passenger_student_id: passengerInfo.studentId || null,
            travel_date: travelDate,
            departure_time: departureTime,
            total_amount: totalAmount,
            status: 'pending',
            payment_status: 'pending',
          })
          .select()
          .single();

        if (insertError) {
          console.error('Supabase error creating booking:', insertError);
          throw createError('Failed to create booking', 500);
        }

        res.status(201).json(transformDbBooking(newBooking));
      } else {
        // Fallback to in-memory store
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
      }
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
      if (isSupabaseConfigured()) {
        const { data: userBookings, error } = await supabase!
          .from('bookings')
          .select('*')
          .eq('user_id', req.userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error fetching bookings:', error);
          throw createError('Failed to fetch bookings', 500);
        }

        res.json(userBookings.map(transformDbBooking));
      } else {
        // Fallback to in-memory store
        const userBookings = Array.from(bookings.values()).filter(
          (b) => b.userId === req.userId
        );

        res.json(userBookings);
      }
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
      if (isSupabaseConfigured()) {
        const { data: booking, error } = await supabase!
          .from('bookings')
          .select('*')
          .eq('id', req.params.id)
          .single();

        if (error || !booking) {
          throw createError('Booking not found', 404);
        }

        // If booking has a user, only that user can view it
        if (booking.user_id && booking.user_id !== req.userId) {
          throw createError('Not authorized to view this booking', 403);
        }

        res.json(transformDbBooking(booking));
      } else {
        // Fallback to in-memory store
        const booking = bookings.get(req.params.id);

        if (!booking) {
          throw createError('Booking not found', 404);
        }

        // If booking has a user, only that user can view it
        if (booking.userId && booking.userId !== req.userId) {
          throw createError('Not authorized to view this booking', 403);
        }

        res.json(booking);
      }
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
      if (isSupabaseConfigured()) {
        // Get the booking first
        const { data: booking, error: fetchError } = await supabase!
          .from('bookings')
          .select('*')
          .eq('id', req.params.id)
          .single();

        if (fetchError || !booking) {
          throw createError('Booking not found', 404);
        }

        // If booking has a user, only that user can cancel it
        if (booking.user_id && booking.user_id !== req.userId) {
          throw createError('Not authorized to cancel this booking', 403);
        }

        if (booking.status === 'cancelled') {
          throw createError('Booking is already cancelled', 400);
        }

        if (booking.status === 'completed') {
          throw createError('Cannot cancel a completed booking', 400);
        }

        // Update the booking status
        const newPaymentStatus = booking.payment_status === 'paid' ? 'refunded' : booking.payment_status;

        const { data: updatedBooking, error: updateError } = await supabase!
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: newPaymentStatus,
          })
          .eq('id', req.params.id)
          .select()
          .single();

        if (updateError) {
          console.error('Supabase error cancelling booking:', updateError);
          throw createError('Failed to cancel booking', 500);
        }

        res.json(transformDbBooking(updatedBooking));
      } else {
        // Fallback to in-memory store
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
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
