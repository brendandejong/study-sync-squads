
import { useState } from 'react';
import { Course, StudyGroup, StudyTag } from '@/types';
import Header from '@/components/Header';
import FilterPanel from '@/components/study-groups/FilterPanel';
import StudyGroupList from '@/components/study-groups/StudyGroupList';
import CreateGroupModal from '@/components/CreateGroupModal';
import GroupDetails from '@/components/GroupDetails';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { studyGroups as initialGroups, messages, currentUser } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface IndexProps {
  myGroupsOnly?: boolean;
}

const Index = ({ myGroupsOnly = false }: IndexProps) => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeFilters, setActiveFilters] = useState<StudyTag[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(initialGroups);
  
  const [showMyGroups, setShowMyGroups] = useState<boolean>(myGroupsOnly);
  
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
      id: `group-${studyGroups.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    
    setStudyGroups([...studyGroups, createdGroup]);
    toast({
      title: "Study group created",
      description: `Your group "${createdGroup.name}" has been created successfully.`,
    });
  };
  
  const handleJoinGroup = (groupId: string) => {
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

  const userGroupsCount = studyGroups.filter(
    g => g.members.some(m => m.id === currentUser.id)
  ).length;

  const filteredGroups = studyGroups.filter(group => {
    // Course filter
    if (selectedCourse && group.course.id !== selectedCourse.id) {
      return false;
    }
    
    // Tag filters
    if (activeFilters.length > 0 && !group.tags.some(tag => activeFilters.includes(tag))) {
      return false;
    }
    
    // My groups filter
    if (showMyGroups && !group.members.some(m => m.id === currentUser.id)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Find Your Perfect Study Group</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Study Group
          </Button>
        </div>
        
        <div className="mb-6">
          <Tabs 
            defaultValue={showMyGroups ? "my-groups" : "all-groups"} 
            onValueChange={(value) => setShowMyGroups(value === "my-groups")}
            className="w-full"
          >
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all-groups" className="flex-1 sm:flex-none">All Groups ({studyGroups.length})</TabsTrigger>
              <TabsTrigger value="my-groups" className="flex-1 sm:flex-none">My Groups ({userGroupsCount})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
          <FilterPanel 
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            studyGroupsCount={studyGroups.length}
            userGroupsCount={userGroupsCount}
          />
          
          <StudyGroupList 
            studyGroups={filteredGroups}
            onGroupClick={handleGroupClick}
            onCreateClick={() => setIsCreateModalOpen(true)}
            selectedCourse={selectedCourse?.id || null}
            activeFilters={activeFilters}
          />
        </div>
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
    </div>
  );
};

export default Index;
