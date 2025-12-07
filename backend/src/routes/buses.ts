import { Router, Request, Response, NextFunction } from 'express';
import supabase from '../services/supabase';

const router = Router();

// Mock bus data (fallback when Supabase is not configured)
const busesMemory = [
  {
    id: 1,
    name: 'Safar e GIKI Express',
    departureTime: '08:00 AM',
    arrivalTime: '02:00 PM',
    duration: '6 hrs',
    price: 2500,
    seatsAvailable: 28,
    totalSeats: 30,
    type: 'AC Recliner',
    amenities: ['AC', 'Reclining Seats', 'Charging Ports', 'Refreshments'],
  },
  {
    id: 2,
    name: 'Safar e GIKI Comfort',
    departureTime: '02:00 PM',
    arrivalTime: '08:00 PM',
    duration: '6 hrs',
    price: 2800,
    seatsAvailable: 20,
    totalSeats: 25,
    type: 'Premium AC',
    amenities: ['AC', 'Extra Legroom', 'WiFi', 'Snacks', 'Music'],
  },
  {
    id: 3,
    name: 'Safar e GIKI Night',
    departureTime: '10:00 PM',
    arrivalTime: '04:00 AM',
    duration: '6 hrs',
    price: 2200,
    seatsAvailable: 35,
    totalSeats: 40,
    type: 'Standard AC',
    amenities: ['AC', 'Blankets', 'Pillow'],
  },
];

// Check if Supabase is configured
const isSupabaseConfigured = (): boolean => {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && supabase);
};

// GET /api/buses - List all buses
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isSupabaseConfigured()) {
      const { data: buses, error } = await supabase!
        .from('buses')
        .select('*')
        .order('id');

      if (error) {
        console.error('Supabase error fetching buses:', error);
        throw new Error('Failed to fetch buses');
      }

      // Transform to match expected format
      const transformedBuses = buses.map((bus) => ({
        id: bus.id,
        name: bus.name,
        operator: bus.operator,
        type: bus.bus_type,
        totalSeats: bus.total_seats,
        seatsAvailable: bus.total_seats, // Will be calculated based on bookings
        amenities: bus.amenities || [],
        imageUrl: bus.image_url,
      }));

      res.json(transformedBuses);
    } else {
      res.json(busesMemory);
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/buses/:id - Get bus by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const busId = parseInt(req.params.id);

    if (isSupabaseConfigured()) {
      const { data: bus, error } = await supabase!
        .from('buses')
        .select('*')
        .eq('id', busId)
        .single();

      if (error || !bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }

      res.json({
        id: bus.id,
        name: bus.name,
        operator: bus.operator,
        type: bus.bus_type,
        totalSeats: bus.total_seats,
        seatsAvailable: bus.total_seats,
        amenities: bus.amenities || [],
        imageUrl: bus.image_url,
      });
    } else {
      const bus = busesMemory.find((b) => b.id === busId);

      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }

      res.json(bus);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
