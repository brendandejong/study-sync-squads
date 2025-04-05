
import { useState, useEffect } from 'react';
import { Course, StudyGroup, StudyTag, TimeSlot, User } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import AvailabilitySelector from './AvailabilitySelector';
import GroupDetailsForm from './study-groups/GroupDetailsForm';
import GroupVisibilitySelector from './study-groups/GroupVisibilitySelector';
import UserInviteSelector from './study-groups/UserInviteSelector';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: Omit<StudyGroup, 'id' | 'createdAt'>) => void;
}

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [name, setName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [selectedTags, setSelectedTags] = useState<StudyTag[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  // Visibility and user selection state
  const [visibilityType, setVisibilityType] = useState<'public' | 'private'>('public');
  const [isPublic, setIsPublic] = useState(true);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch available users
  useEffect(() => {
    import('@/data/mockData').then(({ users }) => {
      setAvailableUsers(users.filter(user => user.id !== currentUser?.id));
    });
  }, [currentUser?.id]);

  // Filter users based on search query
  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tag: StudyTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddTimeSlot = (timeSlot: TimeSlot) => {
    setTimeSlots([...timeSlots, timeSlot]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleVisibilityChange = (type: 'public' | 'private') => {
    setVisibilityType(type);
    setIsPublic(type === 'public');
    
    // Clear selected users if switching to public
    if (type === 'public') {
      setSelectedUsers([]);
    }
  };

  const handleAddUser = (user: User) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleSubmit = () => {
    if (!selectedCourse || !currentUser) return;
    
    if (!isPublic && selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one user to invite to your private group.",
        variant: "destructive"
      });
      return;
    }
    
    const newGroup = {
      name,
      course: selectedCourse,
      description,
      tags: selectedTags,
      members: [currentUser] as User[],
      maxMembers,
      timeSlots,
      location,
      createdBy: currentUser.id,
      isPublic,
      invitedUsers: isPublic ? undefined : selectedUsers.map(user => user.id),
    };
    
    onCreateGroup(newGroup);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setSelectedCourse(null);
    setDescription('');
    setLocation('');
    setMaxMembers(5);
    setSelectedTags([]);
    setTimeSlots([]);
    setIsPublic(true);
    setVisibilityType('public');
    setSelectedUsers([]);
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Study Group</DialogTitle>
          <DialogDescription>
            Fill out the details below to create a new study group. Others will be able to find and join your group.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <GroupDetailsForm 
            name={name}
            setName={setName}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            description={description}
            setDescription={setDescription}
            location={location}
            setLocation={setLocation}
            maxMembers={maxMembers}
            setMaxMembers={setMaxMembers}
            selectedTags={selectedTags}
            handleTagToggle={handleTagToggle}
          />
          
          <GroupVisibilitySelector 
            visibilityType={visibilityType}
            handleVisibilityChange={handleVisibilityChange}
          />
          
          {visibilityType === 'private' && (
            <UserInviteSelector 
              selectedUsers={selectedUsers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredUsers={filteredUsers}
              handleAddUser={handleAddUser}
              handleRemoveUser={handleRemoveUser}
            />
          )}
          
          <AvailabilitySelector
            timeSlots={timeSlots}
            onAddTimeSlot={handleAddTimeSlot}
            onRemoveTimeSlot={handleRemoveTimeSlot}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            resetForm();
            onClose();
          }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={!name || !selectedCourse || timeSlots.length === 0}
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
