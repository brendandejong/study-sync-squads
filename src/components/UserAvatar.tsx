
import { User } from '@/types';
import { useState, useEffect } from 'react';
import AvatarDisplay from './profile/AvatarDisplay';
import AvatarDropdownMenu from './profile/AvatarDropdownMenu';
import ProfileEditDialog from './profile/ProfileEditDialog';
import { useAuth } from '@/context/AuthContext';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showDropdown?: boolean;
}

const UserAvatar = ({ user: initialUser, size = 'md', showDropdown = false }: UserAvatarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser, updateUserProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [displayUser, setDisplayUser] = useState<User>(initialUser);
  
  // Update local state when initialUser changes
  useEffect(() => {
    // Only update from currentUser if this avatar is showing the current user
    if (currentUser && initialUser.id === currentUser.id) {
      setDisplayUser(currentUser);
    } else {
      setDisplayUser(initialUser);
    }
  }, [currentUser, initialUser]);
  
  // If no user is available, don't render anything
  if (!displayUser || !displayUser.name) {
    console.log("UserAvatar: No valid user available");
    return null;
  }
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const handleSaveProfile = (updatedUser: User) => {
    console.log("UserAvatar saving profile:", updatedUser);
    
    // Update the user in context and localStorage
    updateUserProfile(updatedUser);
    
    // Also update local state to immediately reflect changes
    setDisplayUser(updatedUser);
    setIsEditing(false);
  };

  const handleEditOpen = () => {
    setIsEditing(true);
    setDropdownOpen(false);
  };

  const avatarDisplay = <AvatarDisplay user={displayUser} sizeClass={sizeClasses[size]} />;

  if (!showDropdown) {
    return avatarDisplay;
  }

  return (
    <>
      <AvatarDropdownMenu 
        user={displayUser}
        sizeClass={sizeClasses[size]}
        avatarDisplay={avatarDisplay}
        onEditProfile={handleEditOpen}
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
      />

      <ProfileEditDialog 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        user={displayUser}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default UserAvatar;
