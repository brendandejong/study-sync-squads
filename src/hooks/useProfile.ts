
import { User } from '@/types';
import { saveUserToStorage } from '@/utils/authUtils';

interface UseProfileReturn {
  updateUserProfile: (updatedUser: User) => void;
}

export const useProfile = (setCurrentUser: (user: User | null) => void): UseProfileReturn => {
  const updateUserProfile = (updatedUser: User) => {
    console.log('useProfile: Updating user profile:', updatedUser);
    
    if (!updatedUser.id || !updatedUser.name) {
      console.error('Invalid user data:', updatedUser);
      return;
    }
    
    // Create a deep copy to avoid reference issues
    const newUser: User = JSON.parse(JSON.stringify(updatedUser));
    
    // Update React state first
    setCurrentUser(newUser);
    
    // Then immediately update localStorage
    saveUserToStorage(newUser);
  };

  return {
    updateUserProfile
  };
};
