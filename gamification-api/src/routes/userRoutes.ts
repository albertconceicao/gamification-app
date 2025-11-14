// src/routes/userRoutes.ts
import express from 'express';
import { protect, admin } from '../middlewares/auth';
import {
  registerUser,
  getUsers,
  updateUser,
  deleteUser
} from '../controllers/userController';

const router = express.Router();

// Admin routes
router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, registerUser);

router.route('/:id')
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;