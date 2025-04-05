
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatsOverview from '@/components/statistics/StatsOverview';
import ChartSection from '@/components/statistics/ChartSection';
import GoalList from '@/components/statistics/GoalList';
import { StudyGoal, StudyStats } from '@/hooks/useStats';

interface StatisticsTabsProps {
  stats: StudyStats;
  goals: StudyGoal[];
  courses: any[];
  weeklyProgressData: { name: string; hours: number }[];
  studyTypeData: { name: string; value: number; color: string }[];
  onEditStats: () => void;
  onDeleteGoal: (goalId: string) => void;
}

const StatisticsTabs = ({ 
  stats, 
  goals, 
  courses, 
  weeklyProgressData,
  studyTypeData,
  onEditStats, 
  onDeleteGoal 
}: StatisticsTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-blue-50 mb-6">
        <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
          Overview
        </TabsTrigger>
        <TabsTrigger value="goals" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
          Study Goals
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <StatsOverview 
          stats={stats} 
          goals={goals} 
          courses={courses} 
          onEditStats={onEditStats} 
        />
        
        <ChartSection 
          weeklyProgressData={weeklyProgressData}
          studyTypeData={studyTypeData}
        />
      </TabsContent>
      
      <TabsContent value="goals" className="space-y-6">
        <GoalList 
          goals={goals} 
          onDeleteGoal={onDeleteGoal} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default StatisticsTabs;
