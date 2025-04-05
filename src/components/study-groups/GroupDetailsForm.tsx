
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import CourseSelector from '@/components/CourseSelector';
import { Course, StudyTag } from '@/types';

interface GroupDetailsFormProps {
  name: string;
  setName: (name: string) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  description: string;
  setDescription: (description: string) => void;
  location: string;
  setLocation: (location: string) => void;
  maxMembers: number;
  setMaxMembers: (maxMembers: number) => void;
  selectedTags: StudyTag[];
  handleTagToggle: (tag: StudyTag) => void;
}

const GroupDetailsForm: React.FC<GroupDetailsFormProps> = ({
  name,
  setName,
  selectedCourse,
  setSelectedCourse,
  description,
  setDescription,
  location,
  setLocation,
  maxMembers,
  setMaxMembers,
  selectedTags,
  handleTagToggle
}) => {
  const availableTags: { value: StudyTag; label: string }[] = [
    { value: 'quiet', label: 'Quiet Session' },
    { value: 'flashcards', label: 'Flashcards' },
    { value: 'exam', label: 'Exam Cram' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'practice', label: 'Practice' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Group Name</Label>
          <Input
            id="name"
            placeholder="Give your group a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Course</Label>
          <CourseSelector
            selectedCourse={selectedCourse}
            onSelectCourse={setSelectedCourse}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your study group's focus, goals, etc."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Where will you meet?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="maxMembers">Maximum Members</Label>
          <Input
            id="maxMembers"
            type="number"
            min="2"
            max="20"
            value={maxMembers}
            onChange={(e) => setMaxMembers(parseInt(e.target.value))}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Group Tags</Label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <div key={tag.value} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.value}`}
                checked={selectedTags.includes(tag.value)}
                onCheckedChange={() => handleTagToggle(tag.value)}
              />
              <label
                htmlFor={`tag-${tag.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupDetailsForm;
