
import { useState } from 'react';
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

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: Omit<StudyGroup, 'id' | 'createdAt'>) => void;
}

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [selectedTags, setSelectedTags] = useState<StudyTag[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isPublic, setIsPublic] = useState(true);

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

  const handleSubmit = () => {
    if (!selectedCourse || !currentUser) return;
    
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
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="isPublic">Make this group public</Label>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            <p className="text-sm text-gray-500">
              {isPublic 
                ? "This group will be visible to all users and anyone can request to join." 
                : "This group will only be visible to users you invite directly."}
            </p>
          </div>
          
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
