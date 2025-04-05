
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditedStats {
  totalHours: number;
  weeklyHours: number;
  streak: number;
  preferredStudyType: string;
  lastStudyDate?: string | null;
}

interface EditStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editedStats: EditedStats;
  setEditedStats: (stats: EditedStats) => void;
  onUpdateStats: () => void;
}

const EditStatsDialog = ({ 
  open, 
  onOpenChange, 
  editedStats, 
  setEditedStats, 
  onUpdateStats 
}: EditStatsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Study Insights</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="totalHours">Total Hours Studied</Label>
            <Input
              id="totalHours"
              type="number"
              min="0"
              step="0.5"
              value={editedStats.totalHours}
              onChange={(e) => setEditedStats({ ...editedStats, totalHours: parseFloat(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weeklyHours">Hours Studied This Week</Label>
            <Input
              id="weeklyHours"
              type="number"
              min="0"
              step="0.5"
              value={editedStats.weeklyHours}
              onChange={(e) => setEditedStats({ ...editedStats, weeklyHours: parseFloat(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="streak">Study Streak (days)</Label>
            <Input
              id="streak"
              type="number"
              min="0"
              value={editedStats.streak}
              onChange={(e) => setEditedStats({ ...editedStats, streak: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastStudyDate">Last Study Date</Label>
            <Input
              id="lastStudyDate"
              type="date"
              value={editedStats.lastStudyDate || ''}
              onChange={(e) => setEditedStats({ ...editedStats, lastStudyDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studyType">Preferred Study Type</Label>
            <select
              id="studyType"
              className="w-full border border-gray-300 rounded-md h-10 px-3 py-2"
              value={editedStats.preferredStudyType}
              onChange={(e) => setEditedStats({ ...editedStats, preferredStudyType: e.target.value })}
            >
              <option value="quiet">Quiet</option>
              <option value="discussion">Discussion</option>
              <option value="flashcards">Flashcards</option>
              <option value="practice">Practice</option>
              <option value="exam">Exam Prep</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onUpdateStats}>Update Stats</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatsDialog;
