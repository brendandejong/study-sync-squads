
import { useState } from 'react';
import { StudyGoal } from '@/hooks/statistics/types';

export const useStatisticsForm = (initialStats: any) => {
  // Dialog open states
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  
  // Form states
  const [newGoal, setNewGoal] = useState<Partial<StudyGoal>>({
    title: '',
    targetHours: 10,
    completedHours: 0,
    deadline: new Date().toISOString().split('T')[0]
  });
  
  const [studySession, setStudySession] = useState({
    duration: 0,
    courseId: '',
    tags: ['quiet'],
    date: new Date().toISOString().split('T')[0]
  });
  
  const [editedStats, setEditedStats] = useState({
    totalHours: initialStats.totalHours,
    weeklyHours: initialStats.weeklyHours,
    streak: initialStats.streak,
    preferredStudyType: initialStats.preferredStudyType,
    lastStudyDate: initialStats.lastStudyDate
  });

  return {
    // Dialog states
    isGoalDialogOpen,
    setIsGoalDialogOpen,
    isStatsDialogOpen,
    setIsStatsDialogOpen,
    isSessionDialogOpen, 
    setIsSessionDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    goalToDelete,
    setGoalToDelete,
    
    // Form states
    newGoal,
    setNewGoal,
    studySession,
    setStudySession,
    editedStats,
    setEditedStats,
  };
};
