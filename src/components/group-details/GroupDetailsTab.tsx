
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StudyGroup } from '@/types';
import { formatTime } from '@/utils/helpers';
import UserAvatar from '../UserAvatar';
import { Calendar, Clock, MapPin, Users, UserPlus, Lock } from 'lucide-react';

interface GroupDetailsTabProps {
  group: StudyGroup;
  isCurrentUserMember: boolean;
  isCurrentUserOwner: boolean;
  isFull: boolean;
  onJoinGroup: () => void;
  onLeaveGroup: () => void;
}

const GroupDetailsTab = ({
  group,
  isCurrentUserMember,
  isCurrentUserOwner,
  isFull,
  onJoinGroup,
  onLeaveGroup,
}: GroupDetailsTabProps) => {
  return (
    <>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-gray-700">{group.description}</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {group.tags.map((tag) => (
          <span
            key={tag}
            className={`text-sm font-medium px-3 py-1 rounded-full tag-${tag}`}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </h3>
          <div className="space-y-2">
            {group.timeSlots.map((slot, index) => (
              <div key={index} className="bg-white p-2 rounded border">
                <div className="font-medium">{slot.day}</div>
                <div className="text-sm text-gray-600 flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </h3>
          <p className="text-gray-700">{group.location}</p>
          
          <h3 className="font-medium flex items-center mt-6">
            <Users className="h-4 w-4 mr-2" />
            Members ({group.members.length}/{group.maxMembers})
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.members.map((member) => (
              <div key={member.id} className="flex flex-col items-center">
                <UserAvatar 
                  user={member} 
                  size="sm" 
                />
                <span className="text-xs mt-1">
                  {member.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {!group.isPublic && isCurrentUserOwner && (
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h3 className="font-medium flex items-center mb-2">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite People
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            This is a private group. Only people you invite can see and join it.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white">
              <UserPlus className="h-4 w-4 mr-1" />
              Invite Members
            </Button>
          </div>
        </div>
      )}
      
      <div className="pt-4 flex justify-end">
        {isCurrentUserMember ? (
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLeaveGroup}
          >
            Leave Group
          </Button>
        ) : (
          <Button
            disabled={isFull}
            onClick={onJoinGroup}
          >
            {isFull ? 'Group is Full' : 'Join Group'}
          </Button>
        )}
      </div>
    </>
  );
};

export default GroupDetailsTab;
