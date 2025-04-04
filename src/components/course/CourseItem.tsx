
import { Check, Trash2 } from 'lucide-react';
import { Course } from '@/types';
import { getSubjectColorClass } from '@/utils/subjectUtils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface CourseItemProps {
  course: Course;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: (courseId: string) => void;
}

const CourseItem = ({ course, isSelected, onSelect, onDelete }: CourseItemProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showConfirm) {
      onDelete?.(course.id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };
  
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div
      className="flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-gray-100 group"
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
      
      {isSelected && !showConfirm && (
        <Check className="ml-auto h-4 w-4" />
      )}
      
      {!showConfirm ? (
        onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )
      ) : (
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={handleCancelDelete}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-6 text-xs"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseItem;
