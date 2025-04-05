
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

  // Return different groups based on showMyGroups value
  const filteredGroups = showMyGroups 
    ? userGroups // When "My Groups" is selected, ONLY show user's groups
    : studyGroups.filter(group => {
        // For "All Groups" view, apply course and tag filters
        
        // First check course filter
        if (selectedCourse && group.course.id !== selectedCourse.id) {
          return false;
        }
        
        // Then check tag filters
        if (activeFilters.length > 0 && !group.tags.some(tag => activeFilters.includes(tag))) {
          return false;
        }
        
        // For public groups, they should be visible to everyone
        if (group.isPublic) {
          return true;
        }
        
        // For private groups, user must be logged in and have access
        if (!currentUser) {
          return false; // No access to private groups if not logged in
        }
        
        // User can see private groups if they created it, are a member, or were invited
        return group.createdBy === currentUser.id || 
               group.members.some(m => m.id === currentUser.id) ||
               (group.invitedUsers && group.invitedUsers.includes(currentUser.id));
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
