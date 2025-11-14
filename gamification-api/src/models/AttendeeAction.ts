// src/models/AttendeeAction.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendeeAction extends Document {
  attendeeId: mongoose.Types.ObjectId;
  actionType: string;
  points: number;
  description?: string;
  metadata?: any;
  createdAt: Date;
}

const attendeeActionSchema = new Schema<IAttendeeAction>({
  attendeeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Attendee', 
    required: true 
  },
  actionType: { 
    type: String, 
    required: true 
  },
  points: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  metadata: { 
    type: Schema.Types.Mixed 
  }
}, { timestamps: true });

attendeeActionSchema.index({ attendeeId: 1, createdAt: -1 });

export const AttendeeAction = mongoose.model<IAttendeeAction>('AttendeeAction', attendeeActionSchema);