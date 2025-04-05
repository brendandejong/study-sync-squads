
import { Course, StudyGroup, User, Message } from '../types';

export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  avatar: '/placeholder.svg',
  email: 'alex@university.edu'
};

// Add predefined courses for the MBA program
export const courses: Course[] = [
  {
    id: 'course-1',
    code: 'ENTI 674',
    name: 'Technologies of Innovation',
    subject: 'business',
    professor: 'Mohammad Keyhani',
    school: 'University of Calgary'
  },
  {
    id: 'course-2',
    code: 'OBHR 674',
    name: 'Navigating the Organization',
    subject: 'business',
    professor: 'Audrey Farrier',
    school: 'University of Calgary'
  },
  {
    id: 'course-3',
    code: 'FNCE 674',
    name: 'Special Topics in Finance',
    subject: 'business',
    professor: 'Peggy L. Hedges',
    school: 'University of Calgary'
  },
  {
    id: 'course-4',
    code: 'SGMA 672',
    name: 'Strategic Analysis',
    subject: 'business',
    professor: 'Astrid Eckstein',
    school: 'University of Calgary'
  }
];

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

// Create default study groups for each course
export const studyGroups: StudyGroup[] = [
  // ENTI 674 Groups
  {
    id: 'group-1',
    name: 'ENTI 674 Tech Innovation Discussion Group',
    course: courses[0],
    description: 'Weekly discussion of technology innovation concepts and case studies from ENTI 674',
    tags: ['discussion', 'practice'],
    members: [users[0], users[1], users[2]],
    maxMembers: 8,
    timeSlots: [
      { day: 'Tuesday', startTime: '16:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '17:00', endTime: '19:00' }
    ],
    location: 'Scurfield Hall Room 341',
    createdBy: 'user-1',
    createdAt: '2025-03-10T12:00:00Z',
    isPublic: true
  },
  {
    id: 'group-2',
    name: 'ENTI 674 Exam Prep Group',
    course: courses[0],
    description: 'Focused preparation for midterm and final exams for ENTI 674',
    tags: ['exam', 'flashcards'],
    members: [users[2], users[3], users[4]],
    maxMembers: 6,
    timeSlots: [
      { day: 'Friday', startTime: '14:00', endTime: '16:00' },
      { day: 'Saturday', startTime: '10:00', endTime: '12:00' }
    ],
    location: 'Library Study Room 5',
    createdBy: 'user-3',
    createdAt: '2025-03-12T14:30:00Z',
    isPublic: true
  },
  
  // OBHR 674 Groups
  {
    id: 'group-3',
    name: 'OBHR 674 Case Analysis Group',
    course: courses[1],
    description: 'Weekly meetings to analyze organizational behavior cases from OBHR 674',
    tags: ['discussion', 'practice'],
    members: [users[1], users[4], users[5]],
    maxMembers: 7,
    timeSlots: [
      { day: 'Monday', startTime: '18:00', endTime: '20:00' },
      { day: 'Wednesday', startTime: '19:00', endTime: '21:00' }
    ],
    location: 'Downtown Campus Room 345',
    createdBy: 'user-4',
    createdAt: '2025-03-15T09:00:00Z',
    isPublic: true
  },
  {
    id: 'group-4',
    name: 'OBHR Quiet Study Group',
    course: courses[1],
    description: 'Focused quiet study sessions for OBHR 674 assignments and readings',
    tags: ['quiet', 'exam'],
    members: [users[0], users[6], users[7]],
    maxMembers: 5,
    timeSlots: [
      { day: 'Tuesday', startTime: '10:00', endTime: '12:00' },
      { day: 'Thursday', startTime: '11:00', endTime: '13:00' }
    ],
    location: 'Library 3rd Floor',
    createdBy: 'user-6',
    createdAt: '2025-03-18T16:45:00Z',
    isPublic: true
  },
  
  // FNCE 674 Groups
  {
    id: 'group-5',
    name: 'FNCE 674 Problem-Solving Group',
    course: courses[2],
    description: 'Group for working through complex finance problems and case studies',
    tags: ['practice', 'discussion'],
    members: [users[2], users[5], users[6]],
    maxMembers: 6,
    timeSlots: [
      { day: 'Wednesday', startTime: '15:00', endTime: '17:00' },
      { day: 'Sunday', startTime: '14:00', endTime: '16:00' }
    ],
    location: 'Virtual (Zoom)',
    createdBy: 'user-5',
    createdAt: '2025-03-20T11:20:00Z',
    isPublic: true
  },
  {
    id: 'group-6',
    name: 'FNCE Exam Preparation',
    course: courses[2],
    description: 'Intensive exam preparation sessions for FNCE 674',
    tags: ['exam', 'flashcards'],
    members: [users[1], users[3], users[7]],
    maxMembers: 8,
    timeSlots: [
      { day: 'Saturday', startTime: '13:00', endTime: '16:00' }
    ],
    location: 'Scurfield Hall Room 250',
    createdBy: 'user-7',
    createdAt: '2025-03-22T10:00:00Z',
    isPublic: true
  },
  
  // SGMA 672 Groups
  {
    id: 'group-7',
    name: 'SGMA 672 Strategy Discussion',
    course: courses[3],
    description: 'Weekly discussion of strategy frameworks and their application',
    tags: ['discussion', 'practice'],
    members: [users[0], users[4], users[7]],
    maxMembers: 10,
    timeSlots: [
      { day: 'Monday', startTime: '14:00', endTime: '16:00' },
      { day: 'Friday', startTime: '10:00', endTime: '12:00' }
    ],
    location: 'Downtown Campus Room 210',
    createdBy: 'user-4',
    createdAt: '2025-03-25T13:30:00Z',
    isPublic: true
  },
  {
    id: 'group-8',
    name: 'SGMA Case Competition Prep',
    course: courses[3],
    description: 'Preparation for case competitions and strategic analysis assignments',
    tags: ['practice', 'discussion'],
    members: [users[2], users[3], users[5], users[6]],
    maxMembers: 6,
    timeSlots: [
      { day: 'Thursday', startTime: '18:00', endTime: '20:00' },
      { day: 'Sunday', startTime: '15:00', endTime: '17:00' }
    ],
    location: 'Scurfield Hall Room 460',
    createdBy: 'user-2',
    createdAt: '2025-03-28T09:15:00Z',
    isPublic: true
  }
];

// Empty array for messages since there are no default study groups
export const messages: Message[] = [];
