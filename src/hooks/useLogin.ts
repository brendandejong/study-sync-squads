
import { useState } from 'react';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { saveUserToStorage, loadUserFromStorage } from '@/utils/authUtils';

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export const useLogin = (setCurrentUser: (user: User) => void, setIsAuthenticated: (value: boolean) => void): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
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
            saveUserToStorage(user);
            
            // We're not showing a toast here because Login.tsx will handle it
            resolve();
          } else {
            reject(new Error('Invalid email or password'));
          }
        } catch (error) {
          console.error('Login error:', error);
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    });
  };

  return {
    login,
    isLoading
  };
};
