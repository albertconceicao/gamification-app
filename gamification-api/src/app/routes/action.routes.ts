import { Router } from 'express';
import { actionController } from '../controllers/ActionController';

const router = Router();

// GET /api/actions/:actionId - Busca uma ação específica
router.get('/:actionId', actionController.getActionById.bind(actionController));

// PUT /api/actions/:actionId - Atualiza uma ação
router.put('/:actionId', actionController.updateAction.bind(actionController));

// DELETE /api/actions/:actionId - Remove uma ação
router.delete('/:actionId', actionController.deleteAction.bind(actionController));

export default router;
