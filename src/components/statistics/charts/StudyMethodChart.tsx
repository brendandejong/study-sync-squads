
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface StudyMethodChartProps {
  data: { name: string; value: number; color: string }[];
}

const StudyMethodChart = ({ data }: StudyMethodChartProps) => {
  const { toast } = useToast();

  return (
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
              data={data}
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudyMethodChart;
