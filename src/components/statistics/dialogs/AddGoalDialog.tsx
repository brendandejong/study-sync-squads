
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StudyGoal } from '@/hooks/useStats';

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newGoal: Partial<StudyGoal>;
  setNewGoal: (goal: Partial<StudyGoal>) => void;
  onAddGoal: () => void;
}

const AddGoalDialog = ({ 
  open, 
  onOpenChange, 
  newGoal, 
  setNewGoal, 
  onAddGoal 
}: AddGoalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Study Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title</Label>
            <Input
              id="title"
              placeholder="e.g., Complete Calculus Review"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Target Hours</Label>
            <Input
              id="hours"
              type="number"
              min="1"
              step="0.5"
              value={newGoal.targetHours}
              onChange={(e) => setNewGoal({ ...newGoal, targetHours: parseFloat(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAddGoal}>Add Goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
