
import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';
import { Course, Subject } from '@/types';
import { Button } from '@/components/ui/button';
import { courses as defaultCourses } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface CourseSelectorProps {
  selectedCourse: Course | null;
  onSelectCourse: (course: Course | null) => void;
}

const CourseSelector = ({ selectedCourse, onSelectCourse }: CourseSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  
  // Get courses from localStorage only, since we no longer have default courses
  const [courses, setCourses] = useState<Course[]>(() => {
    const savedCourses = localStorage.getItem('userCourses');
    return savedCourses ? JSON.parse(savedCourses) : [];
  });
  
  // New course state
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    subject: 'math' as Subject,
    professor: '',
    school: ''
  });

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.professor && course.professor.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (course.school && course.school.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Group courses by subject
  const groupedCourses = filteredCourses.reduce((acc, course) => {
    if (!acc[course.subject]) {
      acc[course.subject] = [];
    }
    acc[course.subject].push(course);
    return acc;
  }, {} as Record<string, Course[]>);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get subject display name with first letter capitalized
  const getSubjectDisplayName = (subject: string) => {
    return subject.charAt(0).toUpperCase() + subject.slice(1);
  };

  // Get color class for subject
  const getSubjectColorClass = (subject: string) => {
    const colorMap: Record<string, string> = {
      math: 'bg-blue-500',
      science: 'bg-green-500',
      arts: 'bg-purple-500',
      language: 'bg-yellow-500',
      history: 'bg-red-500',
      business: 'bg-orange-500',
      tech: 'bg-indigo-500'
    };
    return colorMap[subject] || 'bg-gray-500';
  };

  // Handle adding a new course
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
    
    const updatedCourses = [newCourseItem, ...courses];
    setCourses(updatedCourses);
    
    // Save to localStorage
    localStorage.setItem('userCourses', JSON.stringify(updatedCourses));
    
    // Reset form
    setNewCourse({
      name: '',
      code: '',
      subject: 'math' as Subject,
      professor: '',
      school: ''
    });
    
    setIsAddCourseDialogOpen(false);
    
    toast({
      title: "Course added",
      description: `${newCourseItem.code} - ${newCourseItem.name} has been added to your courses.`
    });
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between bg-white"
        onClick={() => setOpen(!open)}
      >
        {selectedCourse ? (
          <div className="flex items-center">
            <span className={`h-3 w-3 rounded-full mr-2 ${getSubjectColorClass(selectedCourse.subject)}`} />
            <span className="font-medium">{selectedCourse.code}</span>
            <span className="mx-1 text-gray-500">-</span>
            <span>{selectedCourse.name}</span>
          </div>
        ) : (
          "Select course..."
        )}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10"
              autoFocus
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {Object.keys(groupedCourses).length === 0 ? (
              <div className="px-2 py-3 text-center text-sm text-gray-500">
                No course found.
              </div>
            ) : (
              <div className="p-1">
                {Object.entries(groupedCourses).map(([subject, subjectCourses]) => (
                  <div key={subject} className="mb-2">
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {getSubjectDisplayName(subject)}
                    </div>
                    {subjectCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          onSelectCourse(course.id === selectedCourse?.id ? null : course);
                          setOpen(false);
                        }}
                      >
                        <span className={`h-3 w-3 rounded-full mr-2 ${getSubjectColorClass(course.subject)}`} />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{course.code}</span>
                            <span className="text-gray-700">{course.name}</span>
                          </div>
                          {(course.professor || course.school) && (
                            <div className="text-xs text-gray-500">
                              {course.professor && <span>{course.professor}</span>}
                              {course.professor && course.school && <span> • </span>}
                              {course.school && <span>{course.school}</span>}
                            </div>
                          )}
                        </div>
                        {selectedCourse?.id === course.id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            
            <div className="border-t border-gray-200 p-2">
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-center text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  setOpen(false);
                  setIsAddCourseDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Course
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
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
                  <SelectItem value="math">Math</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="arts">Arts</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCourseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCourse}>
              Add Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseSelector;
