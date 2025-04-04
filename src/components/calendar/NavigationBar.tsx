
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NavigationBarProps {
  viewType: 'daily' | 'weekly' | 'monthly';
  onViewTypeChange: (viewType: 'daily' | 'weekly' | 'monthly') => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  viewType,
  onViewTypeChange,
  onPrevious,
  onNext,
  onToday,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={viewType} onValueChange={(v) => onViewTypeChange(v as 'daily' | 'weekly' | 'monthly')}>
        <TabsList>
          <TabsTrigger value="daily">Day</TabsTrigger>
          <TabsTrigger value="weekly">Week</TabsTrigger>
          <TabsTrigger value="monthly">Month</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default NavigationBar;
