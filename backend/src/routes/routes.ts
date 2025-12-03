import { Router, Request, Response, NextFunction } from 'express';
import supabase from '../services/supabase';

const router = Router();

// Mock routes data (fallback when Supabase is not configured)
const routesMemory = [
  {
    id: 'giki-multan',
    from: 'GIKI',
    to: 'Multan',
    distance: '450 km',
    estimatedTime: '6 hrs',
  },
  {
    id: 'multan-giki',
    from: 'Multan',
    to: 'GIKI',
    distance: '450 km',
    estimatedTime: '6 hrs',
  },
];

// Mock bus data (fallback)
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

// Mock seat data generator
const generateSeats = (totalSeats: number, bookedSeatsArray: number[] = []) => {
  const defaultBookedSeats = [3, 7, 12, 15, 21, 28, 33].filter((s) => s <= totalSeats);
  const femaleSeats = [5, 18, 24].filter((s) => s <= totalSeats);
  const maleSeats = [8, 16, 29].filter((s) => s <= totalSeats);

  const bookedSeats = bookedSeatsArray.length > 0 ? bookedSeatsArray : defaultBookedSeats;

  const seats = [];
  for (let i = 1; i <= totalSeats; i++) {
    let status: 'available' | 'booked' | 'female' | 'male' = 'available';
    if (bookedSeats.includes(i)) status = 'booked';
    else if (femaleSeats.includes(i)) status = 'female';
    else if (maleSeats.includes(i)) status = 'male';

    seats.push({ number: i, status });
  }
  return seats;
};

// GET /api/routes - Search routes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, date } = req.query;

    if (isSupabaseConfigured()) {
      let query = supabase!
        .from('routes')
        .select(`
          *,
          buses (
            id,
            name,
            operator,
            bus_type,
            total_seats,
            amenities,
            image_url
          )
        `);

      if (from) {
        query = query.ilike('from_city', String(from));
      }

      if (to) {
        query = query.ilike('to_city', String(to));
      }

      const { data: routes, error } = await query;

      if (error) {
        console.error('Supabase error fetching routes:', error);
        throw new Error('Failed to fetch routes');
      }

      // Group routes by from/to and transform
      const routeGroups: Record<string, {
        id: string;
        from: string;
        to: string;
        distance: string;
        estimatedTime: string;
        buses: typeof busesMemory;
        date: string;
      }> = {};

      routes.forEach((route) => {
        const groupKey = `${route.from_city.toLowerCase()}-${route.to_city.toLowerCase()}`;
        
        if (!routeGroups[groupKey]) {
          routeGroups[groupKey] = {
            id: groupKey,
            from: route.from_city,
            to: route.to_city,
            distance: '450 km', // Default distance
            estimatedTime: route.duration,
            buses: [],
            date: date ? String(date) : new Date().toISOString().split('T')[0],
          };
        }

        routeGroups[groupKey].buses.push({
          id: route.buses.id,
          name: route.buses.name,
          departureTime: route.departure_time,
          arrivalTime: route.arrival_time,
          duration: route.duration,
          price: Number(route.price),
          seatsAvailable: route.buses.total_seats,
          totalSeats: route.buses.total_seats,
          type: route.buses.bus_type,
          amenities: route.buses.amenities || [],
        });
      });

      res.json(Object.values(routeGroups));
    } else {
      // Fallback to in-memory data
      let filteredRoutes = routesMemory;

      if (from) {
        filteredRoutes = filteredRoutes.filter(
          (r) => r.from.toLowerCase() === String(from).toLowerCase()
        );
      }

      if (to) {
        filteredRoutes = filteredRoutes.filter(
          (r) => r.to.toLowerCase() === String(to).toLowerCase()
        );
      }

      // Return routes with available buses
      const routesWithBuses = filteredRoutes.map((route) => ({
        ...route,
        buses: busesMemory,
        date: date || new Date().toISOString().split('T')[0],
      }));

      res.json(routesWithBuses);
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/routes/:id/seats - Get available seats for a route
router.get('/:id/seats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { busId, date } = req.query;
    const busIdNum = parseInt(String(busId));

    if (isSupabaseConfigured()) {
      // Get bus info
      const { data: bus, error: busError } = await supabase!
        .from('buses')
        .select('total_seats')
        .eq('id', busIdNum)
        .single();

      if (busError || !bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }

      // Get booked seats for this bus and date
      let bookedSeats: number[] = [];
      
      if (date) {
        const { data: bookings } = await supabase!
          .from('bookings')
          .select('seats')
          .eq('bus_id', busIdNum)
          .eq('travel_date', String(date))
          .in('status', ['pending', 'confirmed']);

        if (bookings) {
          bookedSeats = bookings.flatMap((b) => b.seats || []);
        }
      }

      const seats = generateSeats(bus.total_seats, bookedSeats);
      res.json(seats);
    } else {
      // Fallback to in-memory data
      const bus = busesMemory.find((b) => b.id === busIdNum);
      if (!bus) {
        return res.status(404).json({ message: 'Bus not found' });
      }

      const seats = generateSeats(bus.totalSeats);
      res.json(seats);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
