import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IUser } from '../models/User';
import { authRepository } from '../repositories/AuthRepository';
import { userRepository } from '../repositories/UserRepository';
import logger from '../utils/logger';
import { StatusCode } from '../utils/statusCode';

export class AuthController {
  // @desc    Authenticate user & get token
  // @route   POST /api/auth/login
  // @access  Public
  async login(req: Request, res: Response) {
    logger.info('login >> Start >>');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.debug('login - Validation errors: ', errors.array());
      return res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    logger.debug('email: ', email);

    try {
      const { user, isValid } = await authRepository.loginUser(email, password);
      
      if (!user || !isValid) {
        logger.info('login << End << - Invalid credentials');
        return res.status(StatusCode.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT
      const token = user.generateAuthToken();

      // Remove password from response
      const userResponse = user.toObject();
      delete (userResponse as { password?: string }).password;

      logger.info('login << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        token,
        user: userResponse
      });
    } catch (error: any) {
      logger.error('login :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  // @desc    Register a new user
  // @route   POST /api/auth/register
  // @access  Public
  async registerUser(req: Request, res: Response) {
    logger.info('registerUser >> Start >>');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.debug('registerUser - Validation errors: ', errors.array());
      return res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { fullName, email, password } = req.body;
    logger.debug('email: ', email);
    logger.debug('fullName: ', fullName);

    try {
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
        role: 'manager'
      });

      // Generate JWT
      const token = user.generateAuthToken();

      // Remove password from response
      const userResponse = user.toObject();
      delete (userResponse as { password?: string }).password;

      logger.info('registerUser << End <<');
      res.status(StatusCode.CREATED).json({
        success: true,
        token,
        user: userResponse
      });
    } catch (error: any) {
      logger.error('registerUser :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }

  // @desc    Get user profile
  // @route   GET /api/auth/me
  // @access  Private
  async getProfile(req: Request, res: Response) {
    logger.info('getProfile >> Start >>');

    const userId = (req as any).user?.id;
    logger.debug('userId: ', userId);

    try {
      // req.user is set by the auth middleware
      const user = await authRepository.getProfile(userId);
      
      if (!user) {
        logger.info('getProfile << End << - User not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'User not found'
        });
      }

      logger.info('getProfile << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      logger.error('getProfile :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const authController = new AuthController();
