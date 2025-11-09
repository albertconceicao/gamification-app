import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  eventId: mongoose.Types.ObjectId;
  first_name: string;
  swoogoUserId: string;
  email: string;
  points: number;
  registeredAt: Date;
  lastAction?: Date;
}

const UserSchema: Schema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  swoogoUserId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  lastAction: {
    type: Date
  }
});

// Índice composto para garantir email único por evento
UserSchema.index({ eventId: 1, email: 1 }, { unique: true });

export default mongoose.model<IUser>('User', UserSchema);
