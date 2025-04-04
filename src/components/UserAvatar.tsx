
import { User } from '@/types';
import { useState } from 'react';
import AvatarDisplay from './profile/AvatarDisplay';
import AvatarDropdownMenu from './profile/AvatarDropdownMenu';
import ProfileEditDialog from './profile/ProfileEditDialog';
import { useAuth } from '@/context/AuthContext';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showDropdown?: boolean;
}

const UserAvatar = ({ user, size = 'md', showDropdown = false }: UserAvatarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser, updateUserProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Ensure user object exists and has a name property before accessing it
  if (!currentUser || !currentUser.name) {
    return null;
  }
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const handleSaveProfile = (updatedUser: User) => {
    // Update the user in context and localStorage
    updateUserProfile(updatedUser);
    setIsEditing(false);
  };

  const handleEditOpen = () => {
    setIsEditing(true);
    setDropdownOpen(false);
  };

  const avatarDisplay = <AvatarDisplay user={currentUser} sizeClass={sizeClasses[size]} />;

  if (!showDropdown) {
    return avatarDisplay;
  }

  return (
    <>
      <AvatarDropdownMenu 
        user={currentUser}
        sizeClass={sizeClasses[size]}
        avatarDisplay={avatarDisplay}
        onEditProfile={handleEditOpen}
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
      />

      <ProfileEditDialog 
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        user={currentUser}
        onSave={handleSaveProfile}
      />
    </>
  );
};

export default UserAvatar;
