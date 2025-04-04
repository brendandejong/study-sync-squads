
import { useState } from 'react';
import { StudyGroup, StudyTag } from '@/types';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import StudyGroupCard from '@/components/StudyGroupCard';
import { currentUser } from '@/data/mockData';

interface StudyGroupListProps {
  studyGroups: StudyGroup[];
  onGroupClick: (groupId: string) => void;
  onCreateClick: () => void;
  selectedCourse: string | null;
  activeFilters: StudyTag[];
}

const StudyGroupList = ({
  studyGroups,
  onGroupClick,
  onCreateClick,
  selectedCourse,
  activeFilters
}: StudyGroupListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = studyGroups.filter(group => {
    // Filter by course
    if (selectedCourse && group.course.id !== selectedCourse) return false;
    
    // Filter by search term
    if (searchTerm && !group.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !group.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !group.course.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Filter by tags
    if (activeFilters.length > 0 && !activeFilters.some(tag => group.tags.includes(tag))) return false;
    
    return true;
  });

  return (
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
                  onClick={onGroupClick}
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
              <Button onClick={onCreateClick}>
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
                    onClick={onGroupClick}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-1">You haven't joined any study groups yet</h3>
              <p className="text-gray-600 mb-4">
                Join an existing group or create your own to get started.
              </p>
              <Button onClick={onCreateClick}>
                Create Study Group
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyGroupList;
