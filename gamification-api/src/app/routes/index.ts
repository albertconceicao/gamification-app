import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import actionRoutes from './action.routes';
import eventRoutes from './event.routes';
import attendeeRoutes from './attendee.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/actions', actionRoutes);
router.use('/events', eventRoutes);
router.use('/attendees', attendeeRoutes);

// 404 handler
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

export default router;
