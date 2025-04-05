import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useStats, StudyGoal } from '@/hooks/useStats';
import { useCourses } from '@/hooks/useCourses';

// Hook to manage state and handlers for the Statistics page
export const useStatisticsPage = () => {
  const { toast } = useToast();
  const { goals, stats, sessions, addGoal, updateStats, logStudySession, deleteGoal, updateGoalProgress } = useStats();
  const { courses } = useCourses();

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
    totalHours: stats.totalHours,
    weeklyHours: stats.weeklyHours,
    streak: stats.streak,
    preferredStudyType: stats.preferredStudyType,
    lastStudyDate: stats.lastStudyDate
  });

  // Demo data for charts
  const [studyTypeData] = useState([
    { name: 'Quiet', value: 40, color: '#93c5fd' },
    { name: 'Discussion', value: 25, color: '#c4b5fd' },
    { name: 'Flashcards', value: 15, color: '#fcd34d' },
    { name: 'Practice', value: 10, color: '#86efac' },
    { name: 'Exam Prep', value: 10, color: '#fda4af' }
  ]);

  const [weeklyProgressData] = useState([
    { name: 'Mon', hours: 0 },
    { name: 'Tue', hours: 0 },
    { name: 'Wed', hours: 0 },
    { name: 'Thu', hours: 0 },
    { name: 'Fri', hours: 0 },
    { name: 'Sat', hours: 0 },
    { name: 'Sun', hours: 0 }
  ]);

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

    addGoal(newGoal as Omit<StudyGoal, 'id'>);
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
    if (goalToDelete) {
      deleteGoal(goalToDelete);
      setIsDeleteDialogOpen(false);
      setGoalToDelete(null);
      
      toast({
        title: "Goal deleted",
        description: "Your study goal has been removed successfully"
      });
    }
  };

  const handleCompleteGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      // Calculate remaining hours to complete
      const remainingHours = goal.targetHours - goal.completedHours;
      if (remainingHours > 0) {
        updateGoalProgress(goalId, remainingHours);
        
        toast({
          title: "Goal completed",
          description: `Congratulations! "${goal.title}" has been marked as completed.`
        });
      }
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
    // Data
    goals,
    stats,
    courses,
    studyTypeData,
    weeklyProgressData,
    sessions,
    
    // Dialog states
    isGoalDialogOpen,
    setIsGoalDialogOpen,
    isStatsDialogOpen,
    setIsStatsDialogOpen,
    isSessionDialogOpen, 
    setIsSessionDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    
    // Form states
    newGoal,
    setNewGoal,
    studySession,
    setStudySession,
    editedStats,
    setEditedStats,
    
    // Event handlers
    handleAddGoal,
    handleAddSession,
    handleUpdateStats,
    confirmDeleteGoal,
    handleDeleteGoal,
    handleCompleteGoal,
    handleUpdateGoalProgress
  };
};
