
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Course } from '@/types';
import CourseGroup from './CourseGroup';

interface GroupedCourses {
  [subject: string]: Course[];
}

interface CourseDropdownProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  groupedCourses: GroupedCourses;
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
  onAddCourseClick: () => void;
  closeDropdown: () => void;
}

const CourseDropdown = ({
  searchTerm,
  setSearchTerm,
  groupedCourses,
  selectedCourse,
  onSelectCourse,
  onDeleteCourse,
  onAddCourseClick,
  closeDropdown
}: CourseDropdownProps) => {
  // Sort the subjects alphabetically
  const sortedSubjects = Object.keys(groupedCourses).sort();
  
  return (
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
        {sortedSubjects.length === 0 ? (
          <div className="px-2 py-3 text-center text-sm text-gray-500">
            No course found.
          </div>
        ) : (
          <div className="p-1">
            {sortedSubjects.map((subject) => (
              <CourseGroup
                key={subject}
                subject={subject}
                courses={groupedCourses[subject].sort((a, b) => a.code.localeCompare(b.code))}
                selectedCourse={selectedCourse}
                onSelectCourse={(course) => {
                  onSelectCourse(course);
                  closeDropdown();
                }}
                onDeleteCourse={onDeleteCourse}
              />
            ))}
          </div>
        )}
        
        <div className="border-t border-gray-200 p-2">
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-center text-blue-600 hover:bg-blue-50"
            onClick={() => {
              closeDropdown();
              onAddCourseClick();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Course
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDropdown;
