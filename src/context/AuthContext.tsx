
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for saved login on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUser = localStorage.getItem('user');
    
    if (isLoggedIn && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // This is a mock implementation
    // In a real app, you would call your authentication API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation for demo purposes
        if (email && password) {
          const user: User = {
            id: 'user-1',
            name: 'Demo User',
            email: email,
            avatar: '',
          };
          
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(user));
          
          toast({
            title: 'Login successful',
            description: 'Welcome back!',
          });
          
          resolve();
        } else {
          toast({
            variant: 'destructive',
            title: 'Login failed',
            description: 'Invalid email or password.',
          });
          
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // This is a mock implementation
    // In a real app, you would call your registration API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation for demo purposes
        if (name && email && password) {
          const user: User = {
            id: `user-${Date.now()}`,
            name: name,
            email: email,
            avatar: '',
          };
          
          setCurrentUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(user));
          
          toast({
            title: 'Account created',
            description: 'Your account has been successfully created!',
          });
          
          resolve();
        } else {
          toast({
            variant: 'destructive',
            title: 'Signup failed',
            description: 'Please fill in all required fields.',
          });
          
          reject(new Error('Please fill in all required fields'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
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
