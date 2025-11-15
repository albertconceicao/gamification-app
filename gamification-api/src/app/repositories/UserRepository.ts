import { User, IUser } from '../models/User';

export class UserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return await User.create(userData);
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async findAll(): Promise<IUser[]> {
    return await User.find().select('-password');
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id, 
      { $set: updateData },
      { new: true }
    ).select('-password');
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }

  async comparePassword(user: IUser, candidatePassword: string): Promise<boolean> {
    return await user.comparePassword(candidatePassword);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }
}

export const userRepository = new UserRepository();
