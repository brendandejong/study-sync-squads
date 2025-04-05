
import { StudyGroup, StudyTag, User } from '@/types';
import StudyGroupCard from '@/components/StudyGroupCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface StudyGroupListProps {
  studyGroups: StudyGroup[];
  onGroupClick: (groupId: string) => void;
  onCreateClick: () => void;
  selectedCourse: string | null;
  activeFilters: StudyTag[];
  currentUser?: User | null;
}

const StudyGroupList = ({
  studyGroups,
  onGroupClick,
  onCreateClick,
  selectedCourse,
  activeFilters,
  currentUser
}: StudyGroupListProps) => {
  const { currentUser: authUser } = useAuth();
  
  // Use provided currentUser or fallback to authUser
  const user = currentUser || authUser;
  
  return (
    <div>
      {studyGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {studyGroups.map((group) => (
            <StudyGroupCard 
              key={group.id} 
              group={group} 
              onClick={onGroupClick}
              isOwner={user?.id === group.createdBy}
              currentUser={user}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <h3 className="font-medium text-lg text-gray-700 mb-2">No study groups found</h3>
          <p className="text-gray-500 mb-6">
            {selectedCourse || activeFilters.length > 0
              ? "Try adjusting your filters to see more groups."
              : "There are no study groups available at the moment."}
          </p>
          <Button onClick={onCreateClick} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Create a new group
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudyGroupList;
