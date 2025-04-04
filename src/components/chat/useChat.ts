
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, INITIAL_MESSAGES } from './types';
import { fetchAIResponse, generateLocalResponse } from './chatService';
import { extractEventFromMessage } from '@/utils/calendarUtils';
import { UserEvent } from '@/types/calendar';
import { useCalendar } from '@/hooks/useCalendar';

// Embedded API key for Gemini API - Replace this with your actual API key
const EMBEDDED_API_KEY = "AIzaSyAB5URZseUfBH8OsaJA9hHVh4jlgI6HA24";

export const useChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingLocalResponses, setIsUsingLocalResponses] = useState(false);
  const { toast } = useToast();
  
  // Get necessary calendar hooks from useCalendar (we'll pass empty array for studyGroups)
  const { userEvents, setUserEvents, handleSaveEvent } = useCalendar([]);

  const handleSendMessage = async (input: string) => {
    // Check if the message is a calendar event request
    const extractedEvent = extractEventFromMessage(input);
    
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
      
      // Reset the local responses flag when trying a new message
      if (isUsingLocalResponses) {
        setIsUsingLocalResponses(false);
      }
      
      // If this was a calendar event request, handle it
      if (extractedEvent) {
        // Create a new event
        const newEvent: UserEvent = {
          ...extractedEvent,
          id: `event-${Date.now()}`
        };
        
        // Add the event to the calendar
        setUserEvents(prev => [...prev, newEvent]);
        
        // Get date and time in a readable format for the response
        const dateString = extractedEvent.date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });
        
        // Create a confirmation message
        response = `I've added "${extractedEvent.title}" to your calendar on ${dateString} from ${extractedEvent.startTime} to ${extractedEvent.endTime}. You can view and edit this event in your calendar.`;
        
        // Show a toast notification
        toast({
          title: "Event Added",
          description: `${extractedEvent.title} has been added to your calendar.`,
        });
      } else {
        // Try to use the API if we haven't already determined it's not working
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
