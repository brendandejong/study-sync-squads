
import { Course } from '@/types';
import CourseItem from './CourseItem';
import { getSubjectDisplayName } from '@/utils/subjectUtils';

interface CourseGroupProps {
  subject: string;
  courses: Course[];
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
}

const CourseGroup = ({ subject, courses, selectedCourse, onSelectCourse }: CourseGroupProps) => {
  return (
    <div className="mb-2">
      <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {getSubjectDisplayName(subject)}
      </div>
      {courses.map((course) => (
        <CourseItem
          key={course.id}
          course={course}
          isSelected={selectedCourse?.id === course.id}
          onSelect={() => onSelectCourse(course)}
        />
      ))}
    </div>
  );
};

export default CourseGroup;
