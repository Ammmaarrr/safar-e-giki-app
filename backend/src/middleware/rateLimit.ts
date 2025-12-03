import rateLimit from 'express-rate-limit';

// General rate limiter for all API routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: { message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for booking operations
export const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 booking requests per windowMs
  message: { message: 'Too many booking requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for payment operations
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 payment requests per windowMs
  message: { message: 'Too many payment requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
