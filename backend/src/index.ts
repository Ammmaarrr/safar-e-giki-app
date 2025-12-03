import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import busesRoutes from './routes/buses';
import routesRoutes from './routes/routes';
import bookingsRoutes from './routes/bookings';
import paymentsRoutes from './routes/payments';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter, paymentLimiter } from './middleware/rateLimit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Apply general rate limiting to all API routes
app.use('/api', apiLimiter);

// Raw body for Stripe webhooks
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// JSON body parser for other routes
app.use(express.json());

// Routes with specific rate limiters
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/buses', busesRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentLimiter, paymentsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
