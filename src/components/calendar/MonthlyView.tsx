
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth } from 'date-fns';
import { UserEvent } from '@/types/calendar';
import { StudyGroup } from '@/types';
import EventItem from './EventItem';

interface MonthlyViewProps {
  currentDate: Date;
  events: UserEvent[];
  studyGroups: StudyGroup[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: UserEvent, e?: React.MouseEvent) => void;
  onEventDelete: (event: UserEvent, e: React.MouseEvent) => void;
  getEventsForDate: (date: Date) => UserEvent[];
  getScheduledGroups: (date: Date) => StudyGroup[];
}

const MonthlyView: React.FC<MonthlyViewProps> = ({
  currentDate,
  onDayClick,
  onEventClick,
  onEventDelete,
  getEventsForDate,
  getScheduledGroups,
}) => {
  const shortWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const rows = [];
  let days = [];
  let day = startDate;
  
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const scheduledGroups = getScheduledGroups(day);
      const dateEvents = getEventsForDate(day);
      const allItems = [...dateEvents, ...scheduledGroups];
      
      days.push(
        <div
          key={day.toString()}
          className={`min-h-[80px] border p-1 ${
            !isSameMonth(day, monthStart)
              ? 'bg-gray-50 text-gray-400'
              : 'bg-white'
          } ${
            isSameDay(day, new Date()) 
              ? 'border-blue-500 border-2' 
              : 'border-gray-200'
          } hover:bg-blue-50 cursor-pointer`}
          onClick={() => onDayClick(new Date(day))}
        >
          <div className="font-medium text-right">{format(day, 'd')}</div>
          
          <div className="mt-1 space-y-1">
            {dateEvents.length > 0 && 
              dateEvents.map(event => (
                <EventItem 
                  key={event.id}
                  event={event}
                  onClick={(evt, e) => {
                    if (e) e.stopPropagation();
                    onEventClick(evt);
                  }}
                  onDelete={onEventDelete}
                />
              ))
            }
            
            {scheduledGroups.length > 0 && dateEvents.length === 0 && (
              <div 
                className="bg-blue-100 text-blue-800 p-1 rounded text-xs truncate hover:bg-blue-200" 
                title={scheduledGroups[0].name}
                onClick={(e) => {
                  e.stopPropagation();
                  // Show group details
                }}
              >
                {scheduledGroups[0].name}
              </div>
            )}
            
            {allItems.length > 1 && dateEvents.length === 0 && scheduledGroups.length > 0 && (
              <div className="text-xs text-gray-500">+{allItems.length - 1} more</div>
            )}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-1">
        {days}
      </div>
    );
    days = [];
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {format(currentDate, 'MMMM yyyy')}
      </h2>
      
      <div className="grid grid-cols-7 gap-1">
        {shortWeekDays.map(dayName => (
          <div key={dayName} className="text-center font-medium py-2 text-sm">
            {dayName}
          </div>
        ))}
      </div>
      
      <div className="space-y-1">
        {rows}
      </div>
    </div>
  );
};

export default MonthlyView;
