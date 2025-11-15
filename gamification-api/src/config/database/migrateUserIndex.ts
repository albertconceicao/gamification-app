import mongoose from 'mongoose';
import { User } from '../../app/models/User';

/**
 * Migration script to drop the old username index
 * Run this once after removing username field from User model
 */
export const dropUsernameIndex = async (): Promise<void> => {
  try {
    // Check if the index exists
    const indexes = await User.collection.indexes();
    const usernameIndex = indexes.find((index: any) => index.name === 'username_1');
    
    if (usernameIndex) {
      console.log('Dropping username_1 index...');
      await User.collection.dropIndex('username_1');
      console.log('✅ Successfully dropped username_1 index');
    } else {
      console.log('ℹ️  username_1 index does not exist, skipping...');
    }
  } catch (error: any) {
    // If index doesn't exist, that's fine
    if (error.code === 27 || error.codeName === 'IndexNotFound') {
      console.log('ℹ️  username_1 index does not exist, skipping...');
    } else {
      console.error('❌ Error dropping username index:', error);
      throw error;
    }
  }
};

