
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
    // PUBLIC GROUPS ARE ALWAYS VISIBLE TO ALL USERS - APPLY THIS CHECK FIRST
    if (group.isPublic) {
      // For public groups, only apply course and tag filters, but ignore "My Groups" filter
      if (selectedCourse && group.course.id !== selectedCourse.id) {
        return false;
      }
      
      if (activeFilters.length > 0 && !group.tags.some(tag => activeFilters.includes(tag))) {
        return false;
      }
      
      // Public groups will be visible even in "My Groups" view if other filters match
      if (showMyGroups) {
        return group.members.some(m => m.id === (currentUser?.id ?? ''));
      }
      
      return true;
    }
    
    // For private groups, check visibility
    // 1. User must be logged in
    if (!currentUser) {
      return false;
    }
    
    // 2. User must have access (created, member, or invited)
    const hasAccess = group.createdBy === currentUser.id || 
                     group.members.some(m => m.id === currentUser.id) ||
                     (group.invitedUsers && group.invitedUsers.includes(currentUser.id));
                     
    if (!hasAccess) {
      return false;
    }
    
    // 3. Apply the remaining filters
    if (showMyGroups && !group.members.some(m => m.id === currentUser.id)) {
      return false;
    }
    
    if (selectedCourse && group.course.id !== selectedCourse.id) {
      return false;
    }
    
    if (activeFilters.length > 0 && !group.tags.some(tag => activeFilters.includes(tag))) {
      return false;
    }
    
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
