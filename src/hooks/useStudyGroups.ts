
import { useState, useEffect } from 'react';
import { StudyGroup, StudyTag, Course, User } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { studyGroups as initialGroups } from '@/data/mockData';

// Key for the shared study groups in localStorage
const SHARED_STUDY_GROUPS_KEY = 'sharedStudyGroups';

export const useStudyGroups = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);

  // Initialize with study groups from localStorage or default ones
  useEffect(() => {
    // Log the initial groups from mockData to debug
    console.log('Initial groups from mockData:', initialGroups);
    
    // Clear localStorage for testing to ensure we load the default groups
    // This is temporary and should be removed in production
    localStorage.removeItem(SHARED_STUDY_GROUPS_KEY);
    
    // Check if there are stored groups in localStorage
    const storedGroups = localStorage.getItem(SHARED_STUDY_GROUPS_KEY);
    if (storedGroups) {
      try {
        const parsedGroups = JSON.parse(storedGroups);
        console.log('Loaded groups from localStorage:', parsedGroups);
        setStudyGroups(parsedGroups);
      } catch (error) {
        console.error('Error parsing stored groups:', error);
        console.log('Falling back to initial groups');
        setStudyGroups(initialGroups);
        // Initialize with initial groups if there's an error
        localStorage.setItem(SHARED_STUDY_GROUPS_KEY, JSON.stringify(initialGroups));
      }
    } else {
      console.log('No stored groups found, using initial groups');
      setStudyGroups(initialGroups);
      // Initialize with initial groups if there's nothing stored
      localStorage.setItem(SHARED_STUDY_GROUPS_KEY, JSON.stringify(initialGroups));
    }
  }, []);
  
  // Save groups to localStorage whenever they change
  useEffect(() => {
    if (studyGroups.length > 0) {
      localStorage.setItem(SHARED_STUDY_GROUPS_KEY, JSON.stringify(studyGroups));
    }
  }, [studyGroups]);

  // Function to handle the periodic refresh of study groups
  useEffect(() => {
    const checkForUpdates = () => {
      const storedGroups = localStorage.getItem(SHARED_STUDY_GROUPS_KEY);
      if (storedGroups) {
        try {
          const parsedGroups = JSON.parse(storedGroups);
          
          // Only update if the stringified versions are different
          // This prevents unnecessary re-renders
          if (JSON.stringify(parsedGroups) !== JSON.stringify(studyGroups)) {
            setStudyGroups(parsedGroups);
          }
        } catch (error) {
          console.error('Error checking for study group updates:', error);
        }
      }
    };
    
    // Check for updates every 5 seconds
    const intervalId = setInterval(checkForUpdates, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [studyGroups]);

  // Get user groups
  const userGroups = studyGroups.filter(
    g => g.members.some(m => m.id === (currentUser?.id ?? ''))
  );

  // Create a new study group
  const createGroup = (newGroup: Omit<StudyGroup, 'id' | 'createdAt'>) => {
    const createdGroup: StudyGroup = {
      ...newGroup,
      id: `group-${Date.now()}-${currentUser?.id ?? 'anonymous'}`,
      createdAt: new Date().toISOString(),
    };
    
    setStudyGroups(prevGroups => [...prevGroups, createdGroup]);
    toast({
      title: "Study group created",
      description: `Your group "${createdGroup.name}" has been created successfully.`,
    });

    return createdGroup;
  };
  
  // Join a study group - Fixed to only join the specific group
  const joinGroup = (groupId: string) => {
    if (!currentUser) return;
    
    console.log(`Attempting to join group: ${groupId}`);
    
    setStudyGroups(prevGroups => 
      prevGroups.map(group => {
        // Only modify the specific group requested to join
        if (group.id === groupId && !group.members.some(m => m.id === currentUser.id)) {
          console.log(`Joining group: ${group.name} (${group.id})`);
          return {
            ...group,
            members: [...group.members, currentUser],
          };
        }
        return group;
      })
    );
    
    toast({
      title: "Joined study group",
      description: "You have successfully joined the study group.",
    });
  };
  
  // Leave a study group
  const leaveGroup = (groupId: string) => {
    if (!currentUser) return;
    
    console.log(`Attempting to leave group: ${groupId}`);
    
    setStudyGroups(prevGroups =>
      prevGroups.map(group => {
        // Only modify the specific group requested to leave
        if (group.id === groupId) {
          console.log(`Leaving group: ${group.name} (${group.id})`);
          return {
            ...group,
            members: group.members.filter(m => m.id !== currentUser.id),
          };
        }
        return group;
      })
    );
    
    toast({
      title: "Left study group",
      description: "You have left the study group.",
    });
  };

  return {
    studyGroups,
    userGroups,
    createGroup,
    joinGroup,
    leaveGroup
  };
};
