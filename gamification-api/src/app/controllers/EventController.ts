import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { eventRepository } from '../repositories/EventRepository';
import { actionRepository } from '../repositories/ActionRepository';
import { attendeeRepository } from '../repositories/AttendeeRepository';
import logger from '../utils/logger';
import { StatusCode } from '../utils/statusCode';

export class EventController {
  // @desc    Get all events
  // @route   GET /api/events
  // @access  Public
  async getAllEvents(req: Request, res: Response) {
    logger.info('getAllEvents >> Start >>');

    const ownerId = (req as any).user?.id;
    logger.debug('ownerId: ', ownerId);

    try {
      const events = await eventRepository.findAll(ownerId);
      
      logger.info('getAllEvents << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        count: events.length,
        data: events
      });
    } catch (error) {
      logger.error('getAllEvents :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao buscar eventos'
      });
    }
  }

  // @desc    Get event by ID
  // @route   GET /api/events/:eventId
  // @access  Public
  async getEventById(req: Request, res: Response) {
    logger.info('getEventById >> Start >>');

    const { eventId } = req.params;
    logger.debug('eventId: ', eventId);

    try {
      const event = await eventRepository.findById(eventId);
      
      if (!event) {
        logger.info('getEventById << End << - Event not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      // Get statistics
      const stats = await eventRepository.getStats(eventId);

      logger.info('getEventById << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        data: {
          ...event.toObject(),
          stats
        }
      });
    } catch (error) {
      logger.error('getEventById :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao buscar evento'
      });
    }
  }

  // @desc    Create event
  // @route   POST /api/events
  // @access  Private
  async createEvent(req: Request, res: Response) {
    logger.info('createEvent >> Start >>');

    const { name, description, startDate, endDate, isActive, swoogoEventId } = req.body;
    logger.debug('name: ', name);
    logger.debug('swoogoEventId: ', swoogoEventId);

    try {
      if (!name) {
        logger.info('createEvent << End << - Missing name');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Nome do evento é obrigatório'
        });
      }

      const event = await eventRepository.create({
        name,
        ownerId: (req as any).user?.id,
        description,
        startDate: startDate || new Date(),
        endDate,
        isActive: isActive !== undefined ? isActive : true,
        swoogoEventId
      });

      logger.info('createEvent << End <<');
      res.status(StatusCode.CREATED).json({
        success: true,
        message: 'Evento criado com sucesso',
        data: event
      });
    } catch (error) {
      logger.error('createEvent :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao criar evento'
      });
    }
  }

  // @desc    Update event
  // @route   PUT /api/events/:eventId
  // @access  Private
  async updateEvent(req: Request, res: Response) {
    logger.info('updateEvent >> Start >>');

    const { eventId } = req.params;
    logger.debug('eventId: ', eventId);
    logger.debug('updateData: ', req.body);

    try {
      const updatedEvent = await eventRepository.update(eventId, req.body);

      if (!updatedEvent) {
        logger.info('updateEvent << End << - Event not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      logger.info('updateEvent << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        message: 'Evento atualizado com sucesso',
        data: updatedEvent
      });
    } catch (error) {
      logger.error('updateEvent :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao atualizar evento'
      });
    }
  }

  // @desc    Delete event
  // @route   DELETE /api/events/:eventId
  // @access  Private
  async deleteEvent(req: Request, res: Response) {
    logger.info('deleteEvent >> Start >>');

    const { eventId } = req.params;
    logger.debug('eventId: ', eventId);

    try {
      const canDelete = await eventRepository.canDelete(eventId);

      if (!canDelete.canDelete) {
        logger.info('deleteEvent << End << - Cannot delete, has dependencies');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: `Não é possível remover o evento. Existem ${canDelete.usersCount} usuário(s) e ${canDelete.actionsCount} ação(ões) vinculadas.`,
          suggestion: 'Desative o evento ao invés de removê-lo'
        });
      }

      const deleted = await eventRepository.delete(eventId);

      if (!deleted) {
        logger.info('deleteEvent << End << - Event not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      logger.info('deleteEvent << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        message: 'Evento removido com sucesso'
      });
    } catch (error) {
      logger.error('deleteEvent :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao remover evento'
      });
    }
  }

  // @desc    Get event ranking
  // @route   GET /api/events/:eventId/ranking
  // @access  Public
  async getEventRanking(req: Request, res: Response) {
    logger.info('getEventRanking >> Start >>');

    const { eventId } = req.params;
    logger.debug('eventId: ', eventId);

    try {
      const event = await eventRepository.findById(eventId);
      
      if (!event) {
        logger.info('getEventRanking << End << - Event not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      const users = await eventRepository.getRanking(eventId);

      logger.info('getEventRanking << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        event: {
          id: event._id,
          name: event.name
        },
        count: users.length,
        data: users
      });
    } catch (error) {
      logger.error('getEventRanking :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao buscar ranking'
      });
    }
  }

  // @desc    Get event actions
  // @route   GET /api/events/:eventId/actions
  // @access  Public
  async getEventActions(req: Request, res: Response) {
    logger.info('getEventActions >> Start >>');

    const { eventId } = req.params;
    logger.debug('eventId: ', eventId);

    try {
      const actions = await eventRepository.getActions(eventId);
      
      logger.info('getEventActions << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        event: {
          id: eventId
        },
        count: actions.length,
        data: actions
      });
    } catch (error) {
      logger.error('getEventActions :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao buscar ações'
      });
    }
  }

  // @desc    Create action for event
  // @route   POST /api/events/:eventId/actions
  // @access  Private
  async createEventAction(req: Request, res: Response) {
    logger.info('createEventAction >> Start >>');

    const { eventId } = req.params;
    const { name, description, points, allowMultiple, isActive, handle } = req.body;
    logger.debug('eventId: ', eventId);
    logger.debug('name: ', name);
    logger.debug('points: ', points);
    logger.debug('handle: ', handle);

    try {
      // Validations
      if (!name) {
        logger.info('createEventAction << End << - Missing name');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Nome da ação é obrigatório'
        });
      }

      if (points === undefined || points < 0) {
        logger.info('createEventAction << End << - Invalid points');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Pontuação é obrigatória e deve ser maior ou igual a zero'
        });
      }

      const action = await actionRepository.createAction({
        eventId: new mongoose.Types.ObjectId(eventId),
        name,
        handle,
        description,
        points,
        allowMultiple: allowMultiple !== undefined ? allowMultiple : false,
        isActive: isActive !== undefined ? isActive : true
      });

      logger.info('createEventAction << End <<');
      res.status(StatusCode.CREATED).json({
        success: true,
        message: 'Ação criada com sucesso',
        data: action
      });
    } catch (error) {
      logger.error('createEventAction :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao criar ação'
      });
    }
  }

  // @desc    Register user in event
  // @route   POST /api/events/:eventId/users
  // @access  Public
  async registerUserInEvent(req: Request, res: Response) {
    logger.info('registerUserInEvent >> Start >>');

    const { eventId } = req.params;
    const { name, email, swoogoUserId } = req.body;
    logger.debug('eventId: ', eventId);
    logger.debug('name: ', name);
    logger.debug('email: ', email);

    try {
      const event = await eventRepository.findById(eventId);
      if (!event) {
        logger.info('registerUserInEvent << End << - Event not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Evento não encontrado'
        });
      }

      if (!name || !email) {
        logger.info('registerUserInEvent << End << - Missing required fields');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Name and email are required'
        });
      }

      // Check if user already exists in this event
      const existingUser = await attendeeRepository.findByEmailAndEvent(eventId, email);
      if (existingUser) {
        logger.info('registerUserInEvent << End << - User already registered');
        return res.status(StatusCode.SUCCESS).json({
          success: true,
          message: 'User already registered',
          data: existingUser
        });
      }

      const user = await attendeeRepository.create({
        eventId: event._id,
        first_name: name,
        email,
        password: 'temp-password-' + Date.now(),
        swoogoUserId: swoogoUserId || email,
        swoogoAttendeeId: swoogoUserId || email,
        points: 0
      });

      logger.info('registerUserInEvent << End <<');
      res.status(StatusCode.CREATED).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error: any) {
      logger.error('registerUserInEvent :: Error :: ', error);
      if (error.code === 11000) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'User already exists in this event'
        });
      }
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error registering user'
      });
    }
  }
}

export const eventController = new EventController();
