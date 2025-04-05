
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChartIcon, Calendar, Edit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';

interface ChartSectionProps {
  weeklyProgressData: { name: string; hours: number }[];
  studyTypeData: { name: string; value: number; color: string }[];
}

const ChartSection = ({ weeklyProgressData, studyTypeData }: ChartSectionProps) => {
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="card-gradient h-[300px] md:h-[280px]">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm md:text-base flex items-center">
              <BarChartIcon className="mr-2 h-4 w-4 text-blue-500" />
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
          <ChartContainer config={{ hours: { color: "#93c5fd" } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={weeklyProgressData} 
                margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="hours" fill="var(--color-hours, #93c5fd)" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card className="card-gradient h-[300px] md:h-[280px]">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm md:text-base flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-purple-500" />
              Study Method Distribution
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                toast({
                  title: "Edit Study Methods",
                  description: "Use the 'Log Session' button to record your study methods which will update this chart"
                });
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-xs md:text-sm">Your preferred study methods</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 px-2 h-[calc(100%-70px)]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={studyTypeData}
                cx="50%"
                cy="50%"
                outerRadius={45}
                innerRadius={25}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ strokeWidth: 0.5, stroke: "#666" }}
                style={{ fontSize: '7px' }}
              >
                {studyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartSection;
