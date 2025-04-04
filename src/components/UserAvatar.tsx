
import { User } from '@/types';
import { getInitials, getRandomColor } from '@/utils/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Settings, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showDropdown?: boolean;
}

const UserAvatar = ({ user, size = 'md', showDropdown = false }: UserAvatarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const { toast } = useToast();
  
  // Ensure user object exists and has a name property before accessing it
  if (!user || !user.name) {
    return null;
  }
  
  const initials = getInitials(user.name);
  const bgColor = getRandomColor(user.id || '0');
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the server
    // For now, we'll just show a success message
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setEditedUser({
            ...editedUser,
            avatar: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const avatarDisplay = (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback className={bgColor}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!showDropdown) {
    return avatarDisplay;
  }

  return (
    <DropdownMenu>
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
        <Popover open={isEditing} onOpenChange={setIsEditing}>
          <PopoverTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Edit Your Profile</h4>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <Avatar className="h-16 w-16 text-lg">
                      <AvatarImage src={editedUser.avatar} alt={editedUser.name} />
                      <AvatarFallback className={bgColor}>{getInitials(editedUser.name)}</AvatarFallback>
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer"
                    >
                      <Settings className="h-3 w-3" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                      />
                    </label>
                  </div>
                </div>
                <label className="text-xs">Name</label>
                <Input 
                  value={editedUser.name} 
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                />
                <label className="text-xs">Bio</label>
                <Input 
                  value={editedUser.bio || ''} 
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  placeholder="Tell us about yourself"
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button size="sm" onClick={handleSaveProfile}>Save</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
