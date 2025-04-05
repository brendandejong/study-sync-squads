
import { useState, useEffect } from 'react';
import { Course, StudyGroup, StudyTag } from '@/types';
import Header from '@/components/Header';
import FilterPanel from '@/components/study-groups/FilterPanel';
import StudyGroupList from '@/components/study-groups/StudyGroupList';
import CreateGroupModal from '@/components/CreateGroupModal';
import GroupDetails from '@/components/GroupDetails';
import CalendarView from '@/components/calendar/CalendarView';
import ChatAssistant from '@/components/chat/ChatAssistant';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { studyGroups as initialGroups, messages } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface IndexProps {
  myGroupsOnly?: boolean;
  calendarView?: boolean;
}

const Index = ({ myGroupsOnly = false, calendarView = false }: IndexProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeFilters, setActiveFilters] = useState<StudyTag[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  
  const [showMyGroups, setShowMyGroups] = useState<boolean>(myGroupsOnly);
  
  const location = useLocation();
  
  // Initialize with some groups that have isPublic set
  useEffect(() => {
    // Transform the initial groups to ensure they have the isPublic property
    const transformedGroups = initialGroups.map(group => ({
      ...group,
      isPublic: true, // Make all existing groups public by default
    }));
    
    // Check if there are stored groups in localStorage
    const storedGroups = localStorage.getItem('studyGroups');
    if (storedGroups) {
      try {
        const parsedGroups = JSON.parse(storedGroups);
        setStudyGroups(parsedGroups);
      } catch (error) {
        console.error('Error parsing stored groups:', error);
        setStudyGroups(transformedGroups);
      }
    } else {
      setStudyGroups(transformedGroups);
    }
  }, []);
  
  // Save groups to localStorage whenever they change
  useEffect(() => {
    if (studyGroups.length > 0) {
      localStorage.setItem('studyGroups', JSON.stringify(studyGroups));
    }
  }, [studyGroups]);
  
  useEffect(() => {
    setShowMyGroups(location.pathname === '/my-groups');
  }, [location.pathname]);
  
  const userGroups = studyGroups.filter(
    g => g.members.some(m => m.id === (currentUser?.id ?? ''))
  );
  
  const handleGroupClick = (groupId: string) => {
    const group = studyGroups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setIsGroupDetailsOpen(true);
    }
  };
  
  const handleCreateGroup = (newGroup: Omit<StudyGroup, 'id' | 'createdAt'>) => {
    const createdGroup: StudyGroup = {
      ...newGroup,
      id: `group-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    setStudyGroups([...studyGroups, createdGroup]);
    toast({
      title: "Study group created",
      description: `Your group "${createdGroup.name}" has been created successfully.`,
    });
  };
  
  const handleJoinGroup = (groupId: string) => {
    if (!currentUser) return;
    
    setStudyGroups(
      studyGroups.map(group => {
        if (group.id === groupId && !group.members.some(m => m.id === currentUser.id)) {
          return {
            ...group,
            members: [...group.members, currentUser],
          };
        }
        return group;
      })
    );
    
    toast({
      title: "Joined study group",
      description: "You have successfully joined the study group.",
    });
  };
  
  const handleLeaveGroup = (groupId: string) => {
    if (!currentUser) return;
    
    setStudyGroups(
      studyGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.filter(m => m.id !== currentUser.id),
          };
        }
        return group;
      })
    );
    
    toast({
      title: "Left study group",
      description: "You have left the study group.",
    });
  };

  const userGroupsCount = userGroups.length;

  const filteredGroups = studyGroups.filter(group => {
    // Current user's created groups always visible
    if (currentUser && group.createdBy === currentUser.id) {
      return true;
    }
    
    // Filter by privacy settings
    if (!group.isPublic) {
      // For private groups, check if the current user is invited
      const isInvited = currentUser && group.invitedUsers?.includes(currentUser.id);
      // For private groups, only show if the user is a member or invited
      if (!isInvited && !group.members.some(m => m.id === (currentUser?.id ?? ''))) {
        return false;
      }
    }
    
    // Apply course filter
    if (selectedCourse && group.course.id !== selectedCourse.id) {
      return false;
    }
    
    // Apply tag filters
    if (activeFilters.length > 0 && !group.tags.some(tag => activeFilters.includes(tag))) {
      return false;
    }
    
    // Filter for My Groups tab
    if (showMyGroups && !group.members.some(m => m.id === (currentUser?.id ?? ''))) {
      return false;
    }
    
    return true;
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
          <>
            <div className="mb-6">
              <Tabs 
                value={showMyGroups ? "my-groups" : "all-groups"} 
                onValueChange={(value) => setShowMyGroups(value === "my-groups")}
                className="w-full"
              >
                <TabsList className="grid w-full md:w-80 grid-cols-2 bg-blue-50">
                  <TabsTrigger value="all-groups" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">All Groups</TabsTrigger>
                  <TabsTrigger value="my-groups" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">My Groups ({userGroupsCount})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div>
                <FilterPanel 
                  selectedCourse={selectedCourse}
                  setSelectedCourse={setSelectedCourse}
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  studyGroupsCount={filteredGroups.length}
                  userGroupsCount={userGroupsCount}
                />
              </div>
              
              <div className="lg:col-span-3">
                <StudyGroupList 
                  studyGroups={filteredGroups}
                  onGroupClick={handleGroupClick}
                  onCreateClick={() => setIsCreateModalOpen(true)}
                  selectedCourse={selectedCourse?.id || null}
                  activeFilters={activeFilters}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </>
        )}
      </main>
      
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
      
      <GroupDetails
        group={selectedGroup}
        messages={messages.filter(m => m.groupId === selectedGroup?.id)}
        isOpen={isGroupDetailsOpen}
        onClose={() => setIsGroupDetailsOpen(false)}
        onJoinGroup={handleJoinGroup}
        onLeaveGroup={handleLeaveGroup}
      />
      
      <ChatAssistant />
    </div>
  );
};

export default Index;
