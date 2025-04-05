
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
    // First check for My Groups tab filter
    if (showMyGroups && !group.members.some(m => m.id === (currentUser?.id ?? ''))) {
      return false;
    }

    // Apply course filter
    if (selectedCourse && group.course.id !== selectedCourse.id) {
      return false;
    }
    
    // Apply tag filters
    if (activeFilters.length > 0 && !group.tags.some(tag => activeFilters.includes(tag))) {
      return false;
    }
    
    // PUBLIC GROUPS ARE ALWAYS VISIBLE TO ALL USERS - NO EXCEPTIONS
    if (group.isPublic) {
      return true;
    }
    
    // For private groups, only show if:
    // 1. User created the group
    // 2. User is a member of the group
    // 3. User is invited to the group
    if (!group.isPublic) {
      if (currentUser) {
        return (
          group.createdBy === currentUser.id || 
          group.members.some(m => m.id === currentUser.id) ||
          (group.invitedUsers && group.invitedUsers.includes(currentUser.id))
        );
      }
      return false; // Not logged in users can't see private groups
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
