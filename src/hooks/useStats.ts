import { useState, useEffect } from 'react';
import { isToday, isYesterday, parseISO } from 'date-fns';

export interface StudyGoal {
  id: string;
  title: string;
  targetHours: number;
  completedHours: number;
  deadline: string;
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // in minutes
  courseId: string;
  tags: string[];
}

export interface StudyStats {
  totalHours: number;
  weeklyHours: number;
  monthlyHours: number;
  preferredStudyType: string;
  preferredTime: string;
  streak: number;
  mostStudiedCourse: string;
  lastStudyDate: string | null;
}

export const useStats = () => {
  // Load study goals from localStorage
  const [goals, setGoals] = useState<StudyGoal[]>(() => {
    const savedGoals = localStorage.getItem('studyGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  // Load study sessions from localStorage
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const savedSessions = localStorage.getItem('studySessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  // Load study stats from localStorage or use default empty stats
  const [stats, setStats] = useState<StudyStats>(() => {
    const savedStats = localStorage.getItem('studyStats');
    return savedStats ? JSON.parse(savedStats) : {
      totalHours: 0,
      weeklyHours: 0,
      monthlyHours: 0,
      preferredStudyType: "quiet",
      preferredTime: "evening",
      streak: 0,
      mostStudiedCourse: "",
      lastStudyDate: null
    };
  });

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studyGoals', JSON.stringify(goals));
  }, [goals]);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studyStats', JSON.stringify(stats));
  }, [stats]);

  // Add a new goal
  const addGoal = (goal: Omit<StudyGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setGoals([...goals, newGoal]);
  };

  // Update a goal's completed hours
  const updateGoalProgress = (goalId: string, hours: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          completedHours: Math.min(goal.targetHours, goal.completedHours + hours)
        };
      }
      return goal;
    }));
  };

  // Delete a goal
  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  // Calculate streak based on session dates
  const calculateStreak = (sessionDate: string, currentStreak: number, lastStudyDate: string | null): number => {
    const sessionDateObj = parseISO(sessionDate);
    
    // If this is today's first session
    if (isToday(sessionDateObj)) {
      if (!lastStudyDate) {
        // First ever session
        return 1;
      }
      
      const lastDateObj = parseISO(lastStudyDate);
      
      // If the last session was yesterday, increment streak
      if (isYesterday(lastDateObj)) {
        return currentStreak + 1;
      }
      
      // If the last session was also today, maintain current streak
      if (isToday(lastDateObj)) {
        return currentStreak;
      }
      
      // Gap in study days, reset streak but count today
      return 1;
    } 
    // Session for a past date - don't change streak if it doesn't affect the continuity
    else {
      // We don't modify the streak for backdated entries
      return currentStreak;
    }
  };

  // Log a new study session
  const logStudySession = (session: Omit<StudySession, 'id'>) => {
    const newSession = {
      ...session,
      id: `session-${Date.now()}`,
    };
    setSessions([...sessions, newSession]);
    
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

  // Update stats directly (manual override)
  const updateStats = (newStats: StudyStats) => {
    setStats(newStats);
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
