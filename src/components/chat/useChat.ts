
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage, INITIAL_MESSAGES } from './types';
import { fetchAIResponse, generateLocalResponse } from './chatService';

// Embedded API key - Using the provided key
const EMBEDDED_API_KEY = "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";

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingLocalResponses, setIsUsingLocalResponses] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (input: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add loading message from assistant
    const loadingMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: loadingMessageId,
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isLoading: true
    }]);
    
    setIsLoading(true);
    
    try {
      let response: string;
      let usingLocalFallback = false;
      
      // Only try to use the API if we haven't already determined it's not working
      if (!isUsingLocalResponses) {
        try {
          response = await fetchAIResponse(input, EMBEDDED_API_KEY);
        } catch (error) {
          console.error('Error with embedded API key:', error);
          // Set flag to use local responses for future messages
          setIsUsingLocalResponses(true);
          usingLocalFallback = true;
          // Fallback to local response generation
          response = generateLocalResponse(input);
        }
      } else {
        // We already know we need to use local responses
        usingLocalFallback = true;
        response = generateLocalResponse(input);
      }
      
      // Update the loading message with the actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId 
          ? {
              ...msg, 
              content: response, 
              isLoading: false,
              isLocalResponse: usingLocalFallback
            } 
          : msg
      ));
      
      // If this is the first time we're falling back to local responses, show a notification
      if (usingLocalFallback && !isUsingLocalResponses) {
        toast({
          title: "Using offline mode",
          description: "Unable to connect to AI service. Using enhanced local responses instead.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Update the loading message with an error message
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId 
          ? {
              ...msg, 
              content: "I'm sorry, I had trouble connecting to my knowledge base. Please try again with a different question.", 
              isLoading: false,
              isLocalResponse: true
            } 
          : msg
      ));
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the AI service. Using enhanced local responses.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    isUsingLocalResponses,
    handleSendMessage
  };
};
