
import { useState } from 'react';
import { Message, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import UserAvatar from '../UserAvatar';
import { formatDate } from '@/utils/helpers';

interface GroupChatTabProps {
  messages: Message[];
  isCurrentUserMember: boolean;
  groupId: string;
  currentUser: User | null;
}

const GroupChatTab = ({
  messages: initialMessages,
  isCurrentUserMember,
  groupId,
  currentUser,
}: GroupChatTabProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { toast } = useToast();
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isCurrentUserMember || !currentUser) return;
    
    const newMessageObj: Message = {
      id: `msg-${Date.now()}`,
      groupId: groupId,
      userId: currentUser.id,
      user: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    // Update local state with the new message
    setMessages(prev => [...prev, newMessageObj]);
    setNewMessage('');
    
    // In a real app, this would send the message to the server
    toast({
      description: "Message sent successfully",
      duration: 2000,
    });
  };
  
  return (
    <div className="flex flex-col h-[350px]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className="flex items-start gap-2">
              <UserAvatar user={message.user} size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700">{message.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>
      
      {isCurrentUserMember ? (
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded">
          <p className="text-gray-600">Join this group to participate in the chat</p>
        </div>
      )}
    </div>
  );
};

export default GroupChatTab;
