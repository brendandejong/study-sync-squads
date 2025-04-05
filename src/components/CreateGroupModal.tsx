
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
import { useCreateGroupForm } from '@/hooks/useCreateGroupForm';
import CreateGroupForm from './study-groups/CreateGroupForm';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (group: Omit<StudyGroup, 'id' | 'createdAt'>) => void;
}

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) => {
  const {
    formState,
    handlers,
    resetForm,
    handleSubmit,
    isFormValid
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
        
        <CreateGroupForm 
          formState={formState}
          handlers={handlers}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
