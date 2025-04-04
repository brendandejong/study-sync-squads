
import { User } from '@/types';
import { getInitials, getRandomColor } from '@/utils/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar = ({ user, size = 'md' }: UserAvatarProps) => {
  const initials = getInitials(user.name);
  const bgColor = getRandomColor(user.id);
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className={bgColor}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
