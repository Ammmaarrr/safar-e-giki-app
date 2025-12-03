import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { createError } from './errorHandler';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
        return next(createError('Validation failed', 400, errors));
      }
      next(error);
    }
  };
};

// Common validation schemas
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional(),
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    routeId: z.string(),
    busId: z.number(),
    seats: z.array(z.number()).min(1, 'Select at least one seat'),
    passengerInfo: z.object({
      name: z.string().min(2),
      phone: z.string(),
      email: z.string().email().optional().or(z.literal('')),
      cnic: z.string(),
      emergencyContact: z.string(),
      gender: z.string(),
      boardingPoint: z.string(),
      studentId: z.string().optional(),
    }),
    travelDate: z.string(),
  }),
});

export const createCheckoutSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    amount: z.number().positive(),
    currency: z.string().optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    tracker: z.string(),
    sig: z.string(),
    bookingId: z.string().optional(),
  }),
});
