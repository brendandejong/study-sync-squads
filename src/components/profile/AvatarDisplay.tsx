
import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, getRandomColor } from '@/utils/helpers';

interface AvatarDisplayProps {
  user: User;
  sizeClass: string;
}

const AvatarDisplay = ({ user, sizeClass }: AvatarDisplayProps) => {
  const initials = getInitials(user.name);
  const bgColor = getRandomColor(user.id || '0');
  
  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className={bgColor}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarDisplay;
