import { createContext, ReactNode, useState, useContext, useEffect, useCallback } from 'react';
import { AuthUser, AuthContextType, SignInData, SignUpData } from '../types/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { signIn as signInApi, signUp as signUpApi, signOut as signOutApi, getCurrentUser as getCurrentUserApi } from '../services/auth';
import api from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'gamification_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        // Verify if the token is still valid
        const currentUser = await getCurrentUserApi();
        
        if (currentUser) {
          setUser(currentUser);
        } else {
          // If token is invalid, clear the stored user
          localStorage.removeItem(USER_STORAGE_KEY);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Update axios headers when user changes
  useEffect(() => {
    if (user?.token) {
      // Add token to axios default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const signIn = useCallback(async (data: SignInData) => {
    try {
      const user = await signInApi(data);
      setUser(user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      
      // Redirect to the intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }, [navigate, location.state]);

  const signUp = useCallback(async (data: SignUpData) => {
    try {
      const user = await signUpApi(data);
      setUser(user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      
      // Redirect to home after successful sign up
      navigate('/', { replace: true });
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }, [navigate]);

  const signOut = useCallback(async () => {
    try {
      await signOutApi();
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      delete api.defaults.headers.common['Authorization'];
      navigate('/signin', { replace: true });
    }
  }, [navigate]);

  const updateUser = useCallback((user: AuthUser | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        signIn, 
        signUp, 
        signOut,
        getCurrentUser: getCurrentUserApi,
        updateUser
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
