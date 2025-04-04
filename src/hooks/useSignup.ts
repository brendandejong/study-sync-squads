
import { useState } from 'react';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { saveUserToStorage, initializeUserData } from '@/utils/authUtils';

interface UseSignupReturn {
  signup: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export const useSignup = (setCurrentUser: (user: User) => void, setIsAuthenticated: (value: boolean) => void): UseSignupReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          // Simple validation for demo purposes
          if (name && email && password) {
            // Clear all existing local storage data to ensure a fresh start
            initializeUserData();
            
            const user: User = {
              id: `user-${Date.now()}`,
              name: name,
              email: email,
              avatar: '',
            };
            
            // Set current user and authentication state
            setCurrentUser(user);
            setIsAuthenticated(true);
            saveUserToStorage(user);
            
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
        } catch (error) {
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    });
  };

  return {
    signup,
    isLoading
  };
};
