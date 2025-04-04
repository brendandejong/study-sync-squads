
// Helper functions for authentication

/**
 * Loads the user data from localStorage if available
 */
export const loadUserFromStorage = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const savedUser = localStorage.getItem('user');
  
  if (isLoggedIn && savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
  }
  
  return null;
};

/**
 * Saves user data to localStorage
 */
export const saveUserToStorage = (user: any) => {
  if (!user || !user.id || !user.name) {
    console.error('Invalid user data:', user);
    return;
  }
  
  try {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    console.log('User successfully saved in localStorage:', user);
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

/**
 * Clears user data from localStorage
 */
export const removeUserFromStorage = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
};

/**
 * Initialize empty collections for a new user
 */
export const initializeUserData = () => {
  const keysToPreserve = ['theme', 'prefersColorScheme'];
  
  // Get all localStorage keys
  const allKeys = Object.keys(localStorage);
  
  // Remove all app-related data, preserving only system settings
  allKeys.forEach(key => {
    if (!keysToPreserve.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  // Initialize empty data collections
  localStorage.setItem('studyGoals', JSON.stringify([]));
  localStorage.setItem('studySessions', JSON.stringify([]));
  localStorage.setItem('studyStats', JSON.stringify({
    totalHours: 0,
    weeklyHours: 0,
    monthlyHours: 0,
    preferredStudyType: "",
    preferredTime: "",
    streak: 0,
    mostStudiedCourse: ""
  }));
  localStorage.setItem('userCourses', JSON.stringify([]));
  localStorage.setItem('userEvents', JSON.stringify([]));
};
