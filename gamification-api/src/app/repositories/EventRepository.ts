import Event from '../models/Event';
import { Action } from '../models/Action';
import { Attendee } from '../models/Attendee';

export class EventRepository {
  // Find all events
  async findAll(ownerId?: string): Promise<any[]> {
    const query = ownerId ? { ownerId } : {};
    return await Event.find(query).sort({ createdAt: -1 });
  }

  // Find event by ID
  async findById(id: string): Promise<any | null> {
    return await Event.findById(id);
  }

  // Create event
  async create(eventData: any): Promise<any> {
    return await Event.create(eventData);
  }

  // Update event
  async update(id: string, updateData: any): Promise<any | null> {
    const event = await Event.findById(id);
    if (!event) return null;

    if (updateData.name !== undefined) event.name = updateData.name;
    if (updateData.description !== undefined) event.description = updateData.description;
    if (updateData.startDate !== undefined) event.startDate = updateData.startDate;
    if (updateData.endDate !== undefined) event.endDate = updateData.endDate;
    if (updateData.isActive !== undefined) event.isActive = updateData.isActive;
    if (updateData.swoogoEventId !== undefined) event.swoogoEventId = updateData.swoogoEventId;

    return await event.save();
  }

  // Delete event
  async delete(id: string): Promise<boolean> {
    const result = await Event.findByIdAndDelete(id);
    return result !== null;
  }

  // Get event statistics
  async getStats(eventId: string): Promise<{ totalActions: number; totalUsers: number }> {
    const [actionsCount, usersCount] = await Promise.all([
      Action.countDocuments({ eventId }),
      Attendee.countDocuments({ eventId })
    ]);

    return { totalActions: actionsCount, totalUsers: usersCount };
  }

  // Get event ranking
  async getRanking(eventId: string): Promise<any[]> {
    return await Attendee.find({ eventId })
      .sort({ points: -1 })
      .select('first_name email points lastAction');
  }

  // Get event actions
  async getActions(eventId: string): Promise<any[]> {
    return await Action.find({ eventId }).sort({ points: -1 });
  }

  // Check if event can be deleted
  async canDelete(eventId: string): Promise<{ canDelete: boolean; usersCount: number; actionsCount: number }> {
    const [usersCount, actionsCount] = await Promise.all([
      Attendee.countDocuments({ eventId }),
      Action.countDocuments({ eventId })
    ]);

    return {
      canDelete: usersCount === 0 && actionsCount === 0,
      usersCount,
      actionsCount
    };
  }

  // Find event by swoogoEventId
  async findBySwoogoEventId(swoogoEventId: string): Promise<any | null> {
    return await Event.findOne({ swoogoEventId });
  }
}

export const eventRepository = new EventRepository();

