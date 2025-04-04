
import React from 'react';
import GoalCard from './GoalCard';
import { StudyGoal } from '@/hooks/useStats';

interface GoalListProps {
  goals: StudyGoal[];
  onDeleteGoal: (goalId: string) => void;
}

const GoalList = ({ goals, onDeleteGoal }: GoalListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {goals.length > 0 ? (
        goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onDelete={onDeleteGoal} />
        ))
      ) : (
        <div className="col-span-2 p-8 text-center bg-blue-50 rounded-lg">
          <p className="text-gray-500">No study goals yet. Add your first goal to start tracking your progress!</p>
        </div>
      )}
    </div>
  );
};

export default GoalList;
