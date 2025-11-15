import express from 'express';
import { check } from 'express-validator';
import { authController } from '../controllers/AuthController';
import { authMiddleware as protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Public routes
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login.bind(authController)
);

router.post(
  '/register',
  [
    check('fullName', 'Full name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 })
  ],
  authController.registerUser.bind(authController)
);

// Protected route
router.get('/me', protect, authController.getProfile.bind(authController));

export default router;
