import { Router } from 'express';
import { attendeeController } from '../controllers/AttendeeController';
import { validateEventExists } from '../../middlewares/validateEvent';

const router = Router();

// GET /api/attendees - Lista todos os usuários registrados
router.get('/', attendeeController.getAllAttendees.bind(attendeeController));

// POST /api/attendees/create - Registra um novo usuário em um evento (legacy endpoint)
router.post('/create', validateEventExists, attendeeController.createAttendee.bind(attendeeController));

// POST /api/attendees/actions/:swoogoUserId/:handle - Usuário realiza uma ação (external API)
router.post('/actions/:swoogoUserId/:handle', attendeeController.performActionByHandle.bind(attendeeController));

// GET /api/attendees/:userId - Busca um usuário específico
router.get('/:userId', attendeeController.getAttendeeById.bind(attendeeController));

// GET /api/attendees/:userId/history - Histórico completo de ações do usuário
router.get('/:userId/history', attendeeController.getAttendeeHistory.bind(attendeeController));

export default router;

