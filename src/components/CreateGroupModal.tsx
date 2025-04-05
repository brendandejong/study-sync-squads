
import { StudyGroup } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AvailabilitySelector from './AvailabilitySelector';
import GroupDetailsForm from './study-groups/GroupDetailsForm';
import GroupVisibilitySelector from './study-groups/GroupVisibilitySelector';
import UserInviteSelector from './study-groups/UserInviteSelector';
import { useCreateGroupForm } from '@/hooks/useCreateGroupForm';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: Omit<StudyGroup, 'id' | 'createdAt'>) => void;
}

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) => {
  const {
    // Form values
    name,
    selectedCourse,
    description,
    location,
    maxMembers,
    selectedTags,
    timeSlots,
    visibilityType,
    selectedUsers,
    searchQuery,
    filteredUsers,
    
    // Setters
    setName,
    setSelectedCourse,
    setDescription,
    setLocation,
    setMaxMembers,
    setSearchQuery,
    
    // Event handlers
    handleTagToggle,
    handleAddTimeSlot,
    handleRemoveTimeSlot,
    handleVisibilityChange,
    handleAddUser,
    handleRemoveUser,
    handleSubmit,
    resetForm
  } = useCreateGroupForm(onCreateGroup, onClose);

  const handleCancel = () => {
    resetForm();
    onClose();
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
          <Button variant="outline" onClick={handleCancel}>
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
