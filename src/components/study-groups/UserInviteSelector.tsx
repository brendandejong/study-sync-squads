
import React from 'react';
import { User } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface UserInviteSelectorProps {
  selectedUsers: User[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredUsers: User[];
  handleAddUser: (user: User) => void;
  handleRemoveUser: (userId: string) => void;
}

const UserInviteSelector: React.FC<UserInviteSelectorProps> = ({
  selectedUsers,
  searchQuery,
  setSearchQuery,
  filteredUsers,
  handleAddUser,
  handleRemoveUser
}) => {
  return (
    <div className="space-y-4 border-t pt-4">
      <Label>Invite Users</Label>
      <div className="space-y-2">
        <Input 
          placeholder="Search users by name or email" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 my-2">
            {selectedUsers.map(user => (
              <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                {user.name}
                <button 
                  onClick={() => handleRemoveUser(user.id)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        <div className="bg-gray-50 rounded-md max-h-40 overflow-y-auto p-2">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleAddUser(user)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-2 text-gray-500">No users found</div>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Selected users will be able to see and join your private group. You can add more users later.
        </p>
      </div>
    </div>
  );
};

export default UserInviteSelector;
