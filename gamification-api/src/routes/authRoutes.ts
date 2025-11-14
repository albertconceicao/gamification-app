import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController';
import { protect } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

export default router;
