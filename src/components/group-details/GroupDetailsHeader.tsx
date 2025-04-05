
import { StudyGroup } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface GroupDetailsHeaderProps {
  group: StudyGroup;
}

const GroupDetailsHeader = ({ group }: GroupDetailsHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl flex items-center gap-2">
        <div className={`h-4 w-4 rounded-full mr-2 subject-${group.course.subject}`} />
        {group.name}
        {!group.isPublic && (
          <Badge variant="outline" className="ml-2 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Private
          </Badge>
        )}
      </DialogTitle>
      <DialogDescription>
        {group.course.code} - {group.course.name}
      </DialogDescription>
    </DialogHeader>
  );
};

export default GroupDetailsHeader;
