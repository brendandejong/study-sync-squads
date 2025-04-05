
import React, { useState } from 'react';
import { Course, StudyGroup, StudyTag, User } from '@/types';
import FilterPanel from '@/components/study-groups/FilterPanel';
import StudyGroupList from '@/components/study-groups/StudyGroupList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface StudyGroupViewProps {
  filteredGroups: StudyGroup[];
  userGroupsCount: number;
  showMyGroups: boolean;
  onShowMyGroupsChange: (value: boolean) => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  activeFilters: StudyTag[];
  setActiveFilters: (filters: StudyTag[]) => void;
  onGroupClick: (groupId: string) => void;
  onCreateClick: () => void;
  currentUser: any;
}

const StudyGroupView: React.FC<StudyGroupViewProps> = ({
  filteredGroups,
  userGroupsCount,
  showMyGroups,
  onShowMyGroupsChange,
  selectedCourse,
  setSelectedCourse,
  activeFilters,
  setActiveFilters,
  onGroupClick,
  onCreateClick,
  currentUser
}) => {
  // Log debugging information
  console.log('StudyGroupView - Current Tab:', showMyGroups ? 'My Groups' : 'All Groups');
  console.log('StudyGroupView - Displaying groups:', filteredGroups.map(g => g.id));
  console.log('StudyGroupView - User Groups Count:', userGroupsCount);

  return (
    <>
      <div className="mb-6">
        <Tabs 
          value={showMyGroups ? "my-groups" : "all-groups"} 
          onValueChange={(value) => {
            console.log('Tab changed to:', value);
            onShowMyGroupsChange(value === "my-groups");
          }}
          className="w-full"
        >
          <TabsList className="grid w-full md:w-80 grid-cols-2 bg-blue-50">
            <TabsTrigger value="all-groups" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">All Groups</TabsTrigger>
            <TabsTrigger value="my-groups" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">My Groups ({userGroupsCount})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <FilterPanel 
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
            studyGroupsCount={filteredGroups.length}
            userGroupsCount={userGroupsCount}
          />
        </div>
        
        <div className="lg:col-span-3">
          <StudyGroupList 
            studyGroups={filteredGroups}
            onGroupClick={onGroupClick}
            onCreateClick={onCreateClick}
            selectedCourse={selectedCourse?.id || null}
            activeFilters={activeFilters}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
  );
};

export default StudyGroupView;
