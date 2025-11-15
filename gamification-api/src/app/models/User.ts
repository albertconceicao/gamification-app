import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  fullName: string;
  email: string;
  password: string;
  role: 'admin' | 'manager';
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>({
  fullName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 8, 
    select: false 
  },
  role: { 
    type: String, 
    enum: ['admin', 'manager'], 
    default: 'manager' 
  },
  lastLogin: { 
    type: Date 
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function(): string {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1d' }
  );
};

export const User = mongoose.model<IUser>('User', userSchema);
