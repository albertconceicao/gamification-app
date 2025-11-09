import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  swoogoEventId?: string; // Swoogo event ID for integration
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  swoogoEventId: {
    type: String,
    trim: true,
    sparse: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IEvent>('Event', EventSchema);
