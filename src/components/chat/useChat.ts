
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage, INITIAL_MESSAGES } from './types';
import { fetchAIResponse, generateLocalResponse } from './chatService';

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('studyAssistantApiKey'));
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
      if (apiKey) {
        // Call the OpenAI API
        response = await fetchAIResponse(input, apiKey);
      } else {
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
  
  const handleSaveApiKey = () => {
    const key = prompt("Enter your OpenAI API key to enable advanced AI responses:");
    if (key) {
      localStorage.setItem('studyAssistantApiKey', key);
      setApiKey(key);
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved. The assistant will now use AI-powered responses.",
      });
    }
  };
  
  const handleClearApiKey = () => {
    localStorage.removeItem('studyAssistantApiKey');
    setApiKey(null);
    toast({
      title: "API Key Removed",
      description: "Your API key has been removed. The assistant will now use local responses.",
    });
  };

  return {
    isOpen,
    setIsOpen,
    messages,
    isLoading,
    apiKey,
    handleSendMessage,
    handleSaveApiKey,
    handleClearApiKey
  };
};
