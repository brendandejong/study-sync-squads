
import React from 'react';
import WeeklyProgressChart from './charts/WeeklyProgressChart';
import StudyMethodChart from './charts/StudyMethodChart';
import { useIsMobile } from '@/hooks/use-mobile';
import { StudySession } from '@/hooks/useStats';

interface ChartSectionProps {
  weeklyProgressData?: { name: string; hours: number }[];
  studyTypeData: { name: string; value: number; color: string }[];
  sessions?: StudySession[];
}

const ChartSection = ({ weeklyProgressData, studyTypeData, sessions }: ChartSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WeeklyProgressChart sessions={sessions} />
      <StudyMethodChart data={studyTypeData} />
    </div>
  );
};

export default ChartSection;
