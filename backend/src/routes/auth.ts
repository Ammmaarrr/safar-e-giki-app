import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { validateBody } from '../middleware/validation.js';
import { authenticateToken, generateToken, type AuthenticatedRequest } from '../middleware/auth.js';
import { users, generateId } from '../utils/store.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  studentId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/register
router.post('/register', validateBody(registerSchema), async (req, res) => {
  try {
    const { name, email, password, phone, studentId } = req.body;

    // Check if user already exists
    const existingUser = Array.from(users.values()).find((u) => u.email === email);
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = generateId();
    const user = {
      id: userId,
      name,
      email,
      phone,
      studentId,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.set(userId, user);

    // Generate token
    const token = generateToken(userId, email);

    res.status(201).json({
      user: {
        id: userId,
        name,
        email,
        phone,
        studentId,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = Array.from(users.values()).find((u) => u.email === email);
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  const user = users.get(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    studentId: user.studentId,
  });
});

export default router;
