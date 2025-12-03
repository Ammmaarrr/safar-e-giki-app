import { Router, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validate, loginSchema, registerSchema } from '../middleware/validation';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// In-memory user store (replace with database in production)
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const users: Map<string, User> = new Map();

const generateToken = (user: User): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    secret,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
router.post(
  '/register',
  validate(registerSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, phone } = req.body;

      // Check if user already exists
      const existingUser = Array.from(users.values()).find((u) => u.email === email);
      if (existingUser) {
        throw createError('User already exists with this email', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        phone,
      };

      users.set(user.id, user);

      // Generate token
      const token = generateToken(user);

      res.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  validate(loginSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = Array.from(users.values()).find((u) => u.email === email);
      if (!user) {
        throw createError('Invalid email or password', 401);
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw createError('Invalid email or password', 401);
      }

      // Generate token
      const token = generateToken(user);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/auth/me
router.get(
  '/me',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = users.get(req.userId!);
      if (!user) {
        throw createError('User not found', 404);
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // In a real app, you might invalidate the token here
  res.json({ message: 'Logged out successfully' });
});

export default router;
