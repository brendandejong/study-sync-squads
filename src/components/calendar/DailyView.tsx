
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { UserEvent } from '@/types/calendar';
import { StudyGroup } from '@/types';
import { formatTime } from '@/utils/helpers';
import { Trash2 } from 'lucide-react';

interface DailyViewProps {
  currentDate: Date;
  events: UserEvent[];
  studyGroups: StudyGroup[];
  onAddEvent: (date: Date) => void;
  onEventClick: (event: UserEvent) => void;
  onEventDelete: (event: UserEvent, e: React.MouseEvent) => void;
}

const DailyView: React.FC<DailyViewProps> = ({
  currentDate,
  events,
  studyGroups,
  onAddEvent,
  onEventClick,
  onEventDelete,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {format(currentDate, 'EEEE, MMMM d, yyyy')}
      </h2>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddEvent(currentDate)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Event
        </Button>
      </div>
      
      <div className="space-y-3">
        {events.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Your Events</h3>
            {events.map(event => (
              <Card 
                key={event.id} 
                className="p-3 hover:shadow-md transition-shadow cursor-pointer mb-2 group relative"
                onClick={() => onEventClick(event)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm">{event.description}</p>
                  </div>
                  <div className="text-right flex items-center">
                    <p className="text-sm font-medium">
                      {event.startTime} - {event.endTime}
                    </p>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 ml-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation
                        onEventDelete(event, e);
                      }}
                      title="Delete event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {studyGroups.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Study Groups</h3>
            {studyGroups.map(group => (
              <Card key={group.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">{group.course.code} - {group.course.name}</p>
                    <p className="text-sm">{group.location}</p>
                  </div>
                  <div className="text-right">
                    {group.timeSlots
                      .filter(slot => getDayNumber(slot.day) === currentDate.getDay())
                      .map((slot, idx) => (
                        <p key={idx} className="text-sm font-medium">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </p>
                      ))
                    }
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {studyGroups.length === 0 && events.length === 0 && (
          <div className="py-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No events</h3>
            <p className="mt-1 text-sm text-gray-500">
              No events scheduled for this day.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddEvent(currentDate)}
              className="mt-4 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to convert day string to number (0-6)
const getDayNumber = (day: string): number => {
  const lowerDay = day.toLowerCase();
  const dayMap: Record<string, number> = {
    'sunday': 0, 'sun': 0,
    'monday': 1, 'mon': 1,
    'tuesday': 2, 'tue': 2,
    'wednesday': 3, 'wed': 3,
    'thursday': 4, 'thu': 4,
    'friday': 5, 'fri': 5,
    'saturday': 6, 'sat': 6
  };
  return dayMap[lowerDay] ?? 0;
};

export default DailyView;
