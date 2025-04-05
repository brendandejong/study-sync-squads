
import React from 'react';
import { Course, StudyTag, TimeSlot, User } from '@/types';
import AvailabilitySelector from '../AvailabilitySelector';
import GroupDetailsForm from './GroupDetailsForm';
import GroupVisibilitySelector from './GroupVisibilitySelector';
import UserInviteSelector from './UserInviteSelector';

interface FormState {
  name: string;
  selectedCourse: Course | null;
  description: string;
  location: string;
  maxMembers: number;
  selectedTags: StudyTag[];
  timeSlots: TimeSlot[];
  visibilityType: 'public' | 'private';
  selectedUsers: User[];
  searchQuery: string;
  filteredUsers: User[];
}

interface FormHandlers {
  setName: (name: string) => void;
  setSelectedCourse: (course: Course | null) => void;
  setDescription: (description: string) => void;
  setLocation: (location: string) => void;
  setMaxMembers: (maxMembers: number) => void;
  setSearchQuery: (query: string) => void;
  handleTagToggle: (tag: StudyTag) => void;
  handleAddTimeSlot: (timeSlot: TimeSlot) => void;
  handleRemoveTimeSlot: (index: number) => void;
  handleVisibilityChange: (type: 'public' | 'private') => void;
  handleAddUser: (user: User) => void;
  handleRemoveUser: (userId: string) => void;
}

interface CreateGroupFormProps {
  formState: FormState;
  handlers: FormHandlers;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ formState, handlers }) => {
  const {
    name,
    selectedCourse,
    description,
    location,
    maxMembers,
    selectedTags,
    timeSlots,
    visibilityType,
    selectedUsers,
    searchQuery,
    filteredUsers
  } = formState;

  const {
    setName,
    setSelectedCourse,
    setDescription,
    setLocation,
    setMaxMembers,
    setSearchQuery,
    handleTagToggle,
    handleAddTimeSlot,
    handleRemoveTimeSlot,
    handleVisibilityChange,
    handleAddUser,
    handleRemoveUser
  } = handlers;

  return (
    <div className="grid gap-4 py-4">
      <GroupDetailsForm 
        name={name}
        setName={setName}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        description={description}
        setDescription={setDescription}
        location={location}
        setLocation={setLocation}
        maxMembers={maxMembers}
        setMaxMembers={setMaxMembers}
        selectedTags={selectedTags}
        handleTagToggle={handleTagToggle}
      />
      
      <GroupVisibilitySelector 
        visibilityType={visibilityType}
        handleVisibilityChange={handleVisibilityChange}
      />
      
      {visibilityType === 'private' && (
        <UserInviteSelector 
          selectedUsers={selectedUsers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredUsers={filteredUsers}
          handleAddUser={handleAddUser}
          handleRemoveUser={handleRemoveUser}
        />
      )}
      
      <AvailabilitySelector
        timeSlots={timeSlots}
        onAddTimeSlot={handleAddTimeSlot}
        onRemoveTimeSlot={handleRemoveTimeSlot}
      />
    </div>
  );
};

export default CreateGroupForm;
