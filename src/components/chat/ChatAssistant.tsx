
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bot, MessageSquare, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserAvatar from '@/components/UserAvatar';
import { currentUser } from '@/data/mockData';
import { cn } from '@/lib/utils';

// Define types for messages
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    content: 'Hi there! I\'m your Study Assistant. I can help you with study planning, coordination tips, finding resources, and answering questions about your courses. How can I help you today?',
    sender: 'assistant',
    timestamp: new Date(),
  },
];

// Sample study tips that the bot can provide
const STUDY_TIPS = [
  "Try the Pomodoro Technique: study for 25 minutes, then take a 5-minute break.",
  "Create mind maps to visualize connections between concepts.",
  "Teaching others what you've learned helps reinforce your understanding.",
  "Review your notes within 24 hours after class to improve retention.",
  "Use mnemonic devices to remember complex information.",
  "Study in different locations to improve memory recall.",
  "Start with the most difficult material when your mind is fresh.",
  "Take regular breaks - your brain needs time to process information.",
  "Stay hydrated and eat brain-healthy foods like nuts and berries.",
  "Get enough sleep - memory consolidation happens during deep sleep."
];

// Sample study resources the bot can recommend
const STUDY_RESOURCES = [
  "Khan Academy offers free courses on various subjects.",
  "Quizlet is great for flashcards and quick reviews.",
  "Anki uses spaced repetition to help with memorization.",
  "Google Scholar can help you find academic papers.",
  "YouTube has many educational channels like Crash Course.",
  "Notion is great for organizing your study materials.",
  "StudyBlue lets you create and share flashcards.",
  "Coursera offers courses from top universities."
];

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to add a new message from the user
  const handleSendMessage = (e: React.FormEvent) => {
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
    setInput('');
    setIsTyping(true);
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'assistant',
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  // Generate a response based on user input
  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Detect study tips request
    if (input.includes('study tip') || input.includes('how to study') || input.includes('study better')) {
      const randomTip = STUDY_TIPS[Math.floor(Math.random() * STUDY_TIPS.length)];
      return `Here's a study tip: ${randomTip}`;
    }
    
    // Detect resource request
    if (input.includes('resource') || input.includes('tool') || input.includes('website') || input.includes('app')) {
      const randomResource = STUDY_RESOURCES[Math.floor(Math.random() * STUDY_RESOURCES.length)];
      return `I recommend checking out: ${randomResource}`;
    }
    
    // Detect time management
    if (input.includes('time') || input.includes('schedule') || input.includes('plan')) {
      return "For effective time management, try creating a weekly schedule that includes study blocks, breaks, and other activities. Balance is key - make sure to allocate time for relaxation too!";
    }
    
    // Detect group study
    if (input.includes('group') || input.includes('collaborate') || input.includes('team')) {
      return "Group studying can be very effective! When meeting with your study group, set clear goals for each session, assign roles, and make sure everyone participates. You can use the calendar feature to schedule your group sessions.";
    }
    
    // Detect exam questions
    if (input.includes('exam') || input.includes('test') || input.includes('quiz')) {
      return "When preparing for exams, create a study plan, review your notes regularly, practice with past exams if available, and form a study group to discuss challenging concepts. Remember that teaching others is one of the best ways to learn!";
    }
    
    // General response if nothing specific is detected
    return "I'm here to help with your study needs! You can ask me about study techniques, time management, resources, or how to make the most of your study groups.";
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
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
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
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {message.sender === 'user' && (
                  <UserAvatar user={currentUser} size="sm" />
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-1 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="py-2 px-3 rounded-lg bg-muted">
                  <div className="flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>•</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about study tips..."
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || isTyping}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
