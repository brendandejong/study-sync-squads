
import React from 'react';
import { Trash2 } from 'lucide-react';
import { UserEvent } from '@/types/calendar';

interface EventItemProps {
  event: UserEvent;
  onClick: (event: UserEvent, e?: React.MouseEvent) => void;
  onDelete: (event: UserEvent, e: React.MouseEvent) => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onClick, onDelete }) => {
  return (
    <div 
      key={event.id} 
      className="bg-indigo-100 text-indigo-800 p-1 mb-1 rounded text-xs truncate hover:bg-indigo-200 cursor-pointer group relative"
      title={`${event.title} (${event.startTime}-${event.endTime})`}
      onClick={(e) => onClick(event, e)}
    >
      <div className="flex justify-between items-center">
        <span className="truncate">{event.title}</span>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-1"
          onClick={(e) => onDelete(event, e)}
          title="Delete event"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default EventItem;
