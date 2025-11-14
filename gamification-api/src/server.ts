import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database';
import attendeeRoutes from './routes/attendeeRoutes';
import eventRoutes from './routes/eventRoutes';
import actionRoutes from './routes/actionRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// Carrega variáveis de ambiente
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rota de health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API de Pontuação está funcionando!',
    version: '2.0.0',
    features: [
      'Gerenciamento de Eventos',
      'Ações Configuráveis por Evento',
      'Sistema de Pontuação Flexível',
      'Controle de Ações Únicas/Múltiplas'
    ]
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/attendees', attendeeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/actions', actionRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Inicia o servidor
const startServer = async () => {
  try {
    // Conecta ao MongoDB
    await connectDatabase();
    
    // Inicia o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
