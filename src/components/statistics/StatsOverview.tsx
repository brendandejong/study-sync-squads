
import React from 'react';
import { Clock, BookOpen, Target, Flame } from 'lucide-react';
import StatsCard from './StatsCard';
import { StudyStats } from '@/hooks/useStats';
import { CoursesType } from '@/hooks/useCourses';

interface StatsOverviewProps {
  stats: StudyStats;
  goals: any[];
  courses: CoursesType;
  onEditStats: () => void;
}

const StatsOverview = ({ stats, goals, courses, onEditStats }: StatsOverviewProps) => {
  const getMostStudiedCourseName = () => {
    const course = courses.find(c => c.id === stats.mostStudiedCourse);
    return course ? `${course.code}: ${course.name}` : "None selected";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        icon={<Clock className="mr-2 h-5 w-5 text-blue-500" />}
        title="Total Study Time"
        value={<div className="text-3xl font-bold text-blue-700">{stats.totalHours.toFixed(1)}h</div>}
        subtitle={`${stats.weeklyHours.toFixed(1)}h this week`}
        onEdit={onEditStats}
      />
      
      <StatsCard
        icon={<BookOpen className="mr-2 h-5 w-5 text-purple-500" />}
        title="Most Studied"
        value={<div className="text-lg font-bold text-purple-700 truncate">{getMostStudiedCourseName()}</div>}
        subtitle={`Preferred style: ${stats.preferredStudyType}`}
        onEdit={onEditStats}
      />
      
      <StatsCard
        icon={<Target className="mr-2 h-5 w-5 text-green-500" />}
        title="Goal Progress"
        value={<div className="text-lg font-bold text-green-700">{goals.length} active goals</div>}
        subtitle={`${goals.filter(g => g.completedHours >= g.targetHours).length} completed`}
      />
      
      <StatsCard
        icon={<Flame className="mr-2 h-5 w-5 text-orange-500" />}
        title="Study Streak"
        value={<div className="text-3xl font-bold text-orange-700">{stats.streak} days</div>}
        subtitle="Keep it up!"
        onEdit={onEditStats}
      />
    </div>
  );
};

export default StatsOverview;
