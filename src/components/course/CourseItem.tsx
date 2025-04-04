
import { Check } from 'lucide-react';
import { Course } from '@/types';
import { getSubjectColorClass } from '@/utils/subjectUtils';

interface CourseItemProps {
  course: Course;
  isSelected: boolean;
  onSelect: () => void;
}

const CourseItem = ({ course, isSelected, onSelect }: CourseItemProps) => {
  return (
    <div
      className="flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-gray-100"
      onClick={onSelect}
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
      {isSelected && (
        <Check className="ml-auto h-4 w-4" />
      )}
    </div>
  );
};

export default CourseItem;
