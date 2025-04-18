
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
  isLocalResponse?: boolean;
}

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    content: 'Hi there! I\'m your Study Assistant. I can help you with study planning, coordination tips, finding resources, and answering questions about your courses. How can I help you today?',
    sender: 'assistant',
    timestamp: new Date(),
  },
];

export interface GeminiAPIResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}
