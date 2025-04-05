
import { useState, useEffect } from 'react';
import { StudyGroup, StudyTag, Course, User } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface FilterOptions {
  showMyGroups: boolean;
  selectedCourse: Course | null;
  activeFilters: StudyTag[];
}

export const useStudyGroupFilters = (
  studyGroups: StudyGroup[],
  initialOptions: Partial<FilterOptions> = {}
) => {
  const { currentUser } = useAuth();
  const [showMyGroups, setShowMyGroups] = useState<boolean>(initialOptions.showMyGroups || false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(initialOptions.selectedCourse || null);
  const [activeFilters, setActiveFilters] = useState<StudyTag[]>(initialOptions.activeFilters || []);

  // Get user groups - these are groups where the user is a member
  const userGroups = currentUser 
    ? studyGroups.filter(group => 
        group.members.some(member => member.id === currentUser.id)
      )
    : [];
  
  console.log('Current user ID:', currentUser?.id);
  console.log('User is member of these groups:', userGroups.map(g => g.id));
  console.log('Show My Groups flag is set to:', showMyGroups);

  // Determine which groups to display based on filters
  const filteredGroups = showMyGroups 
    ? userGroups // When "My Groups" is selected, ONLY show user's groups
    : studyGroups.filter(group => {
        // For "All Groups" view, apply course and tag filters
        let shouldInclude = true;
        
        // Apply course filter if one is selected
        if (selectedCourse && group.course.id !== selectedCourse.id) {
          shouldInclude = false;
        }
        
        // Apply tag filters if any are selected
        if (shouldInclude && activeFilters.length > 0 && 
            !group.tags.some(tag => activeFilters.includes(tag))) {
          shouldInclude = false;
        }
        
        // For private groups, check visibility rules
        if (shouldInclude && !group.isPublic) {
          // Private groups are only visible if:
          // 1. User created the group
          // 2. User is a member
          // 3. User was invited
          if (!currentUser) {
            shouldInclude = false;
          } else {
            shouldInclude = 
              group.createdBy === currentUser.id || 
              group.members.some(m => m.id === currentUser.id) ||
              (group.invitedUsers && group.invitedUsers.includes(currentUser.id));
          }
        }
        
        return shouldInclude;
      });

  console.log('Filtered groups count:', filteredGroups.length);
  console.log('Filtered groups when showMyGroups =', showMyGroups, ':', filteredGroups.map(g => g.id));
  
  return {
    showMyGroups,
    setShowMyGroups,
    selectedCourse,
    setSelectedCourse,
    activeFilters,
    setActiveFilters,
    filteredGroups,
    userGroupsCount: userGroups.length
  };
};
