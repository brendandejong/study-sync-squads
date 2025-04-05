
import { useStats } from '@/hooks/useStats';
import { useCourses } from '@/hooks/useCourses';
import { useStatisticsForm } from './useStatisticsForm';
import { useStatisticsChartData } from './useStatisticsChartData';
import { useStatisticsHandlers } from './useStatisticsHandlers';

// Hook to manage state and handlers for the Statistics page
export const useStatisticsPage = () => {
  const { goals, stats, sessions, addGoal, updateStats, logStudySession, deleteGoal, updateGoalProgress } = useStats();
  const { courses } = useCourses();
  
  // Get chart data
  const { studyTypeData, weeklyProgressData } = useStatisticsChartData();
  
  // Get form state
  const formState = useStatisticsForm(stats);
  
  // Get event handlers
  const handlers = useStatisticsHandlers(
    stats,
    addGoal,
    logStudySession,
    updateStats,
    deleteGoal,
    updateGoalProgress,
    formState
  );

  return {
    // Data
    goals,
    stats,
    courses,
    studyTypeData,
    weeklyProgressData,
    sessions,
    
    // Dialog and form states
    ...formState,
    
    // Event handlers
    ...handlers
  };
};
