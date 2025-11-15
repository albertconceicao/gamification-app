import express from 'express';
import { authMiddleware as protect, adminMiddleware as admin } from '../middlewares/auth.middleware';
import { userController } from '../controllers/UserController';
import { userActionController } from '../controllers/UserActionController';

const router = express.Router();

// Admin routes
router.route('/')
  .get(protect, admin, userController.getUsers.bind(userController))
  .post(protect, admin, userController.registerUser.bind(userController));

router.route('/:id')
  .put(protect, admin, userController.updateUser.bind(userController))
  .delete(protect, admin, userController.deleteUser.bind(userController));

// POST /api/users/actions - Perform an action (frontend endpoint)
router.post('/actions', userActionController.performAction.bind(userActionController));

export default router;
