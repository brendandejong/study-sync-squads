
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCourses } from '@/hooks/useCourses';

interface StudySessionData {
  duration: number;
  courseId: string;
  tags: string[];
  date: string;
}

interface LogSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studySession: StudySessionData;
  setStudySession: (session: StudySessionData) => void;
  onAddSession: () => void;
}

const LogSessionDialog = ({ 
  open, 
  onOpenChange, 
  studySession, 
  setStudySession,
  onAddSession 
}: LogSessionDialogProps) => {
  const { courses } = useCourses();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Study Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <select 
              id="course"
              className="w-full border border-gray-300 rounded-md h-10 px-3 py-2"
              value={studySession.courseId}
              onChange={(e) => setStudySession({ ...studySession, courseId: e.target.value })}
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code}: {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={studySession.duration}
              onChange={(e) => setStudySession({ ...studySession, duration: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Study Type</Label>
            <select
              id="type"
              className="w-full border border-gray-300 rounded-md h-10 px-3 py-2"
              value={studySession.tags[0]}
              onChange={(e) => setStudySession({ ...studySession, tags: [e.target.value] })}
            >
              <option value="quiet">Quiet</option>
              <option value="discussion">Discussion</option>
              <option value="flashcards">Flashcards</option>
              <option value="practice">Practice</option>
              <option value="exam">Exam Prep</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={studySession.date}
              onChange={(e) => setStudySession({ ...studySession, date: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAddSession}>Log Session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogSessionDialog;
