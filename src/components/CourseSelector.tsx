
import { useState, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { courses } from '@/data/mockData';

interface CourseSelectorProps {
  selectedCourse: Course | null;
  onSelectCourse: (course: Course | null) => void;
}

const CourseSelector = ({ selectedCourse, onSelectCourse }: CourseSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white"
        >
          {selectedCourse ? selectedCourse.name : "Select course..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {open && (
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search courses..." className="h-10" />
            <CommandEmpty>No course found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {courses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={`${course.code} ${course.name}`}
                  onSelect={() => {
                    onSelectCourse(course.id === selectedCourse?.id ? null : course);
                    setOpen(false);
                  }}
                  className="flex items-center cursor-pointer"
                >
                  <span className={`h-3 w-3 rounded-full mr-2 subject-${course.subject}`} />
                  <span className="flex-1 truncate">{course.name}</span>
                  {selectedCourse?.id === course.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default CourseSelector;
