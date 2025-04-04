
import { useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
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
    <div className="w-full md:w-80">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCourse ? `${selectedCourse.code} - ${selectedCourse.name}` : "Select course..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search courses..." className="h-10" />
            <CommandEmpty>No course found.</CommandEmpty>
            <CommandGroup>
              {courses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={`${course.code} ${course.name}`}
                  onSelect={() => {
                    onSelectCourse(course);
                    setOpen(false);
                  }}
                >
                  <div className={`h-3 w-3 rounded-full mr-2 subject-${course.subject}`} />
                  <span className="font-medium">{course.code}</span>
                  <span className="ml-2 text-gray-600">{course.name}</span>
                  <Check
                    className={`ml-auto h-4 w-4 ${
                      selectedCourse?.id === course.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CourseSelector;
