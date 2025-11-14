import { Router, Request, Response } from 'express';
import Action from '../models/Action';
import Event from '../models/Event';
import { AttendeeAction } from '../models/AttendeeAction';
import { validateEventExists } from '../middlewares/validateEvent';

const router = Router();

// GET /api/events/:eventId/actions - Lista todas as ações de um evento
router.get('/events/:eventId/actions', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const actions = await Action.find({ eventId }).sort({ points: -1 });
    
    res.json({
      success: true,
      event: {
        id: eventId
      },
      count: actions.length,
      data: actions
    });
  } catch (error) {
    console.error('Erro ao buscar ações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar ações'
    });
  }
});

// GET /api/actions/:actionId - Busca uma ação específica
router.get('/actions/:actionId', async (req: Request, res: Response) => {
  try {
    const { actionId } = req.params;

    const action = await Action.findById(actionId).populate('eventId', 'name');
    
    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Ação não encontrada'
      });
    }

    // Contar quantas vezes a ação foi realizada
    const timesPerformed = await AttendeeAction.countDocuments({ actionId });

    res.json({
      success: true,
      data: {
        ...action.toObject(),
        stats: {
          timesPerformed
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar ação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar ação'
    });
  }
});

// POST /api/events/:eventId/actions - Cria uma nova ação para um evento
router.post('/events/:eventId/actions', async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { name, description, points, allowMultiple, isActive, handle } = req.body;
    // Validações
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nome da ação é obrigatório'
      });
    }

    if (points === undefined || points < 0) {
      return res.status(400).json({
        success: false,
        message: 'Pontuação é obrigatória e deve ser maior ou igual a zero'
      });
    }

    const action = await Action.create({
      eventId,
      name,
      handle,
      description,
      points,
      allowMultiple: allowMultiple !== undefined ? allowMultiple : false,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Ação criada com sucesso',
      data: action
    });
  } catch (error) {
    console.error('Erro ao criar ação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar ação'
    });
  }
});

// PUT /api/actions/:actionId - Atualiza uma ação
router.put('/actions/:actionId', async (req: Request, res: Response) => {
  try {
    const { actionId } = req.params;
    const { name, description, points, allowMultiple, isActive, handle } = req.body;

    const action = await Action.findById(actionId);
    
    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Ação não encontrada'
      });
    }

    // Atualizar campos
    if (name !== undefined) action.name = name;
    if (handle !== undefined) action.handle = handle;
    if (description !== undefined) action.description = description;
    if (points !== undefined) {
      if (points < 0) {
        return res.status(400).json({
          success: false,
          message: 'Pontuação deve ser maior ou igual a zero'
        });
      }
      action.points = points;
    }
    if (allowMultiple !== undefined) action.allowMultiple = allowMultiple;
    if (isActive !== undefined) action.isActive = isActive;

    await action.save();

    res.json({
      success: true,
      message: 'Ação atualizada com sucesso',
      data: action
    });
  } catch (error) {
    console.error('Erro ao atualizar ação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar ação'
    });
  }
});

// DELETE /api/actions/:actionId - Remove uma ação
router.delete('/actions/:actionId', async (req: Request, res: Response) => {
  try {
    const { actionId } = req.params;

    const action = await Action.findById(actionId);
    
    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Ação não encontrada'
      });
    }

    // Verificar se há registros de usuários que realizaram esta ação
    const userActionsCount = await AttendeeAction.countDocuments({ actionId });

    if (userActionsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Não é possível remover a ação. Existem ${userActionsCount} registro(s) de usuários que realizaram esta ação.`,
        suggestion: 'Desative a ação ao invés de removê-la'
      });
    }

    await Action.findByIdAndDelete(actionId);

    res.json({
      success: true,
      message: 'Ação removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover ação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover ação'
    });
  }
});

export default router;
