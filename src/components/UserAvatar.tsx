
import { User } from '@/types';
import { useState, useEffect } from 'react';
import AvatarDisplay from './profile/AvatarDisplay';
import AvatarDropdownMenu from './profile/AvatarDropdownMenu';
import ProfileEditDialog from './profile/ProfileEditDialog';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showDropdown?: boolean;
}

const UserAvatar = ({ user, size = 'md', showDropdown = false }: UserAvatarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({ ...user });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Ensure user object exists and has a name property before accessing it
  if (!user || !user.name) {
    return null;
  }
  
  // Update currentUser whenever user prop changes
  useEffect(() => {
    setCurrentUser({ ...user });
  }, [user]);
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const handleSaveProfile = (updatedUser: User) => {
    setCurrentUser({ ...updatedUser });
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
