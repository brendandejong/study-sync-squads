
import React from 'react';
import { StudyGroup, StudyTag, User, Course } from '@/types';
import StudyGroupCard from '@/components/StudyGroupCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';

interface StudyGroupListProps {
  studyGroups: StudyGroup[];
  onGroupClick: (groupId: string) => void;
  onCreateClick: () => void;
  selectedCourse: string | null;
  activeFilters: StudyTag[];
  currentUser?: User | null;
  showMyGroups?: boolean;
}

const StudyGroupList: React.FC<StudyGroupListProps> = ({
  studyGroups,
  onGroupClick,
  onCreateClick,
  selectedCourse,
  activeFilters,
  currentUser,
  showMyGroups = false
}) => {
  const { currentUser: authUser } = useAuth();
  const location = useLocation();
  
  // Use provided currentUser or fallback to authUser
  const user = currentUser || authUser;
  const isMyGroupsTab = showMyGroups || location.pathname === '/my-groups';
  
  // Detailed console logs for debugging
  console.log('StudyGroupList - Groups to display:', studyGroups.map(g => g.id));
  console.log('StudyGroupList - Current location:', location.pathname);
  console.log('StudyGroupList - Is My Groups tab:', isMyGroupsTab);
  console.log('StudyGroupList - Groups count:', studyGroups.length);
  
  const emptyStateMessage = () => {
    // If we're on the My Groups tab
    if (isMyGroupsTab) {
      return "You haven't joined any study groups yet. Join some groups or create your own!";
    }
    
    // If filters are applied
    if (selectedCourse || activeFilters.length > 0) {
      return "No groups match your current filters. Try adjusting your filters to see more groups.";
    }
    
    // Default message
    return "There are no study groups available at the moment.";
  };
  
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
            {emptyStateMessage()}
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
