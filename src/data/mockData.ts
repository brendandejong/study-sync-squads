
import { Course, StudyGroup, User, Message } from '../types';

export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  avatar: '/placeholder.svg',
  email: 'alex@university.edu'
};

// Empty array for courses - users will create their own
export const courses: Course[] = [];

export const users: User[] = [
  currentUser,
  { id: 'user-2', name: 'Sam Wilson', avatar: '/placeholder.svg', email: 'samw@university.edu' },
  { id: 'user-3', name: 'Taylor Chen', avatar: '/placeholder.svg', email: 'taylorc@university.edu' },
  { id: 'user-4', name: 'Jamie Smith', avatar: '/placeholder.svg', email: 'jamies@university.edu' },
  { id: 'user-5', name: 'Morgan Lee', avatar: '/placeholder.svg', email: 'morgan@university.edu' },
  { id: 'user-6', name: 'Casey Jones', avatar: '/placeholder.svg', email: 'caseym@university.edu' },
  { id: 'user-7', name: 'Avery Williams', avatar: '/placeholder.svg', email: 'averyw@university.edu' },
  { id: 'user-8', name: 'Jordan Taylor', avatar: '/placeholder.svg', email: 'jordant@university.edu' },
];

// Empty array for study groups since there are no default courses
export const studyGroups: StudyGroup[] = [];

// Empty array for messages since there are no default study groups
export const messages: Message[] = [];
