
import { useState, useEffect } from 'react';
import { isToday, parseISO } from 'date-fns';
import { StudyStats } from './types';

export const useStudyStats = () => {
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

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studyStats', JSON.stringify(stats));
  }, [stats]);

  // Update stats directly (manual override)
  const updateStats = (newStats: StudyStats) => {
    setStats(newStats);
  };

  return {
    stats,
    updateStats,
    setStats
  };
};
