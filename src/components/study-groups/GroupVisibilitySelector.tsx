
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Lock, Users } from 'lucide-react';

interface GroupVisibilitySelectorProps {
  visibilityType: 'public' | 'private';
  handleVisibilityChange: (type: 'public' | 'private') => void;
}

const GroupVisibilitySelector: React.FC<GroupVisibilitySelectorProps> = ({
  visibilityType,
  handleVisibilityChange
}) => {
  return (
    <div className="space-y-4 pt-2">
      <Label>Group Visibility</Label>
      
      <RadioGroup 
        value={visibilityType} 
        onValueChange={(value) => handleVisibilityChange(value as 'public' | 'private')}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id="r1" />
          <Label htmlFor="r1" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Public - Anyone can see and join this group</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="private" id="r2" />
          <Label htmlFor="r2" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Private - Only you and people you invite can see this group</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default GroupVisibilitySelector;
