import { Router, Request, Response } from 'express';
import User from '../models/User';
import Event from '../models/Event';
import Action from '../models/Action';
import UserAction from '../models/UserAction';
import { validateEventExists } from '../middlewares/validateEvent';

const router = Router();

// GET /api/users - Lista todos os usuários registrados
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ points: -1 });
    
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

// POST /api/events/users/create - Registra um novo usuário em um evento
router.post('/events/users/create', validateEventExists, async (req: Request, res: Response) => {
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
    const existingUser = await User.findOne({ eventId: event._id, swoogoUserId: id });
    if (existingUser) {
      await User.updateOne({ eventId: event._id, swoogoUserId: id }, { $set: { first_name, email } });
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: existingUser
      });
    }

    const user = await User.create({
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

// POST /api/users/:userId/actions/:actionId - Usuário realiza uma ação
router.post('/users/:userId/actions/:actionId', async (req: Request, res: Response) => {
  try {
    const { userId, actionId } = req.params;

    // Buscar usuário
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Validar se o evento do usuário existe e está ativo
    const event = await Event.findById(user.eventId, { _id: 1, name: 1, isActive: 1 });
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

    // Buscar ação
    const action = await Action.findById(actionId);
    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found'
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
    if (action.eventId.toString() !== user.eventId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Action does not belong to the user event'
      });
    }

    // Verificar se o usuário já realizou esta ação
    if (!action.allowMultiple) {
      const existingUserAction = await UserAction.findOne({ userId, actionId });
      if (existingUserAction) {
        return res.status(400).json({
          success: false,
          message: 'You have already performed this action and it does not allow multiple executions'
        });
      }
    }

    // Registrar a ação do usuário
    const userAction = await UserAction.create({
      userId,
      eventId: user.eventId,
      actionId,
      pointsEarned: action.points
    });

    // Adicionar pontos ao usuário
    user.points += action.points;
    user.lastAction = new Date();
    await user.save();

    res.json({
      success: true,
      message: `${action.points} ponto(s) adicionado(s) com sucesso`,
      data: {
        userId: user._id,
        first_name: user.first_name,
        swoogoUserId: user.swoogoUserId,
        action: {
          id: action._id,
          name: action.name,
          points: action.points
        },
        totalPoints: user.points,
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

    const user = await User.findById(userId).populate('eventId', 'first_name');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Buscar histórico de ações do usuário
    const userActions = await UserAction.find({ userId })
      .populate('actionId', 'name points')
      .sort({ performedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        recentActions: userActions
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const history = await UserAction.find({ userId })
      .populate('actionId', 'name points description')
      .sort({ performedAt: -1 });

    const totalPoints = history.reduce((sum, ua) => sum + ua.pointsEarned, 0);

    res.json({
      success: true,
      user: {
        id: user._id,
        first_name: user.first_name,
        swoogoUserId: user.swoogoUserId,
        totalPoints: user.points
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
