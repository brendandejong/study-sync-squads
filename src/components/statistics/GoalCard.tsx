
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash } from 'lucide-react';
import { StudyGoal } from '@/hooks/useStats';

interface GoalCardProps {
  goal: StudyGoal;
  onDelete: (goalId: string) => void;
}

const GoalCard = ({ goal, onDelete }: GoalCardProps) => {
  return (
    <Card className="card-gradient">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{goal.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(goal.id)}
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
            className="h-2" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
