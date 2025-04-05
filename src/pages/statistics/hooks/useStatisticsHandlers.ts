
import { useToast } from '@/hooks/use-toast';
import { StudyStats } from '@/hooks/statistics/types';
import { StudyGoal } from '@/hooks/statistics/types';

export const useStatisticsHandlers = (
  stats: StudyStats,
  goals: StudyGoal[], // Add goals parameter
  addGoal: (goal: any) => void,
  logStudySession: (session: any) => void,
  updateStats: (stats: StudyStats) => void,
  deleteGoal: (goalId: string) => void,
  updateGoalProgress: (goalId: string, hours: number) => void,
  formState: any
) => {
  const { toast } = useToast();
  const {
    setIsGoalDialogOpen,
    setIsSessionDialogOpen,
    setIsStatsDialogOpen,
    setIsDeleteDialogOpen,
    setGoalToDelete,
    newGoal,
    setNewGoal,
    studySession,
    setStudySession,
    editedStats
  } = formState;

  // Event handlers
  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetHours) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addGoal(newGoal);
    setIsGoalDialogOpen(false);
    setNewGoal({
      title: '',
      targetHours: 10,
      completedHours: 0,
      deadline: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Goal added",
      description: "Your study goal has been added successfully"
    });
  };
  
  const handleAddSession = () => {
    if (!studySession.courseId || studySession.duration <= 0) {
      toast({
        title: "Missing information",
        description: "Please select a course and enter a valid duration",
        variant: "destructive"
      });
      return;
    }
    
    logStudySession({
      date: studySession.date,
      duration: studySession.duration,
      courseId: studySession.courseId,
      tags: [studySession.tags[0]]
    });
    
    setIsSessionDialogOpen(false);
    setStudySession({
      duration: 0,
      courseId: '',
      tags: ['quiet'],
      date: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Session logged",
      description: "Your study session has been recorded"
    });
  };
  
  const handleUpdateStats = () => {
    updateStats({
      ...stats,
      ...editedStats
    });
    
    setIsStatsDialogOpen(false);
    
    toast({
      title: "Stats updated",
      description: "Your insights have been updated successfully"
    });
  };
  
  const confirmDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteGoal = () => {
    if (formState.goalToDelete) {
      deleteGoal(formState.goalToDelete);
      setIsDeleteDialogOpen(false);
      setGoalToDelete(null);
      
      toast({
        title: "Goal deleted",
        description: "Your study goal has been removed successfully"
      });
    }
  };

  const handleCompleteGoal = (goalId: string) => {
    // Find the goal in the goals array
    const goal = goals.find(g => g.id === goalId);
    
    if (goal) {
      // Calculate remaining hours to complete
      const remainingHours = Math.max(0, goal.targetHours - goal.completedHours);
      
      // Update the goal progress to mark it as complete
      updateGoalProgress(goalId, remainingHours);
      
      toast({
        title: "Goal completed",
        description: `Congratulations! "${goal.title}" has been marked as completed.`
      });
    } else {
      // Fallback in case goal is not found
      updateGoalProgress(goalId, 100);
      
      toast({
        title: "Goal completed",
        description: "Congratulations! Your goal has been marked as completed."
      });
    }
  };
  
  const handleUpdateGoalProgress = (goalId: string, hours: number) => {
    updateGoalProgress(goalId, hours);
    
    toast({
      title: "Progress updated",
      description: `Added ${hours} hour${hours !== 1 ? 's' : ''} to your study goal.`
    });
  };

  return {
    handleAddGoal,
    handleAddSession,
    handleUpdateStats,
    confirmDeleteGoal,
    handleDeleteGoal,
    handleCompleteGoal,
    handleUpdateGoalProgress
  };
};
