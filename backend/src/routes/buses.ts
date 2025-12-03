import { Router } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validation.js';
import { buses, generateSeats } from '../utils/store.js';

const router = Router();

const searchRoutesSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.string().optional(),
});

// GET /api/buses - List all buses
// GET /api/routes - Search routes (when mounted at /api/routes)
router.get('/', validateQuery(searchRoutesSchema), (req, res) => {
  const { from, to, date } = req.query as { from?: string; to?: string; date?: string };

  // Filter buses based on search parameters
  // In a real app with a database, this would be a proper query
  let filteredBuses = [...buses];

  // For now, we return all buses as they all operate on the route
  // In production, this would filter by actual route schedules
  if (from && to) {
    // Mock filtering - in production, match against route data
    filteredBuses = buses;
  }

  if (date) {
    // Mock filtering - in production, check availability for the date
    filteredBuses = filteredBuses;
  }

  res.json(filteredBuses);
});

// GET /api/buses/:id - Get bus by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid bus ID' });
    return;
  }

  const bus = buses.find((b) => b.id === id);

  if (!bus) {
    res.status(404).json({ message: 'Bus not found' });
    return;
  }

  res.json(bus);
});

// GET /api/routes/:id/seats - Get available seats for a route/bus
router.get('/:id/seats', (req, res) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid route ID' });
    return;
  }

  const bus = buses.find((b) => b.id === id);

  if (!bus) {
    res.status(404).json({ message: 'Bus not found' });
    return;
  }

  const seats = generateSeats(id);
  res.json(seats);
});

export default router;
