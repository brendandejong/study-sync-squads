import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage, INITIAL_MESSAGES } from './types';
import { fetchAIResponse, generateLocalResponse } from './chatService';

// Embedded API key for Gemini API - Replace this with your actual API key
const EMBEDDED_API_KEY = "AIzaSyAB5URZseUfBH8OsaJA9hHVh4jlgI6HA24";

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
          console.error('Error with Gemini API:', error);
          // Set flag to use local responses for future messages
          setIsUsingLocalResponses(true);
          usingLocalFallback = true;
          // Fallback to local response generation
          response = generateLocalResponse(input);
          
          // Show a notification about falling back to local responses
          toast({
            title: "Using offline mode",
            description: "Unable to connect to Gemini AI service. Using enhanced local responses instead.",
            variant: "default"
          });
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
