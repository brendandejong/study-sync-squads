
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
import { Settings, User as UserIcon, LogOut, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
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
  const [currentUser, setCurrentUser] = useState<User>({ ...user });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { toast } = useToast();
  
  // Ensure user object exists and has a name property before accessing it
  if (!user || !user.name) {
    return null;
  }
  
  // Update currentUser whenever user prop changes
  useEffect(() => {
    setCurrentUser({ ...user });
  }, [user]);
  
  const initials = getInitials(currentUser.name);
  const bgColor = getRandomColor(currentUser.id || '0');
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const handleSaveProfile = () => {
    // Apply the edited user data to the current user
    setCurrentUser({ ...editedUser });
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleEditOpen = () => {
    // Reset the edited user data to current user data when opening
    setEditedUser({ ...currentUser });
    setIsEditing(true);
    // Close dropdown when opening edit dialog
    setDropdownOpen(false);
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
      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
      <AvatarFallback className={bgColor}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  if (!showDropdown) {
    return avatarDisplay;
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
            {avatarDisplay}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{currentUser.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            handleEditOpen();
          }}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
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

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Your Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="name">Name</label>
              <Input 
                id="name"
                value={editedUser.name} 
                onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input 
                id="email"
                value={editedUser.email} 
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                type="email"
                placeholder="your@email.com"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="bio">Bio</label>
              <Input 
                id="bio"
                value={editedUser.bio || ''} 
                onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAvatar;
