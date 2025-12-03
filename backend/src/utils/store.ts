import type { User, Bus, Booking, Payment, Seat } from '../models/types.js';

// In-memory data store (would be replaced with a real database in production)
export const users: Map<string, User> = new Map();
export const bookings: Map<string, Booking> = new Map();
export const payments: Map<string, Payment> = new Map();

// Mock bus data
export const buses: Bus[] = [
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
    amenities: ['AC', 'Charging Ports'],
  },
];

// Generate mock seats for a bus
export function generateSeats(busId: number): Seat[] {
  const bus = buses.find((b) => b.id === busId);
  if (!bus) return [];

  const seats: Seat[] = [];
  const occupiedSeats = new Set([3, 7, 12, 15, 22]); // Mock some occupied seats

  for (let i = 1; i <= bus.totalSeats; i++) {
    const type: 'window' | 'aisle' | 'middle' =
      i % 4 === 1 || i % 4 === 0 ? 'window' : i % 4 === 2 ? 'aisle' : 'middle';
    seats.push({
      id: i,
      number: i,
      isAvailable: !occupiedSeats.has(i),
      type,
      price: bus.price,
    });
  }
  return seats;
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
