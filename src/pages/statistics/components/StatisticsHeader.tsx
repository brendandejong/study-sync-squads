
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';

interface StatisticsHeaderProps {
  onLogSession: () => void;
  onAddGoal: () => void;
}

const StatisticsHeader = ({ onLogSession, onAddGoal }: StatisticsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 rounded-lg bg-white bg-opacity-70 backdrop-blur-sm shadow-sm">
      <h1 className="text-2xl font-bold text-blue-800">Study Insights</h1>
      <div className="flex gap-2">
        <Button onClick={onLogSession} className="bg-blue-600 hover:bg-blue-700 btn-hover-effect">
          <Clock className="h-4 w-4 mr-2" />
          Log Session
        </Button>
        <Button onClick={onAddGoal} className="bg-indigo-600 hover:bg-indigo-700 btn-hover-effect">
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>
    </div>
  );
};

export default StatisticsHeader;
