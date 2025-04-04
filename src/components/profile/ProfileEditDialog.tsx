import { User } from '@/types';
import { useState, useEffect } from 'react';
import { getInitials, getRandomColor } from '@/utils/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => void;
}

const ProfileEditDialog = ({ isOpen, onClose, user, onSave }: ProfileEditDialogProps) => {
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const { toast } = useToast();
  const { updateUserProfile } = useAuth();
  
  // Update local state when user prop changes or dialog opens
  useEffect(() => {
    if (isOpen && user) {
      // Create a deep copy to ensure we're not keeping references
      setEditedUser(JSON.parse(JSON.stringify(user)));
      console.log("ProfileEditDialog received user:", user);
    }
  }, [user, isOpen]);
  
  const handleSave = () => {
    // Validate that the name is not empty
    if (!editedUser.name || !editedUser.name.trim()) {
      toast({
        variant: 'destructive',
        title: "Invalid name",
        description: "Name cannot be empty",
      });
      return;
    }
    
    // Create a clean copy of the updated user
    const updatedUser = {
      ...editedUser,
      name: editedUser.name.trim(),
      email: editedUser.email || user.email, // Ensure email is never empty
      id: user.id, // Preserve the original user ID
    };
    
    console.log("ProfileEditDialog saving user:", updatedUser);
    
    // Update user in auth context (and localStorage)
    updateUserProfile(updatedUser);
    
    // Call the onSave callback to update parent components
    onSave(updatedUser);
    
    // Show success message
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
    
    onClose();
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
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
                <AvatarFallback className={getRandomColor(editedUser.id || '0')}>{getInitials(editedUser.name)}</AvatarFallback>
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
                  onChange={(e) => {
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
                  }} 
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
