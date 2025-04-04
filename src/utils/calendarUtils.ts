
import { addDays, parseISO, format } from 'date-fns';
import { UserEvent } from '@/types/calendar';

type ExtractedEvent = Omit<UserEvent, "id">;

export function extractEventFromMessage(message: string): ExtractedEvent | null {
  // Check if message contains calendar-related keywords
  const calendarKeywords = ['add to calendar', 'schedule', 'add event', 'appointment', 'meeting', 'workout', 'class'];
  const hasCalendarIntent = calendarKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
  
  if (!hasCalendarIntent) return null;
  
  // Extract event title
  let title = "New Event";
  const titleMatch = message.match(/(?:add|schedule|create|put)\s+(?:an?|the)?\s*([a-zA-Z\s]+?)(?:\s+(?:on|at|for|to my calendar|to calendar))/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  }
  
  // Extract date
  const currentDate = new Date();
  let eventDate = currentDate;
  
  // Check for today/tomorrow/specific dates
  if (message.includes('today')) {
    eventDate = currentDate;
  } else if (message.includes('tomorrow')) {
    eventDate = addDays(currentDate, 1);
  } else {
    // Try to extract date patterns like "April 5th", "04/05", "2025-04-05"
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                         'july', 'august', 'september', 'october', 'november', 'december'];
                         
    // Pattern for "April 5th" or "April 5"
    const datePattern1 = new RegExp(`(${monthNames.join('|')})\\s+(\\d{1,2})(?:st|nd|rd|th)?`, 'i');
    const dateMatch1 = message.toLowerCase().match(datePattern1);
    
    // Pattern for MM/DD or MM-DD
    const datePattern2 = /(\d{1,2})[\/\-](\d{1,2})/;
    const dateMatch2 = message.match(datePattern2);
    
    // Pattern for YYYY-MM-DD
    const datePattern3 = /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/;
    const dateMatch3 = message.match(datePattern3);
    
    if (dateMatch1) {
      const month = monthNames.indexOf(dateMatch1[1].toLowerCase());
      const day = parseInt(dateMatch1[2], 10);
      
      if (month !== -1 && day >= 1 && day <= 31) {
        // Use current year, but set month and day
        eventDate = new Date(currentDate.getFullYear(), month, day);
        
        // If the date is in the past, assume next year
        if (eventDate < currentDate) {
          eventDate = new Date(currentDate.getFullYear() + 1, month, day);
        }
      }
    } else if (dateMatch2) {
      const month = parseInt(dateMatch2[1], 10) - 1; // Months are 0-indexed
      const day = parseInt(dateMatch2[2], 10);
      
      if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
        // Use current year, but set month and day
        eventDate = new Date(currentDate.getFullYear(), month, day);
        
        // If the date is in the past, assume next year
        if (eventDate < currentDate) {
          eventDate = new Date(currentDate.getFullYear() + 1, month, day);
        }
      }
    } else if (dateMatch3) {
      const year = parseInt(dateMatch3[1], 10);
      const month = parseInt(dateMatch3[2], 10) - 1; // Months are 0-indexed
      const day = parseInt(dateMatch3[3], 10);
      
      if (year >= 2000 && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
        eventDate = new Date(year, month, day);
      }
    }
  }
  
  // Extract time
  let startTime = "12:00";
  let endTime = "13:00";
  
  // Look for time patterns like "at 4pm", "at 16:00", "from 3-4pm"
  const timePattern1 = /(?:at|from)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
  const timeMatch1 = message.match(timePattern1);
  
  const timePattern2 = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?(?:\s*-\s*|\s+to\s+)(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i;
  const timeMatch2 = message.match(timePattern2);
  
  if (timeMatch2) {
    // We have a range like "3-4pm" or "3pm to 4pm"
    let startHour = parseInt(timeMatch2[1], 10);
    const startMinute = timeMatch2[2] ? parseInt(timeMatch2[2], 10) : 0;
    const startAmPm = timeMatch2[3]?.toLowerCase();
    
    let endHour = parseInt(timeMatch2[4], 10);
    const endMinute = timeMatch2[5] ? parseInt(timeMatch2[5], 10) : 0;
    const endAmPm = timeMatch2[6]?.toLowerCase() || startAmPm; // Default to same AM/PM as start if not specified
    
    // Convert to 24-hour format
    if (startAmPm === 'pm' && startHour < 12) startHour += 12;
    if (startAmPm === 'am' && startHour === 12) startHour = 0;
    
    if (endAmPm === 'pm' && endHour < 12) endHour += 12;
    if (endAmPm === 'am' && endHour === 12) endHour = 0;
    
    startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  } else if (timeMatch1) {
    // We have a start time only
    let hour = parseInt(timeMatch1[1], 10);
    const minute = timeMatch1[2] ? parseInt(timeMatch1[2], 10) : 0;
    const amPm = timeMatch1[3]?.toLowerCase();
    
    // Convert to 24-hour format
    if (amPm === 'pm' && hour < 12) hour += 12;
    if (amPm === 'am' && hour === 12) hour = 0;
    
    startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Default to 1 hour later for end time
    let endHour = hour + 1;
    if (endHour >= 24) endHour = 23;
    endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
  
  // Extract description (use everything after detecting the event basics)
  let description = "";
  const descriptionKeywords = ['with description', 'description:', 'notes:', 'details:'];
  
  for (const keyword of descriptionKeywords) {
    const index = message.toLowerCase().indexOf(keyword);
    if (index !== -1) {
      description = message.substring(index + keyword.length).trim();
      break;
    }
  }
  
  // If no explicit description found, use a default based on the title
  if (!description) {
    description = `Event: ${title}`;
  }
  
  return {
    title,
    date: eventDate,
    startTime,
    endTime,
    description
  };
}
