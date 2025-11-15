import { Request, Response } from 'express';
import { actionRepository } from '../repositories/ActionRepository';
import logger from '../utils/logger';
import { StatusCode } from '../utils/statusCode';

export class ActionController {
  // @desc    Get single action by ID with stats
  // @route   GET /api/actions/:id
  // @access  Public
  async getActionById(req: Request, res: Response) {
    logger.info('getActionById >> Start >>');

    const actionId = req.params.actionId || req.params.id;
    logger.debug('actionId: ', actionId);

    try {
      const action = await actionRepository.findByIdWithStats(actionId);
      
      if (!action) {
        logger.info('getActionById << End << - Action not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Ação não encontrada'
        });
      }
      
      logger.info('getActionById << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        data: action
      });
    } catch (error: any) {
      logger.error('getActionById :: Error :: ', error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao buscar ação'
      });
    }
  }

  // @desc    Update action
  // @route   PUT /api/actions/:id
  // @access  Private/Admin
  async updateAction(req: Request, res: Response) {
    logger.info('updateAction >> Start >>');

    const actionId = req.params.actionId || req.params.id;
    logger.debug('actionId: ', actionId);
    logger.debug('updateData: ', req.body);

    try {
      const updatedAction = await actionRepository.updateAction(actionId, req.body);

      if (!updatedAction) {
        logger.info('updateAction << End << - Action not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Ação não encontrada'
        });
      }

      logger.info('updateAction << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        message: 'Ação atualizada com sucesso',
        data: updatedAction
      });
    } catch (error: any) {
      logger.error('updateAction :: Error :: ', error);
      if (error.message.includes('Pontuação')) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: error.message
        });
      }
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao atualizar ação'
      });
    }
  }

  // @desc    Delete action
  // @route   DELETE /api/actions/:id
  // @access  Private/Admin
  async deleteAction(req: Request, res: Response) {
    logger.info('deleteAction >> Start >>');

    const actionId = req.params.actionId || req.params.id;
    logger.debug('actionId: ', actionId);

    try {
      const deleted = await actionRepository.deleteAction(actionId);
      
      if (!deleted) {
        logger.info('deleteAction << End << - Action not found');
        return res.status(StatusCode.NOT_FOUND).json({
          success: false,
          message: 'Ação não encontrada'
        });
      }

      logger.info('deleteAction << End <<');
      res.status(StatusCode.SUCCESS).json({
        success: true,
        message: 'Ação removida com sucesso'
      });
    } catch (error: any) {
      logger.error('deleteAction :: Error :: ', error);
      if (error.message.includes('Cannot delete')) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: error.message,
          suggestion: 'Desative a ação ao invés de removê-la'
        });
      }
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Erro ao remover ação'
      });
    }
  }
}

export const actionController = new ActionController();
