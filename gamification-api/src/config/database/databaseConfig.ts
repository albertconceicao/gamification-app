import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/points-db';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB conectado com sucesso');
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
