import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import actionRoutes from './routes/actionRoutes';

// Carrega variáveis de ambiente
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api', userRoutes);
app.use('/api', eventRoutes);
app.use('/api', actionRoutes);

// Rota 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
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
