
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface WeeklyProgressChartProps {
  data: { name: string; hours: number }[];
}

const WeeklyProgressChart = ({ data }: WeeklyProgressChartProps) => {
  const { toast } = useToast();
  
  // Transform data for the pie chart
  const pieData = data.filter(item => item.hours > 0).map(item => ({
    name: item.name,
    value: item.hours,
    color: getColorForDay(item.name)
  }));
  
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
        <CardDescription className="text-xs md:text-sm">Hours studied per day this week</CardDescription>
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
              label={({ name, value, percent }) => 
                `${name} ${value}h (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={{ strokeWidth: 0.5, stroke: "#666" }}
              style={{ fontSize: '7px' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} hours`, 'Time Spent']}
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
