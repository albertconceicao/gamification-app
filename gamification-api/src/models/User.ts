import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  eventId: mongoose.Types.ObjectId;
  first_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  points: number;
  registeredAt: Date;
  lastAction?: Date;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
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
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice composto para garantir email único por evento
UserSchema.index({ eventId: 1, email: 1 }, { unique: true });

export default mongoose.model<IUser>('User', UserSchema);
