
import React, { useState, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, addWeeks, subWeeks, addMonths, subMonths, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudyGroup, TimeSlot } from '@/types';
import { UserEvent } from '@/types/calendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { formatTime } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import EventDialog from './EventDialog';

interface CalendarViewProps {
  studyGroups: StudyGroup[];
}

type ViewType = 'daily' | 'weekly' | 'monthly';

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarView: React.FC<CalendarViewProps> = ({ studyGroups }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  // Filter study groups to only include those the user is a member of
  const userStudyGroups = currentUser ? studyGroups.filter(group => 
    group.members.some(member => member.id === currentUser.id)
  ) : [];

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

  // Helper to check if a study group is scheduled for a given date
  const getScheduledGroups = (date: Date): StudyGroup[] => {
    return userStudyGroups.filter(group => {
      return group.timeSlots.some(slot => {
        const dayNumber = getDayNumber(slot.day);
        return date.getDay() === dayNumber;
      });
    });
  };

  // Helper to get user events for a specific date
  const getEventsForDate = (date: Date): UserEvent[] => {
    return userEvents.filter(event => 
      isSameDay(event.date, date)
    );
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsEventDialogOpen(true);
  };

  // Handle event creation
  const handleSaveEvent = (eventData: Omit<UserEvent, "id">) => {
    const newEvent: UserEvent = {
      ...eventData,
      id: `event-${Date.now()}`
    };
    
    setUserEvents([...userEvents, newEvent]);
    
    toast({
      title: "Event created",
      description: `Your event "${newEvent.title}" has been added to your calendar.`,
    });
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (viewType === 'daily') {
      setCurrentDate(prev => addDays(prev, -1));
    } else if (viewType === 'weekly') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewType === 'daily') {
      setCurrentDate(prev => addDays(prev, 1));
    } else if (viewType === 'weekly') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Render event items
  const renderEventItems = (events: UserEvent[]) => {
    return events.map(event => (
      <div 
        key={event.id} 
        className="bg-indigo-100 text-indigo-800 p-1 mb-1 rounded text-xs truncate hover:bg-indigo-200 cursor-pointer"
        title={`${event.title} (${event.startTime}-${event.endTime})`}
        onClick={(e) => {
          e.stopPropagation();
          // Display event details in a dialog or similar
          toast({
            title: event.title,
            description: `${format(event.date, 'PPP')} | ${event.startTime}-${event.endTime}${event.description ? `\n${event.description}` : ''}`,
          });
        }}
      >
        {event.title}
      </div>
    ));
  };

  // Render daily view
  const renderDailyView = () => {
    const scheduledGroups = getScheduledGroups(currentDate);
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDayClick(currentDate)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        </div>
        
        <div className="space-y-3">
          {dayEvents.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Your Events</h3>
              {dayEvents.map(event => (
                <Card key={event.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm">{event.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {scheduledGroups.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Study Groups</h3>
              {scheduledGroups.map(group => (
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
          
          {scheduledGroups.length === 0 && dayEvents.length === 0 && (
            <div className="py-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No events</h3>
              <p className="mt-1 text-sm text-gray-500">
                No events scheduled for this day.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDayClick(currentDate)}
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

  // Render weekly view
  const renderWeeklyView = () => {
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
                onClick={() => handleDayClick(date)}
              >
                <div className="font-medium text-right">{format(date, 'd')}</div>
                
                <div className="mt-1">
                  {dateEvents.length > 0 && renderEventItems(dateEvents.slice(0, 2))}
                  
                  {scheduledGroups.length > 0 && (
                    scheduledGroups.slice(0, 2 - Math.min(2, dateEvents.length)).map(group => (
                      <div 
                        key={group.id} 
                        className="bg-blue-100 text-blue-800 p-1 mb-1 rounded text-xs truncate hover:bg-blue-200"
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

  // Render monthly view
  const renderMonthlyView = () => {
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
            onClick={() => handleDayClick(day)}
          >
            <div className="font-medium text-right">{format(day, 'd')}</div>
            
            <div className="mt-1 space-y-1">
              {dateEvents.length > 0 && renderEventItems(dateEvents.slice(0, 1))}
              
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
              
              {allItems.length > 1 && (
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

  // Render the appropriate view based on viewType
  const renderCalendarView = () => {
    switch (viewType) {
      case 'daily':
        return renderDailyView();
      case 'weekly':
        return renderWeeklyView();
      case 'monthly':
        return renderMonthlyView();
      default:
        return renderMonthlyView();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs value={viewType} onValueChange={(v) => setViewType(v as ViewType)}>
          <TabsList>
            <TabsTrigger value="daily">Day</TabsTrigger>
            <TabsTrigger value="weekly">Week</TabsTrigger>
            <TabsTrigger value="monthly">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {renderCalendarView()}
      
      <EventDialog 
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
      />
    </div>
  );
};

export default CalendarView;
