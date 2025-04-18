
export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  bio?: string;
  role?: string;
  theme?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  subject: Subject;
  professor?: string;
  school?: string;
}

export type Subject = 'math' | 'science' | 'arts' | 'language' | 'history' | 'business' | 'tech';

export type StudyTag = 'quiet' | 'flashcards' | 'exam' | 'discussion' | 'practice';

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  course: Course;
  description: string;
  tags: StudyTag[];
  members: User[];
  maxMembers: number;
  timeSlots: TimeSlot[];
  location: string;
  createdBy: string;
  createdAt: string;
  isPublic: boolean;
  invitedUsers?: string[]; // Array of user IDs who are invited to see the private group
}

export interface Message {
  id: string;
  groupId: string;
  userId: string;
  user: User;
  content: string;
  timestamp: string;
}
