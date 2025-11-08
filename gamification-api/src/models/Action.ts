import mongoose, { Document, Schema } from 'mongoose';

export interface IAction extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  points: number;
  allowMultiple: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ActionSchema: Schema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  allowMultiple: {
    type: Boolean,
    default: false,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice composto para buscar actions de um evento
ActionSchema.index({ eventId: 1, isActive: 1 });

export default mongoose.model<IAction>('Action', ActionSchema);
