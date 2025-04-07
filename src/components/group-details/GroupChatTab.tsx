
import { useState, useEffect } from 'react';
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
  
  // Subscribe to message updates from localStorage - this ensures all users see the same messages
  useEffect(() => {
    // Initialize with the provided messages
    setMessages(initialMessages);
    
    // Check for updates to messages in localStorage every second
    const intervalId = setInterval(() => {
      const storedMessagesStr = localStorage.getItem(`groupMessages-${groupId}`);
      if (storedMessagesStr) {
        try {
          const storedMessages = JSON.parse(storedMessagesStr) as Message[];
          // Only update if there's a difference to avoid unnecessary rerenders
          if (JSON.stringify(storedMessages) !== JSON.stringify(messages)) {
            console.log('Updating messages from localStorage for group:', groupId);
            setMessages(storedMessages);
          }
        } catch (error) {
          console.error('Error parsing stored messages:', error);
        }
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [groupId, initialMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isCurrentUserMember || !currentUser) return;
    
    const newMessageObj: Message = {
      id: `msg-${Date.now()}-${currentUser.id}`,
      groupId: groupId,
      userId: currentUser.id,
      user: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    
    // Update local state with the new message
    const updatedMessages = [...messages, newMessageObj];
    setMessages(updatedMessages);
    setNewMessage('');
    
    // Save to localStorage so other users can see the message
    try {
      localStorage.setItem(`groupMessages-${groupId}`, JSON.stringify(updatedMessages));
      console.log('Saved message to localStorage for group:', groupId);
    } catch (error) {
      console.error('Error saving message to localStorage:', error);
    }
    
    toast({
      description: "Message sent successfully",
      duration: 2000,
    });
  };
  
  return (
    <div className="flex flex-col h-[350px]">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex items-start gap-2 mb-3 ${message.userId === currentUser?.id ? 'justify-end' : ''}`}
            >
              {message.userId !== currentUser?.id && (
                <UserAvatar user={message.user} size="sm" />
              )}
              
              <div className={`flex flex-col max-w-[70%] ${message.userId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {message.userId === currentUser?.id ? 'You' : message.user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                
                <div 
                  className={`px-3 py-2 rounded-lg ${
                    message.userId === currentUser?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
              
              {message.userId === currentUser?.id && (
                <UserAvatar user={message.user} size="sm" />
              )}
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
