
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

  // Log the filter state for debugging
  console.log('Filter state:', { 
    showMyGroups, 
    selectedCourse: selectedCourse?.code, 
    activeFilters,
    totalGroups: studyGroups.length,
    currentUserId: currentUser?.id
  });

  // First, get user groups
  const userGroups = currentUser 
    ? studyGroups.filter(group => 
        group.members.some(member => member.id === currentUser.id)
      )
    : [];
  
  console.log('User is member of these groups:', userGroups.map(g => g.id));

  const filteredGroups = studyGroups.filter(group => {
    // For "My Groups", ONLY show groups where the user is a member
    if (showMyGroups) {
      return currentUser ? 
        group.members.some(member => member.id === currentUser.id) : 
        false;
    }
    
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

  // Log the filtered results for debugging
  console.log('Filtered groups count:', filteredGroups.length);
  if (showMyGroups) {
    console.log('My Groups IDs:', filteredGroups.map(g => g.id));
  }

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
