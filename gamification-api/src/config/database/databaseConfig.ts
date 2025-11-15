import mongoose from 'mongoose';
import { dropUsernameIndex } from './migrateUserIndex';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/gamification?authSource=admin';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB conectado com sucesso');
    
    // Run migration to drop old username index
    await dropUsernameIndex();
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Erro no MongoDB:', error);
});
