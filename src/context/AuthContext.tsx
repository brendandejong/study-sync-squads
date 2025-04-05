
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useLogin } from '@/hooks/useLogin';
import { useSignup } from '@/hooks/useSignup';
import { useProfile } from '@/hooks/useProfile';
import { loadUserFromStorage, removeUserFromStorage } from '@/utils/authUtils';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Import our hooks
  const { login } = useLogin(setCurrentUser, setIsAuthenticated);
  const { signup } = useSignup(setCurrentUser, setIsAuthenticated);
  const { updateUserProfile } = useProfile(setCurrentUser);

  // Check for saved login on mount
  useEffect(() => {
    const savedUser = loadUserFromStorage();
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsAuthenticated(true);
      console.log('Loaded user from localStorage:', savedUser);
    }
  }, []);

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    removeUserFromStorage();
    
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
