import React from 'react';
import AddGoalDialog from '@/components/statistics/dialogs/AddGoalDialog';
import LogSessionDialog from '@/components/statistics/dialogs/LogSessionDialog';
import EditStatsDialog from '@/components/statistics/dialogs/EditStatsDialog';
import DeleteGoalDialog from '@/components/statistics/dialogs/DeleteGoalDialog';
import { StudyGoal } from '@/hooks/statistics/types';

interface StatisticsDialogsProps {
  // Dialog states
  isGoalDialogOpen: boolean;
  setIsGoalDialogOpen: (open: boolean) => void;
  isStatsDialogOpen: boolean;
  setIsStatsDialogOpen: (open: boolean) => void;
  isSessionDialogOpen: boolean;
  setIsSessionDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  
  // Form states and handlers
  newGoal: Partial<StudyGoal>;
  setNewGoal: (goal: Partial<StudyGoal>) => void;
  studySession: {
    duration: number;
    courseId: string;
    tags: string[];
    date: string;
  };
  setStudySession: (session: any) => void;
  editedStats: {
    totalHours: number;
    weeklyHours: number;
    streak: number;
    preferredStudyType: string;
  };
  setEditedStats: (stats: any) => void;
  
  // Event handlers
  onAddGoal: () => void;
  onAddSession: () => void;
  onUpdateStats: () => void;
  onConfirmDelete: () => void;
}

const StatisticsDialogs = ({
  isGoalDialogOpen,
  setIsGoalDialogOpen,
  isStatsDialogOpen,
  setIsStatsDialogOpen,
  isSessionDialogOpen,
  setIsSessionDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  newGoal,
  setNewGoal,
  studySession,
  setStudySession,
  editedStats,
  setEditedStats,
  onAddGoal,
  onAddSession,
  onUpdateStats,
  onConfirmDelete,
}: StatisticsDialogsProps) => {
  return (
    <>
      <AddGoalDialog 
        open={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        newGoal={newGoal}
        setNewGoal={setNewGoal}
        onAddGoal={onAddGoal}
      />
      
      <LogSessionDialog 
        open={isSessionDialogOpen}
        onOpenChange={setIsSessionDialogOpen}
        studySession={studySession}
        setStudySession={setStudySession}
        onAddSession={onAddSession}
      />
      
      <EditStatsDialog 
        open={isStatsDialogOpen}
        onOpenChange={setIsStatsDialogOpen}
        editedStats={editedStats}
        setEditedStats={setEditedStats}
        onUpdateStats={onUpdateStats}
      />
      
      <DeleteGoalDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={onConfirmDelete}
      />
    </>
  );
};

export default StatisticsDialogs;
