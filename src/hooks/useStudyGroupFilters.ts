
import { useState } from 'react';
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

  const filteredGroups = studyGroups.filter(group => {
    // First check course filter (applies to all groups)
    if (selectedCourse && group.course.id !== selectedCourse.id) {
      return false;
    }
    
    // Then check tag filters (applies to all groups)
    if (activeFilters.length > 0 && !group.tags.some(tag => activeFilters.includes(tag))) {
      return false;
    }
    
    // In "My Groups" view, only show groups where the user is a member
    if (showMyGroups) {
      return currentUser ? group.members.some(m => m.id === currentUser.id) : false;
    }
    
    // For the "All Groups" view:
    // 1. All public groups should be visible at this point (after course and tag filtering)
    if (group.isPublic) {
      return true;
    }
    
    // 2. For private groups, user must be logged in and have access
    if (!currentUser) {
      return false; // No access to private groups if not logged in
    }
    
    // User can see private groups if they created it, are a member, or were invited
    return group.createdBy === currentUser.id || 
           group.members.some(m => m.id === currentUser.id) ||
           (group.invitedUsers && group.invitedUsers.includes(currentUser.id));
  });

  return {
    showMyGroups,
    setShowMyGroups,
    selectedCourse,
    setSelectedCourse,
    activeFilters,
    setActiveFilters,
    filteredGroups
  };
};
