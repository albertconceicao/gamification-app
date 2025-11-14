import { Router, Request, Response } from 'express';
import { Attendee } from '../models/Attendee';
import Event from '../models/Event';
import Action from '../models/Action';
import {AttendeeAction} from '../models/AttendeeAction';
import { validateEventExists } from '../middlewares/validateEvent';

const router = Router();

// GET /api/attendees - Lista todos os usuários registrados
router.get('/attendees', async (req: Request, res: Response) => {
  try {
    const users = await Attendee.find().sort({ points: -1 });
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários'
    });
  }
});

// POST /api/events/attendees/create - Registra um novo usuário em um evento
router.post('/events/attendees/create', validateEventExists, async (req: Request, res: Response) => {
  try {
    const { first_name, email, swoogoEventId, id } = req.body;
    const event = (req as any).event; // Vem do middleware

    if (!first_name || !email || !id) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and id are required'
      });
    }

    // Verifica se o usuário já existe neste evento
    const existingUser = await Attendee.findOne({ eventId: event._id, swoogoUserId: id });
    if (existingUser) {
      await Attendee.updateOne({ eventId: event._id, swoogoUserId: id }, { $set: { first_name, email } });
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: existingUser
      });
    }

    const user = await Attendee.create({
      eventId: event._id,
      swoogoEventId,
      first_name,
      email,
      swoogoUserId: id,
      points: 0
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user'
    });
  }
});

// POST /api/attendees/actions - Usuário realiza uma ação
router.post('/attendees/actions/:swoogoUserId/:handle', async (req: Request, res: Response) => {
  try {
    const { swoogoUserId, handle } = req.params;

    if (!swoogoUserId || !handle) {
      return res.status(400).json({
        success: false,
        message: 'swoogoUserId and handle are required in the request body'
      });
    }

    // Buscar usuário pelo swoogoUserId
    const attendee = await Attendee.findOne({ swoogoUserId });
    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validar se o evento do usuário existe e está ativo
    const event = await Event.findById(attendee.eventId, { _id: 1, name: 1, isActive: 1 });
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found in database',
        tip: 'The event may have been removed'
      });
    }

    if (!event.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Event is not active',
        eventName: event.name,
        tip: 'Actions cannot be performed in inactive events'
      });
    }

    // Buscar ação pelo handle
    const action = await Action.findOne({ handle });
    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found with the provided handle'
      });
    }

    // Verificar se a ação está ativa
    if (!action.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Action is not active'
      });
    }

    // Verificar se a ação pertence ao evento do usuário
    if (action.eventId.toString() !== attendee.eventId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Action does not belong to the user event'
      });
    }

    // Verificar se o usuário já realizou esta ação
    if (!action.allowMultiple) {
      const existingUserAction = await AttendeeAction.findOne({ 
        attendeeId: attendee._id, 
        actionId: action._id 
      });
      if (existingUserAction) {
        return res.status(400).json({
          success: false,
          message: 'You have already performed this action and it does not allow multiple executions'
        });
      }
    }

    // Registrar a ação do usuário
    const userAction = await AttendeeAction.create({
      attendeeId: attendee._id,
      eventId: attendee.eventId,
      actionId: action._id,
      pointsEarned: action.points
    });

    // Adicionar pontos ao usuário
    attendee.points += action.points;
    attendee.lastAction = new Date();
    await attendee.save();

    res.json({
      success: true,
      message: `${action.points} ponto(s) adicionado(s) com sucesso`,
      data: {
        attendeeId: attendee._id,
        first_name: attendee.first_name,
        attendeeSwoogoId: attendee.swoogoAttendeeId,
        action: {
          id: action._id,
          name: action.name,
          points: action.points
        },
        totalPoints: attendee.points,
        pointsAdded: action.points
      }
    });
  } catch (error) {
    console.error('Erro ao processar ação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar ação'
    });
  }
});

// GET /api/users/:userId - Busca um usuário específico
router.get('/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await Attendee.findById(userId).populate('eventId', 'first_name');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Buscar histórico de ações do usuário
    const attendeeActions = await AttendeeAction.find({ userId })
      .populate('actionId', 'name points')
      .sort({ performedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        recentActions: attendeeActions
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuário'
    });
  }
});

// GET /api/users/:userId/history - Histórico completo de ações do usuário
router.get('/users/:userId/history', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const attendee = await Attendee.findById(userId);
    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const history = await AttendeeAction.find({ attendeeId: userId })
      .populate('actionId', 'name points description')
      .sort({ performedAt: -1 });

    const totalPoints = history.reduce((sum, ua) => sum + ua.points, 0);

    res.json({
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
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico'
    });
  }
});

export default router;
