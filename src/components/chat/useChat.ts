
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage, INITIAL_MESSAGES } from './types';
import { fetchAIResponse, generateLocalResponse } from './chatService';

// Embedded API key - Note: In production, you would normally use environment variables
// This is a placeholder and should be replaced with your actual API key
const EMBEDDED_API_KEY = "sk-your-openai-api-key-here";

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Try to use the embedded API key
      try {
        response = await fetchAIResponse(input, EMBEDDED_API_KEY);
      } catch (error) {
        console.error('Error with embedded API key:', error);
        // Fallback to local response generation
        response = generateLocalResponse(input);
      }
      
      // Update the loading message with the actual response
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessageId 
          ? {
              ...msg, 
              content: response, 
              isLoading: false
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
              content: "I'm sorry, I had trouble connecting to my knowledge base. Please try again later.", 
              isLoading: false
            } 
          : msg
      ));
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to the AI service. Using local fallback responses.",
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
    apiKey: EMBEDDED_API_KEY, // Provide the embedded API key
    handleSendMessage
  };
};
