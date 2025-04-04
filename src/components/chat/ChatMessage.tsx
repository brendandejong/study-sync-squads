
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';
import { Bot } from 'lucide-react';
import { ChatMessage as ChatMessageType } from './types';
import { User } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  currentUser: User;
}

const ChatMessage = ({ message, currentUser }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex items-start gap-2 max-w-[85%]",
        message.sender === 'user' ? "ml-auto" : ""
      )}
    >
      {message.sender === 'assistant' && (
        <div className="flex-shrink-0 mt-1 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4" />
        </div>
      )}
      
      <div
        className={cn(
          "py-2 px-3 rounded-lg",
          message.sender === 'user'
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {message.isLoading ? (
          <div className="flex gap-1">
            <span className="animate-bounce">•</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>•</span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>•</span>
          </div>
        ) : (
          <p className="text-sm">{message.content}</p>
        )}
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      {message.sender === 'user' && (
        <UserAvatar user={currentUser} size="sm" />
      )}
    </div>
  );
};

export default ChatMessage;
