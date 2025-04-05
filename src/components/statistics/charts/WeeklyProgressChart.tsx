
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';

interface WeeklyProgressChartProps {
  data: { name: string; hours: number }[];
}

const WeeklyProgressChart = ({ data }: WeeklyProgressChartProps) => {
  const { toast } = useToast();

  return (
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
      <CardContent className="pt-0 pb-2 px-1 h-[calc(100%-70px)]">
        <div className="w-full h-full max-h-full">
          <ChartContainer config={{ hours: { color: "#93c5fd" } }}>
            <ResponsiveContainer width="99%" height="99%">
              <RechartsLineChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 8 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                  dy={3}
                />
                <YAxis 
                  tick={{ fontSize: 8 }} 
                  width={20}
                  tickFormatter={(value) => value > 0 ? value : ''} 
                  axisLine={{ stroke: '#e5e7eb' }}
                  tickLine={false}
                  domain={[0, 'dataMax + 0.5']}
                  dx={-3}
                />
                <Tooltip 
                  content={<ChartTooltipContent />}
                  wrapperStyle={{ zIndex: 100 }}
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="var(--color-hours, #93c5fd)" 
                  strokeWidth={1.5}
                  dot={{ stroke: 'var(--color-hours, #93c5fd)', strokeWidth: 1, r: 1.5, fill: 'white' }}
                  activeDot={{ r: 3, stroke: 'var(--color-hours, #93c5fd)', strokeWidth: 1, fill: 'var(--color-hours, #93c5fd)' }}
                  isAnimationActive={false}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressChart;
