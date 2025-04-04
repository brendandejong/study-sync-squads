
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { StudyGroup } from '@/types';
import { UserEvent } from '@/types/calendar';
import EventDialog from './EventDialog';
import NavigationBar from './NavigationBar';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';
import { useCalendar } from '@/hooks/useCalendar';

interface CalendarViewProps {
  studyGroups: StudyGroup[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ studyGroups }) => {
  const { currentUser } = useAuth();
  
  // Filter study groups to only include those the user is a member of
  const userStudyGroups = currentUser ? studyGroups.filter(group => 
    group.members.some(member => member.id === currentUser.id)
  ) : [];

  const {
    currentDate,
    viewType,
    selectedDate,
    isEventDialogOpen,
    selectedEvent,
    dialogMode,
    getScheduledGroups,
    getEventsForDate,
    handleDayClick,
    handleEventClick,
    handleSaveEvent,
    handleDeleteEvent,
    handleQuickDeleteEvent,
    handlePrevious,
    handleNext,
    handleToday,
    setViewType,
    setIsEventDialogOpen,
  } = useCalendar(userStudyGroups);

  // Render the appropriate view based on viewType
  const renderCalendarView = () => {
    switch (viewType) {
      case 'daily':
        return (
          <DailyView 
            currentDate={currentDate}
            events={getEventsForDate(currentDate)}
            studyGroups={getScheduledGroups(currentDate)}
            onAddEvent={handleDayClick}
            onEventClick={handleEventClick}
            onEventDelete={handleQuickDeleteEvent}
          />
        );
      case 'weekly':
        return (
          <WeeklyView 
            currentDate={currentDate}
            events={[]} // Not used directly in component
            studyGroups={[]} // Not used directly in component
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            onEventDelete={handleQuickDeleteEvent}
            getEventsForDate={getEventsForDate}
            getScheduledGroups={getScheduledGroups}
          />
        );
      case 'monthly':
      default:
        return (
          <MonthlyView 
            currentDate={currentDate}
            events={[]} // Not used directly in component
            studyGroups={[]} // Not used directly in component
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
            onEventDelete={handleQuickDeleteEvent}
            getEventsForDate={getEventsForDate}
            getScheduledGroups={getScheduledGroups}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <NavigationBar
        viewType={viewType}
        onViewTypeChange={setViewType}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />
      
      {renderCalendarView()}
      
      <EventDialog 
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        mode={dialogMode}
      />
    </div>
  );
};

export default CalendarView;
