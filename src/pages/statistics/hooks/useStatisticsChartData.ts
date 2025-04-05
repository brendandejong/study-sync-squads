
import { useState } from 'react';

export const useStatisticsChartData = () => {
  // Demo data for charts
  const [studyTypeData] = useState([
    { name: 'Quiet', value: 40, color: '#93c5fd' },
    { name: 'Discussion', value: 25, color: '#c4b5fd' },
    { name: 'Flashcards', value: 15, color: '#fcd34d' },
    { name: 'Practice', value: 10, color: '#86efac' },
    { name: 'Exam Prep', value: 10, color: '#fda4af' }
  ]);

  const [weeklyProgressData] = useState([
    { name: 'Mon', hours: 0 },
    { name: 'Tue', hours: 0 },
    { name: 'Wed', hours: 0 },
    { name: 'Thu', hours: 0 },
    { name: 'Fri', hours: 0 },
    { name: 'Sat', hours: 0 },
    { name: 'Sun', hours: 0 }
  ]);

  return {
    studyTypeData,
    weeklyProgressData
  };
};
