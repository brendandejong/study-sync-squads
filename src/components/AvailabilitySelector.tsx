
import { useState } from 'react';
import { TimeSlot } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { formatTime } from '@/utils/helpers';

interface AvailabilitySelectorProps {
  timeSlots: TimeSlot[];
  onAddTimeSlot: (timeSlot: TimeSlot) => void;
  onRemoveTimeSlot: (index: number) => void;
}

const AvailabilitySelector = ({ 
  timeSlots, 
  onAddTimeSlot, 
  onRemoveTimeSlot 
}: AvailabilitySelectorProps) => {
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlot>({
    day: 'Mon',
    startTime: '09:00',
    endTime: '10:00'
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const hours = [];
  for (let i = 8; i <= 22; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
    if (i < 22) hours.push(`${i.toString().padStart(2, '0')}:30`);
  }

  const handleAddTimeSlot = () => {
    onAddTimeSlot(newTimeSlot);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Availability</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
          <select
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={newTimeSlot.day}
            onChange={(e) => setNewTimeSlot({ ...newTimeSlot, day: e.target.value })}
          >
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <select
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={newTimeSlot.startTime}
            onChange={(e) => setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })}
          >
            {hours.map((hour) => (
              <option key={`start-${hour}`} value={hour}>{formatTime(hour)}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <select
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={newTimeSlot.endTime}
            onChange={(e) => setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })}
          >
            {hours.map((hour) => (
              <option key={`end-${hour}`} value={hour}>{formatTime(hour)}</option>
            ))}
          </select>
        </div>
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAddTimeSlot}
        className="w-full md:w-auto"
      >
        Add Time Slot
      </Button>
      
      <div className="space-y-2 mt-4">
        {timeSlots.map((slot, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center bg-gray-50 rounded-md p-2"
          >
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium mr-2">{slot.day}</span>
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemoveTimeSlot(index)}
              className="text-gray-500 hover:text-red-500"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilitySelector;
