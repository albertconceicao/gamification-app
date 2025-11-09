import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';

/**
 * Middleware para validar se o evento existe e está ativo
 * Usado em rotas que dependem de um eventId válido
 * 
 * Como os usuários já estão vinculados a eventos (eventId obrigatório),
 * validar apenas o evento é suficiente para garantir integridade dos dados.
 */
export const validateEventExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { swoogoEventId } = req.body;
    console.log({req});

    if (!swoogoEventId) {
      res.status(400).json({
        success: false,
        message: 'Event ID is required'
      });
      return;
    }

    // Try to find event by ID first
    let eventFound = await Event.findOne({ swoogoEventId });

    // If not found by ID, try to find by swoogoEventId
      if (!eventFound) {
        res.status(404).json({
          success: false,
          message: 'Event not found in database',
          tip: 'Verify if the event ID or Swoogo Event ID is correct'
        });
        return;
      }


    if (!eventFound.isActive) {
      res.status(400).json({
        success: false,
        message: 'Event is not active',
        eventName: eventFound.name,
        tip: 'Contact the administrator to activate the event'
      });
      return;
    }

    // Adiciona o evento ao request para uso posterior
    (req as any).event = eventFound;

    next();
  } catch (error) {
    console.error('Error validating event:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating event'
    });
  }
};
