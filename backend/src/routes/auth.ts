import { Router, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validate, loginSchema, registerSchema } from '../middleware/validation';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import supabase from '../services/supabase';

const router = Router();

// User interface matching database schema
interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  cnic?: string;
  student_id?: string;
}

// In-memory user store (fallback when Supabase is not configured)
const usersMemory: Map<string, User & { password: string }> = new Map();

const generateToken = (user: { id: string; email: string; name: string }): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    secret,
    { expiresIn: '7d' }
  );
};

// Check if Supabase is configured
const isSupabaseConfigured = (): boolean => {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && supabase);
};

// POST /api/auth/register
router.post(
  '/register',
  validate(registerSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, phone } = req.body;

      if (isSupabaseConfigured()) {
        // Check if user already exists in Supabase
        const { data: existingUser } = await supabase!
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        if (existingUser) {
          throw createError('User already exists with this email', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in Supabase
        const { data: newUser, error } = await supabase!
          .from('users')
          .insert({
            email,
            password_hash: hashedPassword,
            name,
            phone,
          })
          .select('id, name, email, phone')
          .single();

        if (error) {
          console.error('Supabase error creating user:', error);
          throw createError('Failed to create user', 500);
        }

        // Generate token
        const token = generateToken(newUser);

        res.status(201).json({
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
          },
          token,
        });
      } else {
        // Fallback to in-memory store
        const existingUser = Array.from(usersMemory.values()).find((u) => u.email === email);
        if (existingUser) {
          throw createError('User already exists with this email', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
          id: `user_${Date.now()}`,
          name,
          email,
          password: hashedPassword,
          password_hash: hashedPassword,
          phone,
        };

        usersMemory.set(user.id, user);

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
      }
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

      if (isSupabaseConfigured()) {
        // Find user in Supabase
        const { data: user, error } = await supabase!
          .from('users')
          .select('id, name, email, password_hash, phone')
          .eq('email', email)
          .single();

        if (error || !user) {
          throw createError('Invalid email or password', 401);
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
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
      } else {
        // Fallback to in-memory store
        const user = Array.from(usersMemory.values()).find((u) => u.email === email);
        if (!user) {
          throw createError('Invalid email or password', 401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw createError('Invalid email or password', 401);
        }

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
      }
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
      if (isSupabaseConfigured()) {
        const { data: user, error } = await supabase!
          .from('users')
          .select('id, name, email, phone, cnic, student_id')
          .eq('id', req.userId)
          .single();

        if (error || !user) {
          throw createError('User not found', 404);
        }

        res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          cnic: user.cnic,
          studentId: user.student_id,
        });
      } else {
        // Fallback to in-memory store
        const user = usersMemory.get(req.userId!);
        if (!user) {
          throw createError('User not found', 404);
        }

        res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      }
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
