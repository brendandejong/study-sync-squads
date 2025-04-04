
import { useState, useEffect } from 'react';

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
}

export const useStats = () => {
  // Load study goals from localStorage
  const [goals, setGoals] = useState<StudyGoal[]>(() => {
    const savedGoals = localStorage.getItem('studyGoals');
    return savedGoals ? JSON.parse(savedGoals) : [
      {
        id: "goal-1",
        title: "Complete Calculus Review",
        targetHours: 20,
        completedHours: 12,
        deadline: "2025-05-15",
      },
      {
        id: "goal-2",
        title: "Python Programming Project",
        targetHours: 15,
        completedHours: 5,
        deadline: "2025-04-30",
      },
      {
        id: "goal-3",
        title: "Essay Research",
        targetHours: 10,
        completedHours: 8,
        deadline: "2025-04-20",
      }
    ];
  });

  // Load study sessions from localStorage
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const savedSessions = localStorage.getItem('studySessions');
    return savedSessions ? JSON.parse(savedSessions) : [
      {
        id: "session-1",
        date: "2025-04-01",
        duration: 90,
        courseId: "course-1",
        tags: ["quiet", "flashcards"]
      },
      {
        id: "session-2",
        date: "2025-04-02",
        duration: 120,
        courseId: "course-2",
        tags: ["discussion"]
      },
      {
        id: "session-3",
        date: "2025-04-03",
        duration: 60,
        courseId: "course-1",
        tags: ["exam"]
      },
      {
        id: "session-4",
        date: "2025-04-03",
        duration: 45,
        courseId: "course-3",
        tags: ["quiet"]
      },
      {
        id: "session-5",
        date: "2025-04-04",
        duration: 75,
        courseId: "course-2",
        tags: ["practice"]
      }
    ];
  });

  // Load study stats from localStorage or calculate them
  const [stats, setStats] = useState<StudyStats>(() => {
    const savedStats = localStorage.getItem('studyStats');
    return savedStats ? JSON.parse(savedStats) : {
      totalHours: 6.5,
      weeklyHours: 6.5,
      monthlyHours: 6.5,
      preferredStudyType: "quiet",
      preferredTime: "evening",
      streak: 4,
      mostStudiedCourse: "course-1"
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

  // Log a new study session
  const logStudySession = (session: Omit<StudySession, 'id'>) => {
    const newSession = {
      ...session,
      id: `session-${Date.now()}`,
    };
    setSessions([...sessions, newSession]);
    
    // Update any related goals
    const sessionHours = session.duration / 60;
    // For demo purposes, just update the first goal
    if (goals.length > 0) {
      updateGoalProgress(goals[0].id, sessionHours);
    }
    
    // Recalculate stats
    calculateStats();
  };

  // Calculate statistics from sessions
  const calculateStats = () => {
    // This would normally be a more complex calculation based on all sessions
    // For demo purposes, we'll just update a few values
    
    const totalMinutes = sessions.reduce((total, session) => total + session.duration, 0);
    const totalHours = totalMinutes / 60;
    
    // Count tag occurrences to find preferred study type
    const tagCounts: Record<string, number> = {};
    sessions.forEach(session => {
      session.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // Find the most frequent tag
    let preferredStudyType = stats.preferredStudyType;
    let maxCount = 0;
    Object.entries(tagCounts).forEach(([tag, count]) => {
      if (count > maxCount) {
        maxCount = count;
        preferredStudyType = tag;
      }
    });
    
    // Count course occurrences to find most studied course
    const courseCounts: Record<string, number> = {};
    sessions.forEach(session => {
      courseCounts[session.courseId] = (courseCounts[session.courseId] || 0) + session.duration;
    });
    
    // Find the course with most study time
    let mostStudiedCourse = stats.mostStudiedCourse;
    let maxDuration = 0;
    Object.entries(courseCounts).forEach(([courseId, duration]) => {
      if (duration > maxDuration) {
        maxDuration = duration;
        mostStudiedCourse = courseId;
      }
    });
    
    setStats({
      ...stats,
      totalHours,
      weeklyHours: totalHours, // Simplified for demo
      monthlyHours: totalHours, // Simplified for demo
      preferredStudyType,
      mostStudiedCourse
    });
  };

  return {
    goals,
    sessions,
    stats,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    logStudySession
  };
};
