
import { useState, useEffect } from 'react';
import { StudyGroup } from '@/types';
import Header from '@/components/Header';
import CreateGroupModal from '@/components/CreateGroupModal';
import GroupDetails from '@/components/GroupDetails';
import CalendarView from '@/components/calendar/CalendarView';
import ChatAssistant from '@/components/chat/ChatAssistant';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { messages } from '@/data/mockData';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useStudyGroups } from '@/hooks/useStudyGroups';
import { useStudyGroupFilters } from '@/hooks/useStudyGroupFilters';
import StudyGroupView from '@/components/study-groups/StudyGroupView';

interface IndexProps {
  myGroupsOnly?: boolean;
  calendarView?: boolean;
}

const Index = ({ myGroupsOnly = false, calendarView = false }: IndexProps) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Study group state management
  const { 
    studyGroups, 
    userGroups, 
    createGroup,
    joinGroup,
    leaveGroup
  } = useStudyGroups();
  
  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);
  
  // Filter state management
  const [showMyGroups, setShowMyGroups] = useState<boolean>(myGroupsOnly);
  
  useEffect(() => {
    setShowMyGroups(location.pathname === '/my-groups');
  }, [location.pathname]);
  
  const { 
    selectedCourse,
    setSelectedCourse, 
    activeFilters, 
    setActiveFilters,
    filteredGroups,
    userGroupsCount
  } = useStudyGroupFilters(studyGroups, { showMyGroups });
  
  // Event handlers
  const handleGroupClick = (groupId: string) => {
    const group = studyGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setIsGroupDetailsOpen(true);
    }
  };
  
  // Debug logging
  console.log('Index page rendering: ', {
    totalGroups: studyGroups.length, 
    filteredCount: filteredGroups.length,
    userGroupsCount,
    showMyGroups,
    path: location.pathname
  });

  return (
    <div className="min-h-screen bg-gradient-blue">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 rounded-lg bg-white bg-opacity-70 backdrop-blur-sm shadow-sm">
          <h1 className="text-2xl font-bold text-blue-800">
            {calendarView 
              ? "Calendar View" 
              : (showMyGroups ? "My Study Groups" : "Study Groups")}
          </h1>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 btn-hover-effect">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
        
        {calendarView ? (
          <div className="bg-white rounded-lg shadow-card p-4 card-gradient">
            <CalendarView studyGroups={studyGroups} />
          </div>
        ) : (
          <StudyGroupView
            filteredGroups={filteredGroups}
            userGroupsCount={userGroupsCount}
            showMyGroups={showMyGroups}
            onShowMyGroupsChange={setShowMyGroups}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            onGroupClick={handleGroupClick}
            onCreateClick={() => setIsCreateModalOpen(true)}
            currentUser={currentUser}
          />
        )}
      </main>
      
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGroup={createGroup}
      />
      
      <GroupDetails
        group={selectedGroup}
        messages={messages.filter(m => m.groupId === selectedGroup?.id)}
        isOpen={isGroupDetailsOpen}
        onClose={() => setIsGroupDetailsOpen(false)}
        onJoinGroup={joinGroup}
        onLeaveGroup={leaveGroup}
      />
      
      <ChatAssistant />
    </div>
  );
};

export default Index;
