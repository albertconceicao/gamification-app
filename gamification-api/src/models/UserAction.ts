import mongoose, { Document, Schema } from 'mongoose';

export interface IUserAction extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  actionId: mongoose.Types.ObjectId;
  pointsEarned: number;
  performedAt: Date;
}

const UserActionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  actionId: {
    type: Schema.Types.ObjectId,
    ref: 'Action',
    required: true,
    index: true
  },
  pointsEarned: {
    type: Number,
    required: true,
    min: 0
  },
  performedAt: {
    type: Date,
    default: Date.now
  }
});

// Índice composto para verificar se usuário já realizou a ação
UserActionSchema.index({ userId: 1, actionId: 1 });
UserActionSchema.index({ userId: 1, eventId: 1 });

export default mongoose.model<IUserAction>('UserAction', UserActionSchema);
