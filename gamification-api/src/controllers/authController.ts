// src/controllers/authController.ts
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, type = 'user' } = req.body;

  try {
    let user;
    if (type === 'admin') {
      user = await User.findOne({ email }).select('+password');
    } else {
      user = await User.findOne({ email }).select('+password');
    }

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login for admin users
    if (type === 'admin') {
      (user as any).lastLogin = new Date();
      await user.save();
    }

    const token = user.generateAuthToken();
    const userData = user.toObject();
    delete (userData as { password?: string }).password;

    res.json({
      success: true,
      token,
      user: userData
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      password,
    });

    const token = user.generateAuthToken();
    const userData = user.toObject();
    delete (userData as { password?: string }).password;

    res.status(201).json({
      success: true,
      token,
      user: userData
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    let user;
    if ((req as any).user.role) {
      // This is an admin/manager user
      user = await User.findById((req as any).user.id).select('-password');
    } else {
      // This is an attendee
      user = await User.findById((req as any).user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};