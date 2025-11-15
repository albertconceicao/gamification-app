import { Request, Response } from 'express';
import { eventRepository } from '../repositories/EventRepository';
import logger from '../utils/logger';
import { StatusCode } from '../utils/statusCode';

export class ValidationController {
  // @desc    Validate event exists and is active
  // @route   Middleware validation
  // @access  Internal
  async validateEvent(req: Request, res: Response, next: Function) {
    logger.info('validateEvent >> Start >>');

    const { eventId, swoogoEventId } = req.body;
    const eventIdParam = req.params.eventId;

    // Try to get eventId from params, body, or query
    const id = eventIdParam || eventId || req.query.eventId;
    logger.debug('eventId: ', id);
    logger.debug('swoogoEventId: ', swoogoEventId);

    try {
      if (!id && !swoogoEventId) {
        logger.info('validateEvent << End << - Event ID is required');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Event ID is required'
        });
      }

      // Find event by ID or swoogoEventId using repository
      const event = id 
        ? await eventRepository.findById(id)
        : await eventRepository.findBySwoogoEventId(swoogoEventId);

      if (!event) {
        logger.info('validateEvent << End << - Event not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Evento não encontrado no banco de dados',
          tip: 'Verifique se o ID do evento está correto'
        });
      }

      if (!event.isActive) {
        logger.info('validateEvent << End << - Event not active');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Este evento não está ativo',
          eventName: event.name,
          tip: 'Entre em contato com o administrador para ativar o evento'
        });
      }

      // Attach event to request for use in controller
      (req as any).event = event;
      logger.info('validateEvent << End <<');
      next();
    } catch (error) {
      logger.error('validateEvent :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error validating event'
      });
    }
  }
}

export const validationController = new ValidationController();

