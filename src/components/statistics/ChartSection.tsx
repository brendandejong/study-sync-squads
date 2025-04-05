
import React from 'react';
import WeeklyProgressChart from './charts/WeeklyProgressChart';
import StudyMethodChart from './charts/StudyMethodChart';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartSectionProps {
  weeklyProgressData: { name: string; hours: number }[];
  studyTypeData: { name: string; value: number; color: string }[];
}

const ChartSection = ({ weeklyProgressData, studyTypeData }: ChartSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeeklyProgressChart data={weeklyProgressData} />
      <StudyMethodChart data={studyTypeData} />
    </div>
  );
};

export default ChartSection;
