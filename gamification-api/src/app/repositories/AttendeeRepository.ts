import { Attendee } from '../models/Attendee';
import { AttendeeAction } from '../models/AttendeeAction';

export class AttendeeRepository {
  // Find all attendees
  async findAll(): Promise<any[]> {
    return await Attendee.find().sort({ points: -1 });
  }

  // Find attendee by ID
  async findById(id: string): Promise<any | null> {
    return await Attendee.findById(id).populate('eventId', 'first_name');
  }

  // Find attendee by email and eventId
  async findByEmailAndEvent(eventId: string, email: string): Promise<any | null> {
    return await Attendee.findOne({ eventId, email });
  }

  // Find attendee by swoogoUserId
  async findBySwoogoUserId(swoogoUserId: string): Promise<any | null> {
    return await Attendee.findOne({ swoogoUserId });
  }

  // Create attendee
  async create(attendeeData: any): Promise<any> {
    return await Attendee.create(attendeeData);
  }

  // Update attendee
  async update(id: string, updateData: any): Promise<any | null> {
    return await Attendee.findByIdAndUpdate(id, { $set: updateData }, { new: true });
  }

  // Update attendee by swoogoUserId and eventId
  async updateBySwoogoUserId(eventId: string, swoogoUserId: string, updateData: any): Promise<void> {
    await Attendee.updateOne({ eventId, swoogoUserId }, { $set: updateData });
  }

  // Get attendee history
  async getHistory(attendeeId: string): Promise<any[]> {
    return await AttendeeAction.find({ attendeeId })
      .populate('actionId', 'name points description')
      .sort({ performedAt: -1 });
  }

  // Get recent actions for attendee
  async getRecentActions(attendeeId: string, limit: number = 10): Promise<any[]> {
    return await AttendeeAction.find({ attendeeId })
      .populate('actionId', 'name points')
      .sort({ performedAt: -1 })
      .limit(limit);
  }

  // Add points to attendee
  async addPoints(attendeeId: string, points: number): Promise<any | null> {
    const attendee = await Attendee.findById(attendeeId);
    if (!attendee) return null;

    attendee.points += points;
    attendee.lastAction = new Date();
    return await attendee.save();
  }
}

export const attendeeRepository = new AttendeeRepository();

