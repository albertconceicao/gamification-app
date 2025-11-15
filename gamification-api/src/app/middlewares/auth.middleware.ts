import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string; role: string };
    
    // Add user from payload
    req.user = { 
      _id: decoded.id as any, 
      role: decoded.role as 'admin' | 'manager' 
    } as IUser;
    
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};

// Middleware to check if user is admin
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  res.status(403).json({ 
    success: false,
    message: 'Access denied. Admin privileges required.' 
  });
};

// Middleware to check if user is admin or manager
export const managerOrAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    return next();
  }
  
  res.status(403).json({ 
    success: false,
    message: 'Access denied. Manager or admin privileges required.' 
  });
};
