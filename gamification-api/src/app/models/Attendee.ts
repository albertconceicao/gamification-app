import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IAttendee extends Document {
  eventId: mongoose.Types.ObjectId;
  first_name: string;
  email: string;
  password: string;
  swoogoAttendeeId: string;
  swoogoUserId?: string;
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
    trim: true
  },
  swoogoUserId: {
    type: String,
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

// Compound index to ensure email unique per event
AttendeeSchema.index({ eventId: 1, email: 1 }, { unique: true });

// Hash password before saving
AttendeeSchema.pre<IAttendee>('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
AttendeeSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
AttendeeSchema.methods.getSignedJwtToken = function(): string {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

export const Attendee = mongoose.model<IAttendee>('Attendee', AttendeeSchema);

