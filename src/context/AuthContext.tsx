import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updatedUser: User) => void;
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
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
        console.log('Loaded user from localStorage:', parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      }
    }
  }, []);

  const updateUserProfile = (updatedUser: User) => {
    console.log('AuthContext: Updating user profile:', updatedUser);
    
    if (!updatedUser.id || !updatedUser.name) {
      console.error('Invalid user data:', updatedUser);
      return;
    }
    
    // Create a deep copy to avoid reference issues
    const newUser: User = JSON.parse(JSON.stringify(updatedUser));
    
    // Update React state first
    setCurrentUser(newUser);
    
    // Then immediately update localStorage
    try {
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('User successfully saved in localStorage:', newUser);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  const login = async (email: string, password: string) => {
    // This is a mock implementation
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simple validation for demo purposes
        if (email && password) {
          // Check if there's a saved user with this email
          const savedUser = localStorage.getItem('user');
          let user: User;
          
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              // If the email matches, use the saved user (preserves profile changes)
              if (parsedUser.email === email) {
                user = parsedUser;
                console.log('Logging in with saved user profile:', user);
              } else {
                // If email doesn't match, create a new user
                user = {
                  id: 'user-1',
                  name: 'Demo User',
                  email: email,
                  avatar: '',
                };
              }
            } catch (error) {
              // If parsing fails, create a new user
              user = {
                id: 'user-1',
                name: 'Demo User',
                email: email,
                avatar: '',
              };
            }
          } else {
            // If no saved user, create a new one
            user = {
              id: 'user-1',
              name: 'Demo User',
              email: email,
              avatar: '',
            };
          }
          
          // Update state and localStorage
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
          // Clear all existing local storage data to ensure a fresh start
          const keysToPreserve = ['theme', 'prefersColorScheme'];
          
          // Get all localStorage keys
          const allKeys = Object.keys(localStorage);
          
          // Remove all app-related data, preserving only system settings
          allKeys.forEach(key => {
            if (!keysToPreserve.includes(key)) {
              localStorage.removeItem(key);
            }
          });
          
          const user: User = {
            id: `user-${Date.now()}`,
            name: name,
            email: email,
            avatar: '',
          };
          
          // Initialize empty data collections
          localStorage.setItem('studyGoals', JSON.stringify([]));
          localStorage.setItem('studySessions', JSON.stringify([]));
          localStorage.setItem('studyStats', JSON.stringify({
            totalHours: 0,
            weeklyHours: 0,
            monthlyHours: 0,
            preferredStudyType: "",
            preferredTime: "",
            streak: 0,
            mostStudiedCourse: ""
          }));
          localStorage.setItem('userCourses', JSON.stringify([]));
          localStorage.setItem('userEvents', JSON.stringify([]));
          
          // Set current user and authentication state
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
