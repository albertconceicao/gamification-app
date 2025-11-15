import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IUser } from '../models/User';
import { userRepository } from '../repositories/UserRepository';
import logger from '../utils/logger';
import { StatusCode } from '../utils/statusCode';

export class UserController {
  // @desc    Register a new user (admin/manager)
  // @route   POST /api/users/register
  // @access  Private/Admin
  async registerUser(req: Request, res: Response) {
    logger.info('registerUser >> Start >>');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.debug('registerUser - Validation errors: ', errors.array());
      return res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { email, password, role, fullName } = req.body;
    logger.debug('email: ', email);
    logger.debug('role: ', role);

    try {
      if (!fullName) {
        logger.info('registerUser << End << - Missing fullName');
        return res.status(StatusCode.BAD_REQUEST).json({ message: 'Full name is required' });
      }

      // Check if user already exists
      const existingUser = await userRepository.findByEmail(email);
      
      if (existingUser) {
        logger.info('registerUser << End << - User already exists');
        return res.status(StatusCode.BAD_REQUEST).json({ 
          success: false,
          message: 'User already exists with this email' 
        });
      }

      // Create user
      const user = await userRepository.createUser({
        email,
        password,
        fullName,
        role: role || 'manager'
      });

      // Remove password from response
      const userResponse = user.toObject();
      delete (userResponse as { password?: string }).password;

      logger.info('registerUser << End <<');
      res.status(StatusCode.CREATED).json({
        success: true,
        data: userResponse
      });
    } catch (error: any) {
      logger.error('registerUser :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // @desc    Get all users
  // @route   GET /api/users
  // @access  Private/Admin
  async getUsers(req: Request, res: Response) {
    logger.info('getUsers >> Start >>');

    try {
      const users = await userRepository.findAll();
      logger.info('getUsers << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error: any) {
      logger.error('getUsers :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // @desc    Update user
  // @route   PUT /api/users/:id
  // @access  Private/Admin
  async updateUser(req: Request, res: Response) {
    logger.info('updateUser >> Start >>');

    const { email, role, fullName } = req.body;
    const userId = req.params.id;
    logger.debug('userId: ', userId);
    logger.debug('updateData: ', { email, role, fullName });

    try {
      const updateData: Partial<IUser> = {};
      if (email !== undefined) updateData.email = email;
      if (role !== undefined) updateData.role = role;
      if (fullName !== undefined) updateData.fullName = fullName;

      const updatedUser = await userRepository.updateUser(userId, updateData);

      if (!updatedUser) {
        logger.info('updateUser << End << - User not found');
        return res.status(StatusCode.NOT_FOUND).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      logger.info('updateUser << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        data: updatedUser
      });
    } catch (error: any) {
      logger.error('updateUser :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // @desc    Delete user
  // @route   DELETE /api/users/:id
  // @access  Private/Admin
  async deleteUser(req: Request, res: Response) {
    logger.info('deleteUser >> Start >>');

    const userId = req.params.id;
    logger.debug('userId: ', userId);

    try {
      const deleted = await userRepository.deleteUser(userId);
      
      if (!deleted) {
        logger.info('deleteUser << End << - User not found');
        return res.status(StatusCode.NOT_FOUND).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      logger.info('deleteUser << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      logger.error('deleteUser :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ 
        success: false,
        message: error.message 
      });
    }
  }
}

export const userController = new UserController();
