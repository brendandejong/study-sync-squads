
import { useState, useEffect } from 'react';
import { StudyGoal } from './types';

export const useGoals = () => {
  // Load study goals from localStorage
  const [goals, setGoals] = useState<StudyGoal[]>(() => {
    const savedGoals = localStorage.getItem('studyGoals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studyGoals', JSON.stringify(goals));
  }, [goals]);

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

  return {
    goals,
    addGoal,
    updateGoalProgress,
    deleteGoal
  };
};
