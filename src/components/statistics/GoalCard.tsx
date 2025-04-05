
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash, CheckCircle2 } from 'lucide-react';
import { StudyGoal } from '@/hooks/statistics/types';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface GoalCardProps {
  goal: StudyGoal;
  onDelete: (goalId: string) => void;
  onComplete: (goalId: string) => void;
  onMarkProgress: (goalId: string, hours: number) => void;
}

const GoalCard = ({ goal, onDelete, onComplete, onMarkProgress }: GoalCardProps) => {
  const isCompleted = goal.completedHours >= goal.targetHours;
  
  // Prevent event propagation to avoid triggering parent events
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(goal.id);
  };
  
  const handleCompleteClick = () => {
    if (!isCompleted) {
      onComplete(goal.id);
    }
  };
  
  const handleProgressClick = (hours: number) => {
    onMarkProgress(goal.id, hours);
  };
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className={`card-gradient cursor-pointer hover:shadow-md transition-shadow ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                {goal.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteClick}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Target: {goal.targetHours} hours • Due: {new Date(goal.deadline).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {goal.completedHours}/{goal.targetHours} hours</span>
                <span className="font-medium">{Math.round((goal.completedHours / goal.targetHours) * 100)}%</span>
              </div>
              <Progress 
                value={(goal.completedHours / goal.targetHours) * 100} 
                className={`h-2 ${isCompleted ? 'bg-green-100' : ''}`}
              />
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={handleCompleteClick}
          disabled={isCompleted}
          className={isCompleted ? 'text-gray-400' : 'text-green-600'}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {isCompleted ? 'Already completed' : 'Mark as completed'}
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => handleProgressClick(1)}>
          Add 1 hour of progress
        </ContextMenuItem>
        
        <ContextMenuItem onClick={() => handleProgressClick(2)}>
          Add 2 hours of progress
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default GoalCard;
