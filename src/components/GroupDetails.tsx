
import { useState } from 'react';
import { StudyGroup, Message, User } from '@/types';
import { formatTime, formatDate } from '@/utils/helpers';
import UserAvatar from './UserAvatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, MessageSquare, Users, Send, Lock, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { currentUser } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from './ui/badge';

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
  messages: initialMessages,
  isOpen,
  onClose,
  onJoinGroup,
  onLeaveGroup,
}: GroupDetailsProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { toast } = useToast();
  
  if (!group) return null;
  
  const isCurrentUserMember = group.members.some(member => member.id === currentUser.id);
  const isCurrentUserOwner = group.createdBy === currentUser.id;
  const isFull = group.members.length >= group.maxMembers;
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isCurrentUserMember) return;
    
    const newMessageObj: Message = {
      id: `msg-${Date.now()}`,
      groupId: group.id,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <div className={`h-4 w-4 rounded-full mr-2 subject-${group.course.subject}`} />
            {group.name}
            {!group.isPublic && (
              <Badge variant="outline" className="ml-2 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {group.course.code} - {group.course.name}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Group Details</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{group.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {group.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-sm font-medium px-3 py-1 rounded-full tag-${tag}`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </h3>
                <div className="space-y-2">
                  {group.timeSlots.map((slot, index) => (
                    <div key={index} className="bg-white p-2 rounded border">
                      <div className="font-medium">{slot.day}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </h3>
                <p className="text-gray-700">{group.location}</p>
                
                <h3 className="font-medium flex items-center mt-6">
                  <Users className="h-4 w-4 mr-2" />
                  Members ({group.members.length}/{group.maxMembers})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.members.map((member) => (
                    <div key={member.id} className="flex flex-col items-center">
                      <UserAvatar user={member} size="sm" />
                      <span className="text-xs mt-1">{member.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {!group.isPublic && isCurrentUserOwner && (
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h3 className="font-medium flex items-center mb-2">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite People
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  This is a private group. Only people you invite can see and join it.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Invite Members
                  </Button>
                </div>
              </div>
            )}
            
            <div className="pt-4 flex justify-end">
              {isCurrentUserMember ? (
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onLeaveGroup(group.id)}
                >
                  Leave Group
                </Button>
              ) : (
                <Button
                  disabled={isFull}
                  onClick={() => onJoinGroup(group.id)}
                >
                  {isFull ? 'Group is Full' : 'Join Group'}
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="pt-4">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetails;
