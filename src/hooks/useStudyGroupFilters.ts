
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
    // First check course and tag filters as they apply to all groups
    if (selectedCourse && group.course.id !== selectedCourse.id) {
      return false;
    }
    
    if (activeFilters.length > 0 && !group.tags.some(tag => activeFilters.includes(tag))) {
      return false;
    }
    
    // PUBLIC GROUPS ARE ALWAYS VISIBLE except in "My Groups" view
    if (group.isPublic) {
      // In "My Groups" view, only show public groups where user is a member
      if (showMyGroups) {
        return currentUser ? group.members.some(m => m.id === currentUser.id) : false;
      }
      
      // For non-My Groups view, all public groups that pass filters are visible
      return true;
    }
    
    // For private groups
    // User must be logged in to see any private group
    if (!currentUser) {
      return false;
    }
    
    // Check if user has access to this private group
    const hasAccess = group.createdBy === currentUser.id || 
                      group.members.some(m => m.id === currentUser.id) ||
                      (group.invitedUsers && group.invitedUsers.includes(currentUser.id));
                     
    if (!hasAccess) {
      return false;
    }
    
    // For "My Groups" view, only show private groups where user is a member
    if (showMyGroups) {
      return group.members.some(m => m.id === currentUser.id);
    }
    
    // If we get here, this is a private group the user has access to
    return true;
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
