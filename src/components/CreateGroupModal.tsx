
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import CourseSelector from './CourseSelector';
import AvailabilitySelector from './AvailabilitySelector';
import { useAuth } from '@/context/AuthContext';
import { Badge } from './ui/badge';
import { Lock, Users, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: Omit<StudyGroup, 'id' | 'createdAt'>) => void;
}

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [selectedTags, setSelectedTags] = useState<StudyTag[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [visibilityType, setVisibilityType] = useState<'public' | 'private'>('public');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock function to fetch available users - in a real app, this would call an API
  useEffect(() => {
    // This would be replaced with an actual API call in a real application
    import('@/data/mockData').then(({ users }) => {
      setAvailableUsers(users.filter(user => user.id !== currentUser?.id));
    });
  }, [currentUser?.id]);

  const availableTags: { value: StudyTag; label: string }[] = [
    { value: 'quiet', label: 'Quiet Session' },
    { value: 'flashcards', label: 'Flashcards' },
    { value: 'exam', label: 'Exam Cram' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'practice', label: 'Practice' },
  ];

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

  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="Give your group a name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Course</Label>
              <CourseSelector
                selectedCourse={selectedCourse}
                onSelectCourse={setSelectedCourse}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your study group's focus, goals, etc."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Where will you meet?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxMembers">Maximum Members</Label>
              <Input
                id="maxMembers"
                type="number"
                min="2"
                max="20"
                value={maxMembers}
                onChange={(e) => setMaxMembers(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Group Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <div key={tag.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.value}`}
                    checked={selectedTags.includes(tag.value)}
                    onCheckedChange={() => handleTagToggle(tag.value)}
                  />
                  <label
                    htmlFor={`tag-${tag.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <Label>Group Visibility</Label>
            
            <RadioGroup 
              value={visibilityType} 
              onValueChange={(value) => handleVisibilityChange(value as 'public' | 'private')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="r1" />
                <Label htmlFor="r1" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Public - Anyone can see and join this group</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="r2" />
                <Label htmlFor="r2" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Private - Only you and people you invite can see this group</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {visibilityType === 'private' && (
            <div className="space-y-4 border-t pt-4">
              <Label>Invite Users</Label>
              <div className="space-y-2">
                <Input 
                  placeholder="Search users by name or email" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 my-2">
                    {selectedUsers.map(user => (
                      <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                        {user.name}
                        <button 
                          onClick={() => handleRemoveUser(user.id)}
                          className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-md max-h-40 overflow-y-auto p-2">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                        onClick={() => handleAddUser(user)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2 text-gray-500">No users found</div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  Selected users will be able to see and join your private group. You can add more users later.
                </p>
              </div>
            </div>
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
