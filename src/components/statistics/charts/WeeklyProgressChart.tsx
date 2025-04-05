
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { StudySession } from '@/hooks/useStats';

interface WeeklyProgressChartProps {
  sessions?: StudySession[];
}

const WeeklyProgressChart = ({ sessions = [] }: WeeklyProgressChartProps) => {
  const { toast } = useToast();
  
  // Transform data for the pie chart - calculate hours per day of the week
  const pieData = useMemo(() => {
    // Initialize an object to track hours by day of week (0 = Sunday, 1 = Monday, etc.)
    const daysOfWeek = {
      'Sun': 0,
      'Mon': 0,
      'Tue': 0,
      'Wed': 0,
      'Thu': 0,
      'Fri': 0,
      'Sat': 0
    };
    
    // Get current date
    const today = new Date();
    
    // Calculate the date for the beginning of the current week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Calculate the date for the end of the current week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Filter sessions to only include those from this week
    const thisWeekSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
    });
    
    // Add hours from each session to the appropriate day
    thisWeekSessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dayOfWeek = sessionDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayName = Object.keys(daysOfWeek)[dayOfWeek];
      const hoursStudied = session.duration / 60; // Convert minutes to hours
      
      daysOfWeek[dayName] += hoursStudied;
    });
    
    // Convert the object to an array and filter to only days with hours > 0
    const data = Object.entries(daysOfWeek)
      .map(([name, hours]) => ({ name, hours }))
      .filter(item => item.hours > 0);
    
    // Add color information
    return data.map(item => ({
      name: item.name,
      value: item.hours,
      color: getColorForDay(item.name)
    }));
  }, [sessions]);
  
  // Calculate total weekly hours
  const totalWeeklyHours = useMemo(() => {
    return pieData.reduce((total, day) => total + day.value, 0);
  }, [pieData]);
  
  // If no data has hours > 0, show a placeholder
  const chartData = pieData.length > 0 ? pieData : [{ name: 'No data', value: 1, color: '#e5e7eb' }];

  return (
    <Card className="card-gradient h-[300px] md:h-[280px]">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm md:text-base flex items-center">
            <PieChartIcon className="mr-2 h-4 w-4 text-blue-500" />
            Weekly Progress
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              toast({
                title: "Edit Weekly Data",
                description: "Use the 'Log Session' button to record study time which will update this chart"
              });
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs md:text-sm">
          {totalWeeklyHours > 0 
            ? `${totalWeeklyHours.toFixed(1)} hours studied this week` 
            : "No study time recorded this week"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 px-2 h-[calc(100%-70px)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={45}
              innerRadius={25}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => 
                `${name}: ${value.toFixed(1)}h`
              }
              labelLine={{ strokeWidth: 0.5, stroke: "#666" }}
              style={{ fontSize: '7px' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${Number(value).toFixed(1)} hours`, 'Time Spent']}
              itemStyle={{ color: '#333' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Function to get a color for each day of the week
const getColorForDay = (day: string): string => {
  const colors = {
    'Mon': '#93c5fd', // Light blue
    'Tue': '#a5b4fc', // Indigo
    'Wed': '#c4b5fd', // Purple
    'Thu': '#ddd6fe', // Lavender
    'Fri': '#a7f3d0', // Mint
    'Sat': '#67e8f9', // Cyan
    'Sun': '#fde68a', // Yellow
  };
  
  return colors[day as keyof typeof colors] || '#93c5fd';
};

export default WeeklyProgressChart;
