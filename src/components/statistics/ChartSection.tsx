
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChartIcon, Calendar, Edit, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartSectionProps {
  weeklyProgressData: { name: string; hours: number }[];
  studyTypeData: { name: string; value: number; color: string }[];
}

const ChartSection = ({ weeklyProgressData, studyTypeData }: ChartSectionProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="card-gradient h-[300px] md:h-[280px]">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm md:text-base flex items-center">
              <LineChart className="mr-2 h-4 w-4 text-blue-500" />
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
        <CardContent className="pt-0 px-1 h-[calc(100%-70px)]">
          <ChartContainer config={{ hours: { color: "#93c5fd" } }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={weeklyProgressData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 9 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 9 }} 
                  width={20} 
                  tickFormatter={(value) => value > 0 ? value : ''} 
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  domain={[0, 'dataMax + 0.5']}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="var(--color-hours, #93c5fd)" 
                  strokeWidth={2}
                  dot={{ stroke: 'var(--color-hours, #93c5fd)', strokeWidth: 1, r: 3, fill: 'white' }}
                  activeDot={{ r: 5, stroke: 'var(--color-hours, #93c5fd)', strokeWidth: 1, fill: 'var(--color-hours, #93c5fd)' }}
                />
              </RechartsLineChart>
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
