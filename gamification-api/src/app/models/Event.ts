import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  ownerId?: mongoose.Types.ObjectId;
  swoogoEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    swoogoEventId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes
eventSchema.index({ ownerId: 1, isActive: 1 });
eventSchema.index({ swoogoEventId: 1 });

export default mongoose.model<IEvent>('Event', eventSchema);

