import { Request, Response, NextFunction } from 'express';
import Event from '../models/Event';

/**
 * Middleware para validar se o evento existe e está ativo
 * Usado em rotas que dependem de um eventId válido
 * 
 * Como os usuários já estão vinculados a eventos (eventId obrigatório),
 * validar apenas o evento é suficiente para garantir integridade dos dados.
 */
export const validateEventExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventId = req.params.eventId;

    if (!eventId) {
      res.status(400).json({
        success: false,
        message: 'ID do evento é obrigatório'
      });
      return;
    }

    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({
        success: false,
        message: 'Evento não encontrado no banco de dados',
        tip: 'Verifique se o ID do evento está correto'
      });
      return;
    }

    if (!event.isActive) {
      res.status(400).json({
        success: false,
        message: 'Este evento não está ativo',
        eventName: event.name,
        tip: 'Entre em contato com o administrador para ativar o evento'
      });
      return;
    }

    // Adiciona o evento ao request para uso posterior
    (req as any).event = event;

    next();
  } catch (error) {
    console.error('Erro ao validar evento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao validar evento'
    });
  }
};
