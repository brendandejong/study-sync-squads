
import { useState } from 'react';
import { StudyGroup, StudyTag } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, PlusCircle, Search } from 'lucide-react';
import StudyGroupCard from '@/components/StudyGroupCard';
import { useAuth } from '@/context/AuthContext';

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
  const { currentUser } = useAuth();

  const filteredGroups = studyGroups.filter(group => {
    if (searchTerm && !group.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !group.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !group.course.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search groups..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGroups.map((group) => (
            <StudyGroupCard
              key={group.id}
              group={group}
              onClick={onGroupClick}
              isOwner={currentUser?.id === group.createdBy}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-3">
            {searchTerm ? (
              <Search className="h-12 w-12 mx-auto" />
            ) : (
              <Filter className="h-12 w-12 mx-auto" />
            )}
          </div>
          <h3 className="text-lg font-medium mb-1">No study groups found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? "Try using different search terms"
              : "Try adjusting your filters or create a new study group"}
          </p>
          <Button onClick={onCreateClick}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Study Group
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudyGroupList;
