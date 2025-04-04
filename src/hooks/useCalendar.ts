
import { useState, useCallback } from 'react';
import { addDays, startOfWeek, endOfWeek, addWeeks, subWeeks, addMonths, subMonths, isSameDay } from 'date-fns';
import { StudyGroup } from '@/types';
import { UserEvent } from '@/types/calendar';
import { useToast } from '@/hooks/use-toast';

type ViewType = 'daily' | 'weekly' | 'monthly';

export function useCalendar(studyGroups: StudyGroup[]) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "view" | "edit">("create");
  const { toast } = useToast();

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
  const getScheduledGroups = useCallback((date: Date): StudyGroup[] => {
    return studyGroups.filter(group => {
      return group.timeSlots.some(slot => {
        const dayNumber = getDayNumber(slot.day);
        return date.getDay() === dayNumber;
      });
    });
  }, [studyGroups]);

  // Helper to get user events for a specific date
  const getEventsForDate = useCallback((date: Date): UserEvent[] => {
    return userEvents.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  }, [userEvents]);

  // Handle day click for creating a new event
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setDialogMode("create");
    setIsEventDialogOpen(true);
  };

  // Handle event click for viewing event details
  const handleEventClick = (event: UserEvent, e?: React.MouseEvent) => {
    console.log('Event clicked:', event);
    
    // Prevent click event from propagating if needed
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Set the selected event and date
    setSelectedEvent(event);
    setSelectedDate(new Date(event.date));
    
    // Set dialog mode to view and open the dialog
    setDialogMode("view");
    setIsEventDialogOpen(true);
  };

  // Handle edit mode
  const handleEditEvent = () => {
    setDialogMode("edit");
  };

  // Handle event creation or update
  const handleSaveEvent = (eventData: Omit<UserEvent, "id">) => {
    if (selectedEvent) {
      // Update existing event
      const updatedEvents = userEvents.map(e => 
        e.id === selectedEvent.id 
          ? { ...eventData, id: selectedEvent.id } 
          : e
      );
      
      setUserEvents(updatedEvents);
      
      toast({
        title: "Event updated",
        description: `Your event "${eventData.title}" has been updated.`,
      });
    } else {
      // Create new event
      const newEvent: UserEvent = {
        ...eventData,
        id: `event-${Date.now()}`
      };
      
      setUserEvents([...userEvents, newEvent]);
      
      toast({
        title: "Event created",
        description: `Your event "${newEvent.title}" has been added to your calendar.`,
      });
    }
  };

  // Handle event deletion
  const handleDeleteEvent = (eventId: string) => {
    const eventToDelete = userEvents.find(e => e.id === eventId);
    if (!eventToDelete) return;
    
    const updatedEvents = userEvents.filter(e => e.id !== eventId);
    setUserEvents(updatedEvents);
    
    toast({
      title: "Event deleted",
      description: `Your event "${eventToDelete.title}" has been removed.`,
    });
  };

  // Handle quick delete event
  const handleQuickDeleteEvent = (event: UserEvent, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // This is critical to prevent the event click handler from firing
    handleDeleteEvent(event.id);
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

  return {
    currentDate,
    viewType,
    userEvents,
    setUserEvents, // Export this for use by the chat component
    selectedDate,
    isEventDialogOpen,
    selectedEvent,
    dialogMode,
    getDayNumber,
    getScheduledGroups,
    getEventsForDate,
    handleDayClick,
    handleEventClick,
    handleEditEvent,
    handleSaveEvent,
    handleDeleteEvent,
    handleQuickDeleteEvent,
    handlePrevious,
    handleNext,
    handleToday,
    setViewType,
    setIsEventDialogOpen,
  };
}
