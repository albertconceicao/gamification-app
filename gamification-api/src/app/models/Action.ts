import mongoose, { Document, Schema } from 'mongoose';

export interface IAction extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  handle: string;
  points: number;
  allowMultiple: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const actionSchema = new Schema<IAction>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    handle: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
    },
    allowMultiple: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for frequently queried fields
actionSchema.index({ eventId: 1, handle: 1 });
actionSchema.index({ eventId: 1, isActive: 1 });

export const Action = mongoose.model<IAction>('Action', actionSchema);
