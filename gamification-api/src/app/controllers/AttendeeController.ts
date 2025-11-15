import { Request, Response } from 'express';
import { attendeeRepository } from '../repositories/AttendeeRepository';
import { Attendee } from '../models/Attendee';
import { AttendeeAction } from '../models/AttendeeAction';
import Event from '../models/Event';
import { Action } from '../models/Action';
import logger from '../utils/logger';
import { StatusCode } from '../utils/statusCode';

export class AttendeeController {
  // @desc    Get all attendees
  // @route   GET /api/attendees
  // @access  Public
  async getAllAttendees(req: Request, res: Response) {
    logger.info('getAllAttendees >> Start >>');

    try {
      const users = await attendeeRepository.findAll();
      
      logger.info('getAllAttendees << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      logger.error('getAllAttendees :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao buscar usuários'
      });
    }
  }

  // @desc    Create attendee (legacy endpoint)
  // @route   POST /api/attendees/create
  // @access  Public
  async createAttendee(req: Request, res: Response) {
    logger.info('createAttendee >> Start >>');

    const { first_name, email, swoogoEventId, id } = req.body;
    const event = (req as any).event; // From middleware
    logger.debug('first_name: ', first_name);
    logger.debug('email: ', email);
    logger.debug('id: ', id);
    logger.debug('eventId: ', event?._id);

    try {
      if (!first_name || !email || !id) {
        logger.info('createAttendee << End << - Missing required fields');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Name, email and id are required'
        });
      }

      // Check if user already exists in this event
      const existingUser = await attendeeRepository.findBySwoogoUserId(id);
      if (existingUser && existingUser.eventId.toString() === event._id.toString()) {
        await attendeeRepository.updateBySwoogoUserId(event._id, id, { first_name, email });
        logger.info('createAttendee << End << - User updated');
        return res.status(StatusCode.SUCCESS).json({
          success: true,
          message: 'User updated successfully',
          data: existingUser
        });
      }

      const user = await attendeeRepository.create({
        eventId: event._id,
        swoogoEventId,
        first_name,
        email,
        swoogoUserId: id,
        points: 0
      });

      logger.info('createAttendee << End <<');
      res.status(StatusCode.CREATED).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      logger.error('createAttendee :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error registering user'
      });
    }
  }

  // @desc    Perform action by handle (external API)
  // @route   POST /api/attendees/actions/:swoogoUserId/:handle
  // @access  Public
  async performActionByHandle(req: Request, res: Response) {
    logger.info('performActionByHandle >> Start >>');

    const { swoogoUserId, handle } = req.params;
    logger.debug('swoogoUserId: ', swoogoUserId);
    logger.debug('handle: ', handle);

    try {
      if (!swoogoUserId || !handle) {
        logger.info('performActionByHandle << End << - Missing required params');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'swoogoUserId and handle are required'
        });
      }

      // Find attendee
      const attendee = await attendeeRepository.findBySwoogoUserId(swoogoUserId);
      if (!attendee) {
        logger.info('performActionByHandle << End << - User not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'User not found'
        });
      }

      // Validate event is active
      const event = await Event.findById(attendee.eventId, { _id: 1, name: 1, isActive: 1 });
      if (!event) {
        logger.info('performActionByHandle << End << - Event not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Event not found in database',
          tip: 'The event may have been removed'
        });
      }

      if (!event.isActive) {
        logger.info('performActionByHandle << End << - Event not active');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Event is not active',
          eventName: event.name,
          tip: 'Actions cannot be performed in inactive events'
        });
      }

      // Find action by handle
      const action = await Action.findOne({ handle });
      if (!action) {
        logger.info('performActionByHandle << End << - Action not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Action not found with the provided handle'
        });
      }

      // Check if action is active
      if (!action.isActive) {
        logger.info('performActionByHandle << End << - Action not active');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Action is not active'
        });
      }

      // Check if action belongs to event
      if (action.eventId.toString() !== attendee.eventId.toString()) {
        logger.info('performActionByHandle << End << - Action does not belong to event');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Action does not belong to the user event'
        });
      }

      // Check if user already performed this action (if not allowed multiple)
      if (!action.allowMultiple) {
        const existingUserAction = await AttendeeAction.findOne({ 
          attendeeId: attendee._id, 
          actionId: action._id 
        });
        if (existingUserAction) {
          logger.info('performActionByHandle << End << - Action already performed');
          return res.status(StatusCode.BAD_REQUEST).json({
            success: false,
            message: 'You have already performed this action and it does not allow multiple executions'
          });
        }
      }

      // Register the action
      const userAction = await AttendeeAction.create({
        attendeeId: attendee._id,
        eventId: attendee.eventId,
        actionId: action._id,
        pointsEarned: action.points
      });

      // Add points to attendee
      const updatedAttendee = await attendeeRepository.addPoints(attendee._id.toString(), action.points);

      logger.info('performActionByHandle << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        message: `${action.points} ponto(s) adicionado(s) com sucesso`,
        data: {
          attendeeId: updatedAttendee!._id,
          first_name: updatedAttendee!.first_name,
          attendeeSwoogoId: updatedAttendee!.swoogoAttendeeId,
          action: {
            id: action._id,
            name: action.name,
            points: action.points
          },
          totalPoints: updatedAttendee!.points,
          pointsAdded: action.points
        }
      });
    } catch (error) {
      logger.error('performActionByHandle :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao processar ação'
      });
    }
  }

  // @desc    Get attendee by ID
  // @route   GET /api/attendees/:userId
  // @access  Public
  async getAttendeeById(req: Request, res: Response) {
    logger.info('getAttendeeById >> Start >>');

    const { userId } = req.params;
    logger.debug('userId: ', userId);

    try {
      const user = await attendeeRepository.findById(userId);
      
      if (!user) {
        logger.info('getAttendeeById << End << - User not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      // Get recent actions
      const recentActions = await attendeeRepository.getRecentActions(userId, 10);

      logger.info('getAttendeeById << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        data: {
          ...user.toObject(),
          recentActions
        }
      });
    } catch (error) {
      logger.error('getAttendeeById :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao buscar usuário'
      });
    }
  }

  // @desc    Get attendee history
  // @route   GET /api/attendees/:userId/history
  // @access  Public
  async getAttendeeHistory(req: Request, res: Response) {
    logger.info('getAttendeeHistory >> Start >>');

    const { userId } = req.params;
    logger.debug('userId: ', userId);

    try {
      const attendee = await attendeeRepository.findById(userId);
      if (!attendee) {
        logger.info('getAttendeeHistory << End << - User not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      const history = await attendeeRepository.getHistory(userId);

      logger.info('getAttendeeHistory << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        user: {
          id: attendee._id,
          first_name: attendee.first_name,
          attendeeSwoogoId: attendee.swoogoAttendeeId,
          totalPoints: attendee.points
        },
        count: history.length,
        data: history
      });
    } catch (error) {
      logger.error('getAttendeeHistory :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao buscar histórico'
      });
    }
  }
}

export const attendeeController = new AttendeeController();

