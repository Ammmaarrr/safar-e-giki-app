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

export default router;
