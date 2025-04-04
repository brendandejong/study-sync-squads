
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface StatsCardProps {
  title: React.ReactNode;
  icon: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  onEdit?: () => void;
  className?: string;
}

const StatsCard = ({ 
  title, 
  icon, 
  value, 
  subtitle, 
  onEdit,
  className 
}: StatsCardProps) => {
  return (
    <Card className={`card-gradient ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            {icon}
            {title}
          </CardTitle>
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {value}
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
