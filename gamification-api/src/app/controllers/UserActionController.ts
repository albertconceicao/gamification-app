import { Request, Response } from 'express';
import { attendeeRepository } from '../repositories/AttendeeRepository';
import { actionRepository } from '../repositories/ActionRepository';
import { eventRepository } from '../repositories/EventRepository';
import { AttendeeAction } from '../models/AttendeeAction';
import logger from '../utils/logger';
import { StatusCode } from '../utils/statusCode';

export class UserActionController {
  // @desc    Perform an action (frontend endpoint)
  // @route   POST /api/users/actions
  // @access  Public
  async performAction(req: Request, res: Response) {
    logger.info('performAction >> Start >>');

    const { attendeeId, actionId } = req.body;
    logger.debug('attendeeId: ', attendeeId);
    logger.debug('actionId: ', actionId);

    try {
      if (!attendeeId || !actionId) {
        logger.info('performAction << End << - Missing required fields');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'attendeeId and actionId are required'
        });
      }

      // Find attendee
      const attendee = await attendeeRepository.findById(attendeeId);
      if (!attendee) {
        logger.info('performAction << End << - User not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'User not found'
        });
      }

      // Find action
      const action = await actionRepository.findById(actionId);
      if (!action) {
        logger.info('performAction << End << - Action not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Action not found'
        });
      }

      // Validate event is active
      const event = await eventRepository.findById(attendee.eventId.toString());
      if (!event) {
        logger.info('performAction << End << - Event not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Event not found'
        });
      }

      if (!event.isActive) {
        logger.info('performAction << End << - Event not active');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Event is not active'
        });
      }

      // Check if action is active
      if (!action.isActive) {
        logger.info('performAction << End << - Action not active');
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Action is not active'
        });
      }

      // Check if action belongs to event
      if (action.eventId.toString() !== attendee.eventId.toString()) {
        logger.info('performAction << End << - Action does not belong to event');
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
          logger.info('performAction << End << - Action already performed');
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
      const updatedAttendee = await attendeeRepository.addPoints(attendeeId, action.points);

      logger.info('performAction << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        message: `${action.points} point(s) added successfully`,
        data: {
          attendeeId: updatedAttendee!._id,
          first_name: updatedAttendee!.first_name,
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
      logger.error('performAction :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error performing action'
      });
    }
  }
}

export const userActionController = new UserActionController();
