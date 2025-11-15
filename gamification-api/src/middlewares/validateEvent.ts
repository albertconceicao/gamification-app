import { Request, Response, NextFunction } from 'express';
import { validationController } from '../app/controllers/ValidationController';

export const validateEventExists = async (req: Request, res: Response, next: NextFunction) => {
  await validationController.validateEvent(req, res, next);
};

