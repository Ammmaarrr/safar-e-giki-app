import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Mock bus data
const buses = [
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

// Mock routes data
const routes = [
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

// Mock seat data generator
const generateSeats = (totalSeats: number) => {
  const bookedSeats = [3, 7, 12, 15, 21, 28, 33].filter((s) => s <= totalSeats);
  const femaleSeats = [5, 18, 24].filter((s) => s <= totalSeats);
  const maleSeats = [8, 16, 29].filter((s) => s <= totalSeats);

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

// GET /api/buses - List all buses
router.get('/', (req: Request, res: Response) => {
  res.json(buses);
});

// GET /api/buses/:id - Get bus by ID
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  const busId = parseInt(req.params.id);
  const bus = buses.find((b) => b.id === busId);

  if (!bus) {
    return res.status(404).json({ message: 'Bus not found' });
  }

  res.json(bus);
});

// GET /api/routes - Search routes
router.get('/routes', (req: Request, res: Response) => {
  const { from, to, date } = req.query;

  let filteredRoutes = routes;

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
    buses: buses,
    date: date || new Date().toISOString().split('T')[0],
  }));

  res.json(routesWithBuses);
});

// GET /api/routes/:id/seats - Get available seats for a route
router.get('/routes/:id/seats', (req: Request, res: Response) => {
  const { busId } = req.query;

  const bus = buses.find((b) => b.id === parseInt(String(busId)));
  if (!bus) {
    return res.status(404).json({ message: 'Bus not found' });
  }

  const seats = generateSeats(bus.totalSeats);
  res.json(seats);
});

export default router;
