
import { useState, useEffect } from 'react';
import { Course, StudyGroup, StudyTag } from '@/types';
import Header from '@/components/Header';
import CourseSelector from '@/components/CourseSelector';
import StudyGroupCard from '@/components/StudyGroupCard';
import CreateGroupModal from '@/components/CreateGroupModal';
import GroupDetails from '@/components/GroupDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Filter, Plus, Search } from 'lucide-react';
import { courses, studyGroups as initialGroups, messages, currentUser } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<StudyTag[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(initialGroups);
  
  const filteredGroups = studyGroups.filter(group => {
    // Filter by course
    if (selectedCourse && group.course.id !== selectedCourse.id) return false;
    
    // Filter by search term
    if (searchTerm && !group.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !group.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !group.course.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Filter by tags
    if (activeFilters.length > 0 && !activeFilters.some(tag => group.tags.includes(tag))) return false;
    
    return true;
  });
  
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
  
  const toggleFilter = (tag: StudyTag) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter(t => t !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };
  
  const availableTags: { value: StudyTag; label: string }[] = [
    { value: 'quiet', label: 'Quiet Session' },
    { value: 'flashcards', label: 'Flashcards' },
    { value: 'exam', label: 'Exam Cram' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'practice', label: 'Practice' },
  ];

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
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h2 className="font-semibold mb-4">Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <CourseSelector
                    selectedCourse={selectedCourse}
                    onSelectCourse={setSelectedCourse}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag.value}
                        variant={activeFilters.includes(tag.value) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          activeFilters.includes(tag.value) ? "" : "hover:bg-gray-100"
                        }`}
                        onClick={() => toggleFilter(tag.value)}
                      >
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {(selectedCourse || activeFilters.length > 0) && (
                  <Button
                    variant="ghost"
                    className="w-full text-sm"
                    onClick={() => {
                      setSelectedCourse(null);
                      setActiveFilters([]);
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h2 className="font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Groups</span>
                  <span className="font-medium">{studyGroups.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Groups</span>
                  <span className="font-medium">
                    {studyGroups.filter(g => g.members.some(m => m.id === currentUser.id)).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Courses</span>
                  <span className="font-medium">{courses.length}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name, description or course..."
                  className="w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Groups</TabsTrigger>
                <TabsTrigger value="my">My Groups</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                {filteredGroups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGroups.map((group) => (
                      <StudyGroupCard
                        key={group.id}
                        group={group}
                        onClick={handleGroupClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div className="text-gray-400 mb-3">
                      <Filter className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No study groups found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or create a new study group.
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      Create Study Group
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="my" className="mt-4">
                {filteredGroups.filter(g => g.members.some(m => m.id === currentUser.id)).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGroups
                      .filter(g => g.members.some(m => m.id === currentUser.id))
                      .map((group) => (
                        <StudyGroupCard
                          key={group.id}
                          group={group}
                          onClick={handleGroupClick}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium mb-1">You haven't joined any study groups yet</h3>
                    <p className="text-gray-600 mb-4">
                      Join an existing group or create your own to get started.
                    </p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                      Create Study Group
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
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
