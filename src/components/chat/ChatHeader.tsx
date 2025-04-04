
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onSaveApiKey: () => void;
  onClearApiKey: () => void;
  apiKey: string | null;
}

const ChatHeader = ({ onClose, onSaveApiKey, onClearApiKey, apiKey }: ChatHeaderProps) => {
  return (
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
            onClick={onSaveApiKey}
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
            onClick={onClearApiKey}
          >
            Reset API
          </Button>
        )}
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
