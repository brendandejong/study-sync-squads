
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, WifiOff, X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  isUsingLocalResponses?: boolean;
}

const ChatHeader = ({ onClose, isUsingLocalResponses = false }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Study Assistant</h3>
        {isUsingLocalResponses ? (
          <div className="flex items-center text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
            <WifiOff className="h-3 w-3 mr-1" />
            Offline Mode
          </div>
        ) : (
          <div className="flex items-center text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
