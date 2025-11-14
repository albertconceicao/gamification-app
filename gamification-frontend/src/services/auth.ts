import { AuthUser, SignInData, SignUpData } from '../types/auth';
import api from './api';

interface AuthResponse {
  token: string;
  user: Omit<AuthUser, 'token'>;
}

export const signIn = async (data: SignInData): Promise<AuthUser> => {
  const response = await api.post<AuthResponse>('/auth/login', {
    email: data.email,
    password: data.password
  });
  
  // Combine user data with token
  return {
    ...response.data.user,
    token: response.data.token
  };
};

export const signUp = async (data: SignUpData): Promise<AuthUser> => {
  const response = await api.post<AuthResponse>('/auth/register', {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    passwordConfirmation: data.passwordConfirmation,
  });
  
  // Combine user data with token
  return {
    ...response.data.user,
    token: response.data.token
  };
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const response = await api.get<AuthUser>('/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  // Call the backend to invalidate the token if needed
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Error during sign out:', error);
  }
};
