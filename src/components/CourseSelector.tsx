
import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { courses } from '@/data/mockData';
import { Input } from '@/components/ui/input';

interface CourseSelectorProps {
  selectedCourse: Course | null;
  onSelectCourse: (course: Course | null) => void;
}

const CourseSelector = ({ selectedCourse, onSelectCourse }: CourseSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between bg-white"
        onClick={() => setOpen(!open)}
      >
        {selectedCourse ? selectedCourse.name : "Select course..."}
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
            {filteredCourses.length === 0 ? (
              <div className="px-2 py-3 text-center text-sm text-gray-500">
                No course found.
              </div>
            ) : (
              <div className="p-1">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      onSelectCourse(course.id === selectedCourse?.id ? null : course);
                      setOpen(false);
                    }}
                  >
                    <span className={`h-3 w-3 rounded-full mr-2 inline-block subject-${course.subject}`} />
                    <span className="flex-1">{course.name}</span>
                    {selectedCourse?.id === course.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseSelector;
