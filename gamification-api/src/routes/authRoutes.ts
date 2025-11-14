// src/routes/authRoutes.ts
import express from 'express';
import { check } from 'express-validator';
import {
  login,
  registerAttendee,
  getMe
} from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

router.post(
  '/register',
  [
    check('first_name', 'First name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
    check('eventId', 'Event ID is required').not().isEmpty()
  ],
  registerAttendee
);

// Protected route
router.get('/me', protect, getMe);

export default router;