
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GroupDetailsTab from './GroupDetailsTab';
import GroupChatTab from './GroupChatTab';
import { StudyGroup, Message, User } from '@/types';

interface GroupDetailsTabsProps {
  group: StudyGroup;
  messages: Message[];
  isCurrentUserMember: boolean;
  isCurrentUserOwner: boolean;
  currentUser: User | null;
  onJoinGroup: () => void;
  onLeaveGroup: () => void;
}

const GroupDetailsTabs = ({
  group,
  messages,
  isCurrentUserMember,
  isCurrentUserOwner,
  currentUser,
  onJoinGroup,
  onLeaveGroup,
}: GroupDetailsTabsProps) => {
  const isFull = group.members.length >= group.maxMembers;
  
  return (
    <Tabs defaultValue="details">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Group Details</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4 pt-4">
        <GroupDetailsTab 
          group={group}
          isCurrentUserMember={isCurrentUserMember}
          isCurrentUserOwner={isCurrentUserOwner} 
          isFull={isFull}
          onJoinGroup={onJoinGroup}
          onLeaveGroup={onLeaveGroup}
        />
      </TabsContent>
      
      <TabsContent value="chat" className="pt-4">
        <GroupChatTab 
          messages={messages}
          isCurrentUserMember={isCurrentUserMember}
          groupId={group.id}
          currentUser={currentUser}
        />
      </TabsContent>
    </Tabs>
  );
};

export default GroupDetailsTabs;
