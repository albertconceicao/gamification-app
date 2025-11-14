export interface AuthUser {
  id: string;
  first_name: string;
  email: string;
  token: string;
  role?: 'user' | 'admin';
  points?: number;
  eventId?: string;
  registeredAt?: string;
  lastAction?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<AuthUser>;
  signUp: (data: SignUpData) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<AuthUser | null>;
  updateUser: (user: AuthUser | null) => void;
}
