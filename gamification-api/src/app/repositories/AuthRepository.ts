import { IUser } from '../models/User';
import { userRepository } from './UserRepository';

export class AuthRepository {
  async loginUser(email: string, password: string): Promise<{ user: IUser | null; isValid: boolean }> {
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      return { user: null, isValid: false };
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return { user: null, isValid: false };
    }

    // Update last login
    await userRepository.updateLastLogin(user._id.toString());
    
    return { user, isValid: true };
  }

  async getProfile(userId: string): Promise<IUser | null> {
    return userRepository.findById(userId);
  }
}

export const authRepository = new AuthRepository();
