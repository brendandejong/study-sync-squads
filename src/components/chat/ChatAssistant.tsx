
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, MessageSquare, X, Sparkles, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import UserAvatar from '@/components/UserAvatar';
import { currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

// Define types for messages
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    content: 'Hi there! I\'m your Study Assistant. I can help you with study planning, coordination tips, finding resources, and answering questions about your courses. How can I help you today?',
    sender: 'assistant',
    timestamp: new Date(),
  },
];

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('studyAssistantApiKey'));
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to add a new message from the user
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
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
    
    setInput('');
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
  
  // Fetch response from OpenAI API
  const fetchAIResponse = async (userInput: string, apiKey: string): Promise<string> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful study assistant. Provide concise, practical advice about studying, time management, coordination with study groups, and academic resources. Keep responses under 150 words and be supportive but direct."
          },
          {
            role: "user",
            content: userInput
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch AI response');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  };
  
  // Generate a local response based on user input (fallback)
  const generateLocalResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Local response logic (same as before)
    if (input.includes('study tip') || input.includes('how to study') || input.includes('study better')) {
      return "Try the Pomodoro Technique: study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevent burnout while studying.";
    }
    
    if (input.includes('resource') || input.includes('tool') || input.includes('website') || input.includes('app')) {
      return "I recommend checking out Khan Academy for free courses, Anki for flashcards using spaced repetition, or Google Scholar for academic papers. These are great for supplementing your studies.";
    }
    
    if (input.includes('time') || input.includes('schedule') || input.includes('plan')) {
      return "For effective time management, create a weekly schedule with study blocks, breaks, and other activities. Studies show that consistent study sessions of 1-2 hours are more effective than cramming.";
    }
    
    if (input.includes('group') || input.includes('collaborate') || input.includes('team')) {
      return "For effective group studying, set clear goals for each session, assign roles, and make sure everyone participates. You can use the calendar feature to schedule your sessions.";
    }
    
    if (input.includes('exam') || input.includes('test') || input.includes('quiz')) {
      return "When preparing for exams, create a study plan, practice with past exams if available, and form a study group. Research shows that teaching concepts to others is one of the best ways to solidify your understanding.";
    }
    
    return "I'm here to help with your study needs. You can ask me about study techniques, time management, resources, or how to make the most of your study groups.";
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
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Study Assistant</h3>
              {apiKey ? (
                <div className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs ml-2"
                  onClick={handleSaveApiKey}
                >
                  Connect API
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {apiKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleClearApiKey}
                >
                  Reset API
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
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
            ))}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about study tips..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
