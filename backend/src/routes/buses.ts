import { Router } from 'express';
import { z } from 'zod';
import { validateQuery, validateParams } from '../middleware/validation.js';
import { buses, generateSeats } from '../utils/store.js';

const router = Router();

const searchRoutesSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  date: z.string().optional(),
});

const idParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

// GET /api/buses - List all buses
router.get('/', (req, res) => {
  res.json(buses);
});

// GET /api/buses/:id - Get bus by ID
router.get('/:id', validateParams(idParamSchema), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bus = buses.find((b) => b.id === id);

  if (!bus) {
    res.status(404).json({ message: 'Bus not found' });
    return;
  }

  res.json(bus);
});

// GET /api/routes - Search routes (also available buses)
router.get('/search', validateQuery(searchRoutesSchema), (req, res) => {
  // For now, return all buses as available routes
  // In a real app, this would filter based on from, to, and date
  const { from, to, date } = req.query;

  // Simple filtering logic
  let filteredBuses = [...buses];

  // If search parameters are provided, we return all buses
  // In production, this would query actual route schedules
  if (from || to || date) {
    // Mock: Just return all buses as they all operate on the route
    filteredBuses = buses;
  }

  res.json(filteredBuses);
});

// GET /api/routes/:id/seats - Get available seats for a route/bus
router.get('/:id/seats', validateParams(idParamSchema), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const bus = buses.find((b) => b.id === id);

  if (!bus) {
    res.status(404).json({ message: 'Bus not found' });
    return;
  }

  const seats = generateSeats(id);
  res.json(seats);
});

export default router;
