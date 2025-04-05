
import { useGoals } from './useGoals';
import { useSessions } from './useSessions';
import { useStudyStats } from './useStudyStats';
import { calculateStreak } from './streakUtils';
import { isToday, parseISO } from 'date-fns';
import { StudyGoal, StudySession, StudyStats } from './types';

export { StudyGoal, StudySession, StudyStats } from './types';

export const useStats = () => {
  const { goals, addGoal, updateGoalProgress, deleteGoal } = useGoals();
  const { sessions, addSession } = useSessions();
  const { stats, updateStats, setStats } = useStudyStats();

  // Log a new study session
  const logStudySession = (session: Omit<StudySession, 'id'>) => {
    const newSession = addSession(session);
    
    // Update any related goals
    const sessionHours = session.duration / 60;
    
    // If there are any goals, update the first one for simplicity
    if (goals.length > 0) {
      updateGoalProgress(goals[0].id, sessionHours);
    }
    
    // Calculate new streak based on session date
    const newStreak = calculateStreak(session.date, stats.streak, stats.lastStudyDate);
    
    // Update stats based on this session
    const updatedStats = { ...stats };
    updatedStats.totalHours += sessionHours;
    updatedStats.weeklyHours += sessionHours;
    updatedStats.monthlyHours += sessionHours;
    updatedStats.streak = newStreak;
    
    // Set the last study date to today if this is a session for today
    if (isToday(parseISO(session.date))) {
      updatedStats.lastStudyDate = new Date().toISOString().split('T')[0];
    }
    
    // Update the mostStudiedCourse if this session is longer than previous ones
    const courseSessions = sessions.filter(s => s.courseId === session.courseId);
    const totalCourseMinutes = courseSessions.reduce((total, s) => total + s.duration, 0) + session.duration;
    
    // Find the current most studied course and its total time
    let currentMostStudiedMinutes = 0;
    if (stats.mostStudiedCourse) {
      currentMostStudiedMinutes = sessions
        .filter(s => s.courseId === stats.mostStudiedCourse)
        .reduce((total, s) => total + s.duration, 0);
    }
    
    // If this course has more study time, make it the most studied
    if (totalCourseMinutes > currentMostStudiedMinutes) {
      updatedStats.mostStudiedCourse = session.courseId;
    }
    
    // Update preferred study type
    if (session.tags.length > 0) {
      // For simplicity, just use the first tag
      updatedStats.preferredStudyType = session.tags[0];
    }
    
    setStats(updatedStats);
  };

  return {
    goals,
    sessions,
    stats,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    logStudySession,
    updateStats
  };
};
