
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { currentUser } from '@/data/mockData';
import { useChat } from './useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';

const ChatAssistant = () => {
  const { 
    isOpen, 
    setIsOpen, 
    messages, 
    isLoading, 
    handleSendMessage
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {/* Chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg"
        aria-label="Open chat assistant"
      >
        <Bot className="h-6 w-6" />
      </Button>
      
      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 md:w-96 h-[70vh] max-h-[600px] bg-white rounded-lg shadow-xl flex flex-col border z-50">
          {/* Chat header */}
          <ChatHeader 
            onClose={() => setIsOpen(false)}
          />
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                currentUser={currentUser} 
              />
            ))}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <ChatInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
