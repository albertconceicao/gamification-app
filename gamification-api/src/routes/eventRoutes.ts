import { Router, Request, Response } from 'express';
import Event from '../models/Event';
import Action from '../models/Action';
import User from '../models/User';

const router = Router();

// GET /api/events - Lista todos os eventos
router.get('/events', async (req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar eventos'
    });
  }
});

// GET /api/events/:eventId - Busca um evento específico
router.get('/events/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    // Buscar estatísticas do evento
    const [actionsCount, usersCount] = await Promise.all([
      Action.countDocuments({ eventId }),
      User.countDocuments({ eventId })
    ]);

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        stats: {
          totalActions: actionsCount,
          totalUsers: usersCount
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar evento'
    });
  }
});

// POST /api/events - Cria um novo evento
router.post('/events', async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nome do evento é obrigatório'
      });
    }

    const event = await Event.create({
      name,
      description,
      startDate: startDate || new Date(),
      endDate,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Evento criado com sucesso',
      data: event
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar evento'
    });
  }
});

// PUT /api/events/:eventId - Atualiza um evento
router.put('/events/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { name, description, startDate, endDate, isActive } = req.body;

    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    // Atualizar campos
    if (name !== undefined) event.name = name;
    if (description !== undefined) event.description = description;
    if (startDate !== undefined) event.startDate = startDate;
    if (endDate !== undefined) event.endDate = endDate;
    if (isActive !== undefined) event.isActive = isActive;

    await event.save();

    res.json({
      success: true,
      message: 'Evento atualizado com sucesso',
      data: event
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar evento'
    });
  }
});

// DELETE /api/events/:eventId - Remove um evento
router.delete('/events/:eventId', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    // Verificar se há usuários ou ações vinculadas
    const [usersCount, actionsCount] = await Promise.all([
      User.countDocuments({ eventId }),
      Action.countDocuments({ eventId })
    ]);

    if (usersCount > 0 || actionsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Não é possível remover o evento. Existem ${usersCount} usuário(s) e ${actionsCount} ação(ões) vinculadas.`,
        suggestion: 'Desative o evento ao invés de removê-lo'
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({
      success: true,
      message: 'Evento removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover evento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover evento'
    });
  }
});

// GET /api/events/:eventId/ranking - Ranking de usuários do evento
router.get('/events/:eventId/ranking', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento não encontrado'
      });
    }

    const users = await User.find({ eventId })
      .sort({ points: -1 })
      .select('name email points lastAction');

    res.json({
      success: true,
      event: {
        id: event._id,
        name: event.name
      },
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar ranking'
    });
  }
});

export default router;
