
import { User } from '@/types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Settings, User as UserIcon, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, getRandomColor } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AvatarDropdownMenuProps {
  user: User;
  sizeClass: string;
  avatarDisplay: React.ReactNode;
  onEditProfile: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AvatarDropdownMenu = ({ 
  user, 
  sizeClass, 
  avatarDisplay, 
  onEditProfile,
  open,
  onOpenChange
}: AvatarDropdownMenuProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
          {avatarDisplay}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => {
          e.preventDefault();
          onEditProfile();
        }}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={(e) => {
          e.preventDefault();
          navigate('/account');
        }}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => {
          e.preventDefault();
          handleLogout();
        }}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarDropdownMenu;
