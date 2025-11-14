// src/controllers/authController.ts
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { Attendee } from '../models/Attendee';

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
      user = await Attendee.findOne({ email }).select('+password');
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
    delete userData.password;

    res.json({
      success: true,
      token,
      user: userData
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new attendee
// @route   POST /api/auth/register
// @access  Public
export const registerAttendee = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { first_name, email, password, eventId } = req.body;

    // Check if attendee already exists
    const attendeeExists = await Attendee.findOne({ email });
    if (attendeeExists) {
      return res.status(400).json({ message: 'Attendee already exists' });
    }

    // Create attendee
    const attendee = await Attendee.create({
      first_name,
      email,
      password,
      eventId
    });

    const token = attendee.generateAuthToken();
    const attendeeData = attendee.toObject();
    delete attendeeData.password;

    res.status(201).json({
      success: true,
      token,
      user: attendeeData
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
      user = await Attendee.findById((req as any).user.id).select('-password');
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