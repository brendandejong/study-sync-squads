
import { isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Calculate streak based on session dates
 */
export const calculateStreak = (
  sessionDate: string, 
  currentStreak: number, 
  lastStudyDate: string | null
): number => {
  const sessionDateObj = parseISO(sessionDate);
  
  // If this is today's first session
  if (isToday(sessionDateObj)) {
    if (!lastStudyDate) {
      // First ever session
      return 1;
    }
    
    const lastDateObj = parseISO(lastStudyDate);
    
    // If the last session was yesterday, increment streak
    if (isYesterday(lastDateObj)) {
      return currentStreak + 1;
    }
    
    // If the last session was also today, maintain current streak
    if (isToday(lastDateObj)) {
      return currentStreak;
    }
    
    // Gap in study days, reset streak but count today
    return 1;
  } 
  // Session for a past date - don't change streak if it doesn't affect the continuity
  else {
    // We don't modify the streak for backdated entries
    return currentStreak;
  }
};
