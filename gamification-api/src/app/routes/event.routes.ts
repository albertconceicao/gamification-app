import { Router } from 'express';
import { eventController } from '../controllers/EventController';

const router = Router();

// GET /api/events - Lista todos os eventos
router.get('/', eventController.getAllEvents.bind(eventController));

// GET /api/events/:eventId/ranking - Ranking de usuários do evento (must come before :eventId route)
router.get('/:eventId/ranking', eventController.getEventRanking.bind(eventController));

// GET /api/events/:eventId/actions - Lista todas as ações de um evento (must come before :eventId route)
router.get('/:eventId/actions', eventController.getEventActions.bind(eventController));

// GET /api/events/:eventId - Busca um evento específico
router.get('/:eventId', eventController.getEventById.bind(eventController));

// POST /api/events - Cria um novo evento
router.post('/', eventController.createEvent.bind(eventController));

// PUT /api/events/:eventId - Atualiza um evento
router.put('/:eventId', eventController.updateEvent.bind(eventController));

// DELETE /api/events/:eventId - Remove um evento
router.delete('/:eventId', eventController.deleteEvent.bind(eventController));

// POST /api/events/:eventId/actions - Cria uma nova ação para um evento
router.post('/:eventId/actions', eventController.createEventAction.bind(eventController));

// POST /api/events/:eventId/users - Registra um novo usuário em um evento
router.post('/:eventId/users', eventController.registerUserInEvent.bind(eventController));

export default router;

