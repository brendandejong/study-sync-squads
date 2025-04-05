
import { StudyGroup, Message } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import GroupDetailsHeader from './GroupDetailsHeader';
import GroupDetailsTabs from './GroupDetailsTabs';

interface GroupDetailsProps {
  group: StudyGroup | null;
  messages: Message[];
  isOpen: boolean;
  onClose: () => void;
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
}

const GroupDetails = ({
  group,
  messages,
  isOpen,
  onClose,
  onJoinGroup,
  onLeaveGroup,
}: GroupDetailsProps) => {
  const { currentUser } = useAuth();
  
  if (!group) return null;
  
  const isCurrentUserMember = group.members.some(member => member.id === currentUser?.id);
  const isCurrentUserOwner = group.createdBy === currentUser?.id;

  // Add logging for debugging
  console.log(`GroupDetails - Group ID: ${group.id}`);
  console.log(`GroupDetails - Current user is member: ${isCurrentUserMember}`);
  console.log(`GroupDetails - Members:`, group.members);

  // Define handlers to ensure we're only operating on this specific group
  const handleJoinGroup = () => {
    console.log(`Joining specific group: ${group.id}`);
    onJoinGroup(group.id);
  };

  const handleLeaveGroup = () => {
    console.log(`Leaving specific group: ${group.id}`);
    onLeaveGroup(group.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <GroupDetailsHeader group={group} />
        
        <GroupDetailsTabs 
          group={group}
          messages={messages}
          isCurrentUserMember={isCurrentUserMember}
          isCurrentUserOwner={isCurrentUserOwner}
          currentUser={currentUser}
          onJoinGroup={handleJoinGroup}
          onLeaveGroup={handleLeaveGroup}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetails;
