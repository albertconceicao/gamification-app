import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IAttendee extends Document {
  eventId: mongoose.Types.ObjectId;
  first_name: string;
  email: string;
  password: string;
  swoogoAttendeeId: string;
  points: number;
  registeredAt: Date;
  lastAction?: Date;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

const AttendeeSchema: Schema = new Schema({
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
  swoogoAttendeeId: {
    type: String,
    required: [true, 'Please add a swoogoAttendeeId'],
    unique: true,
    trim: true
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
AttendeeSchema.index({ eventId: 1, email: 1 }, { unique: true });

export const Attendee = mongoose.model<IAttendee>('Attendee', AttendeeSchema);
