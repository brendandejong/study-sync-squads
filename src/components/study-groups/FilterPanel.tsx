
import { useState } from 'react';
import { Course, StudyTag } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CourseSelector from '@/components/CourseSelector';
import { courses } from '@/data/mockData';

interface FilterPanelProps {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  activeFilters: StudyTag[];
  setActiveFilters: (filters: StudyTag[]) => void;
  studyGroupsCount: number;
  userGroupsCount: number;
}

const FilterPanel = ({
  selectedCourse,
  setSelectedCourse,
  activeFilters,
  setActiveFilters,
  studyGroupsCount,
  userGroupsCount
}: FilterPanelProps) => {
  const availableTags: { value: StudyTag; label: string }[] = [
    { value: 'quiet', label: 'Quiet Session' },
    { value: 'flashcards', label: 'Flashcards' },
    { value: 'exam', label: 'Exam Cram' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'practice', label: 'Practice' },
  ];

  const toggleFilter = (tag: StudyTag) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter(t => t !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="font-semibold mb-4">Filters</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <CourseSelector
              selectedCourse={selectedCourse}
              onSelectCourse={setSelectedCourse}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Type
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag.value}
                  variant={activeFilters.includes(tag.value) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    activeFilters.includes(tag.value) ? "" : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleFilter(tag.value)}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>
          
          {(selectedCourse || activeFilters.length > 0) && (
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => {
                setSelectedCourse(null);
                setActiveFilters([]);
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h2 className="font-semibold mb-4">Quick Stats</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Groups</span>
            <span className="font-medium">{studyGroupsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Your Groups</span>
            <span className="font-medium">{userGroupsCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Available Courses</span>
            <span className="font-medium">{courses.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
