
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { getSubjectColorClass } from '@/utils/subjectUtils';
import { useCourses } from '@/hooks/useCourses';
import CourseDropdown from './course/CourseDropdown';
import AddCourseDialog from './course/AddCourseDialog';

interface CourseSelectorProps {
  selectedCourse: Course | null;
  onSelectCourse: (course: Course | null) => void;
}

const CourseSelector = ({ selectedCourse, onSelectCourse }: CourseSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  
  const { courses, addCourse } = useCourses();
  
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

  const handleAddCourse = (course: Course) => {
    addCourse(course);
  };

  const handleSelectCourse = (course: Course) => {
    onSelectCourse(course.id === selectedCourse?.id ? null : course);
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
        <CourseDropdown
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          groupedCourses={groupedCourses}
          selectedCourse={selectedCourse}
          onSelectCourse={handleSelectCourse}
          onAddCourseClick={() => setIsAddCourseDialogOpen(true)}
          closeDropdown={() => setOpen(false)}
        />
      )}
      
      <AddCourseDialog
        isOpen={isAddCourseDialogOpen}
        onClose={() => setIsAddCourseDialogOpen(false)}
        onAdd={handleAddCourse}
      />
    </div>
  );
};

export default CourseSelector;
