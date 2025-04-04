
import React from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isSameMonth } from 'date-fns';
import { UserEvent } from '@/types/calendar';
import { StudyGroup } from '@/types';
import EventItem from './EventItem';

interface WeeklyViewProps {
  currentDate: Date;
  events: UserEvent[];
  studyGroups: StudyGroup[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: UserEvent, e?: React.MouseEvent) => void;
  onEventDelete: (event: UserEvent, e: React.MouseEvent) => void;
  getEventsForDate: (date: Date) => UserEvent[];
  getScheduledGroups: (date: Date) => StudyGroup[];
}

const WeeklyView: React.FC<WeeklyViewProps> = ({
  currentDate,
  onDayClick,
  onEventClick,
  onEventDelete,
  getEventsForDate,
  getScheduledGroups,
}) => {
  const shortWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  const days = [];
  let day = startDate;
  
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
      </h2>
      
      <div className="grid grid-cols-7 gap-1">
        {shortWeekDays.map(dayName => (
          <div key={dayName} className="text-center font-medium py-2 text-sm">
            {dayName}
          </div>
        ))}
        
        {days.map(date => {
          const scheduledGroups = getScheduledGroups(date);
          const dateEvents = getEventsForDate(date);
          const allItems = [...dateEvents, ...scheduledGroups];
          
          return (
            <div 
              key={date.toString()} 
              className={`min-h-[100px] border p-1 text-sm ${
                isSameMonth(date, currentDate) 
                  ? 'bg-white' 
                  : 'bg-gray-50 text-gray-500'
              } ${
                isSameDay(date, new Date()) 
                  ? 'border-blue-500 border-2' 
                  : 'border-gray-200'
              } hover:bg-blue-50 cursor-pointer`}
              onClick={() => onDayClick(date)}
            >
              <div className="font-medium text-right">{format(date, 'd')}</div>
              
              <div className="mt-1">
                {dateEvents.length > 0 && 
                  dateEvents.slice(0, 2).map(event => (
                    <EventItem 
                      key={event.id}
                      event={event}
                      onClick={onEventClick}
                      onDelete={onEventDelete}
                    />
                  ))
                }
                
                {scheduledGroups.length > 0 && (
                  scheduledGroups.slice(0, 2 - Math.min(2, dateEvents.length)).map(group => (
                    <div 
                      key={group.id} 
                      className="bg-blue-100 text-blue-800 p-1 rounded text-xs truncate hover:bg-blue-200"
                      title={group.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Show group details
                      }}
                    >
                      {group.name}
                    </div>
                  ))
                )}
                
                {allItems.length > 2 && (
                  <div className="text-xs text-gray-500">+{allItems.length - 2} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;
