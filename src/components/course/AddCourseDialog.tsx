
import { useState } from 'react';
import { Course, Subject } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { availableSubjects, getSubjectDisplayName } from '@/utils/subjectUtils';

interface AddCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (course: Course) => void;
}

const AddCourseDialog = ({ isOpen, onClose, onAdd }: AddCourseDialogProps) => {
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    subject: 'math' as Subject,
    professor: '',
    school: ''
  });

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.code) {
      toast({
        title: "Error",
        description: "Course name and code are required",
        variant: "destructive"
      });
      return;
    }
    
    const newCourseItem: Course = {
      id: `custom-course-${Date.now()}`,
      ...newCourse
    };
    
    onAdd(newCourseItem);
    
    // Reset form
    setNewCourse({
      name: '',
      code: '',
      subject: 'math' as Subject,
      professor: '',
      school: ''
    });
    
    onClose();
    
    toast({
      title: "Course added",
      description: `${newCourseItem.code} - ${newCourseItem.name} has been added to your courses.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Course</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="courseCode">Course Code</Label>
            <Input
              id="courseCode"
              placeholder="e.g., CS 101"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="courseName">Course Name</Label>
            <Input
              id="courseName"
              placeholder="e.g., Introduction to Computer Science"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="courseProfessor">Professor</Label>
            <Input
              id="courseProfessor"
              placeholder="e.g., Dr. John Smith"
              value={newCourse.professor}
              onChange={(e) => setNewCourse({ ...newCourse, professor: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="courseSchool">School</Label>
            <Input
              id="courseSchool"
              placeholder="e.g., Stanford University"
              value={newCourse.school}
              onChange={(e) => setNewCourse({ ...newCourse, school: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="courseSubject">Subject</Label>
            <Select 
              value={newCourse.subject} 
              onValueChange={(value: Subject) => setNewCourse({ ...newCourse, subject: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {getSubjectDisplayName(subject)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddCourse}>
            Add Course
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;
