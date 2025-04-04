
import { StudyGroup, StudyTag } from '@/types';
import { formatTime } from '@/utils/helpers';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';

interface StudyGroupCardProps {
  group: StudyGroup;
  onClick: (groupId: string) => void;
}

const StudyGroupCard = ({ group, onClick }: StudyGroupCardProps) => {
  const { id, name, course, description, tags, members, maxMembers, timeSlots, location } = group;
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow card-gradient relative"
      onClick={() => onClick(id)}
    >
      <div className={`h-2 subject-${course.subject}`} />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <span className="text-xs font-medium bg-pastel-blue px-2 py-1 rounded-full">
            {course.code}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className={`text-xs font-medium px-2 py-1 rounded-full tag-${tag}`}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Calendar className="h-4 w-4 text-indigo-400" />
          <div>
            {timeSlots.map((slot, index) => (
              <div key={index}>
                {slot.day} {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex -space-x-2 mr-2">
              {members.slice(0, 3).map((member) => (
                <UserAvatar key={member.id} user={member} size="sm" />
              ))}
              {members.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-pastel-lavender flex items-center justify-center text-xs text-indigo-600">
                  +{members.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600 flex items-center">
              <Users className="h-4 w-4 mr-1 text-indigo-400" />
              {members.length}/{maxMembers}
            </span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
            onClick={(e) => {
              e.stopPropagation();
              onClick(id);
            }}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudyGroupCard;
