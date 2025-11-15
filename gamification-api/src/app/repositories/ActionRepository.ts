import { IAction } from '../models/Action';
import { Action } from '../models/Action';
import { AttendeeAction } from '../models/AttendeeAction';

export class ActionRepository {
  // Create a new action
  async createAction(actionData: Partial<IAction>): Promise<IAction> {
    const action = new Action(actionData);
    return await action.save();
  }

  // Find action by ID
  async findById(id: string, populate?: string): Promise<IAction | null> {
    const query = Action.findById(id);
    if (populate) {
      return await query.populate(populate);
    }
    return await query;
  }

  // Find action by handle
  async findByHandle(handle: string): Promise<IAction | null> {
    return await Action.findOne({ handle });
  }

  // Find actions by eventId
  async findByEventId(eventId: string): Promise<IAction[]> {
    return await Action.find({ eventId }).sort({ points: -1 });
  }

  // Update an action
  async updateAction(
    id: string,
    updateData: Partial<IAction>
  ): Promise<IAction | null> {
    const action = await Action.findById(id);
    if (!action) return null;

    // Update fields
    if (updateData.name !== undefined) action.name = updateData.name;
    if (updateData.handle !== undefined) action.handle = updateData.handle;
    if (updateData.description !== undefined) action.description = updateData.description;
    if (updateData.points !== undefined) {
      if (updateData.points < 0) {
        throw new Error('Pontuação deve ser maior ou igual a zero');
      }
      action.points = updateData.points;
    }
    if (updateData.allowMultiple !== undefined) action.allowMultiple = updateData.allowMultiple;
    if (updateData.isActive !== undefined) action.isActive = updateData.isActive;

    return await action.save();
  }

  // Delete an action
  async deleteAction(id: string): Promise<boolean> {
    // Check if there are any attendee actions using this action
    const count = await AttendeeAction.countDocuments({ actionId: id });
    if (count > 0) {
      throw new Error(`Cannot delete action. There are ${count} attendee action(s) linked to this action.`);
    }

    const result = await Action.findByIdAndDelete(id);
    return result !== null;
  }

  // Get action with stats (times performed)
  async findByIdWithStats(id: string): Promise<IAction | null> {
    const action = await Action.findById(id).populate('eventId', 'name');
    if (!action) return null;

    const timesPerformed = await AttendeeAction.countDocuments({ actionId: id });
    return {
      ...action.toObject(),
      stats: {
        timesPerformed
      }
    } as any;
  }
}

export const actionRepository = new ActionRepository();
