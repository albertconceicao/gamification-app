import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendeeAction extends Document {
  attendeeId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  actionId: mongoose.Types.ObjectId;
  pointsEarned: number;
  performedAt: Date;
  createdAt: Date;
}

const AttendeeActionSchema: Schema = new Schema({
  attendeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Attendee',
    required: true,
    index: true
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  actionId: {
    type: Schema.Types.ObjectId,
    ref: 'Action',
    required: true,
    index: true
  },
  pointsEarned: {
    type: Number,
    required: true,
    min: 0
  },
  performedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for common queries
AttendeeActionSchema.index({ attendeeId: 1, actionId: 1 });
AttendeeActionSchema.index({ eventId: 1, performedAt: -1 });

export const AttendeeAction = mongoose.model<IAttendeeAction>('AttendeeAction', AttendeeActionSchema);

