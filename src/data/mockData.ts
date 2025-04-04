
import { Course, StudyGroup, User, Message } from '../types';

export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  avatar: '/placeholder.svg',
  email: 'alex@university.edu'
};

export const courses: Course[] = [
  { id: 'course-1', code: 'MATH 101', name: 'Introduction to Calculus', subject: 'math' },
  { id: 'course-2', code: 'PHYS 201', name: 'Physics Mechanics', subject: 'science' },
  { id: 'course-3', code: 'ARTS 110', name: 'Art History', subject: 'arts' },
  { id: 'course-4', code: 'ENGL 202', name: 'Advanced Composition', subject: 'language' },
  { id: 'course-5', code: 'HIST 150', name: 'World History', subject: 'history' },
  { id: 'course-6', code: 'BUS 301', name: 'Business Ethics', subject: 'business' },
  { id: 'course-7', code: 'CS 220', name: 'Data Structures', subject: 'tech' },
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

export const studyGroups: StudyGroup[] = [
  {
    id: 'group-1',
    name: 'Calculus Crash Course',
    course: courses[0],
    description: 'Focused study sessions for upcoming calculus exams. We will review key concepts and practice problems.',
    tags: ['quiet', 'exam'],
    members: [users[0], users[1], users[2]],
    maxMembers: 5,
    timeSlots: [
      { day: 'Mon', startTime: '15:00', endTime: '17:00' },
      { day: 'Wed', startTime: '15:00', endTime: '17:00' },
    ],
    location: 'Library, 3rd Floor',
    createdBy: 'user-1',
    createdAt: '2025-03-28T10:00:00Z',
  },
  {
    id: 'group-2',
    name: 'Physics Problem Solving',
    course: courses[1],
    description: 'Working through physics problems together. Bring your textbook and be ready to collaborate!',
    tags: ['practice', 'discussion'],
    members: [users[1], users[3], users[4]],
    maxMembers: 4,
    timeSlots: [
      { day: 'Tue', startTime: '14:00', endTime: '16:00' },
      { day: 'Thu', startTime: '14:00', endTime: '16:00' },
    ],
    location: 'Science Building, Room 125',
    createdBy: 'user-2',
    createdAt: '2025-03-27T14:30:00Z',
  },
  {
    id: 'group-3',
    name: 'Art History Flashcards',
    course: courses[2],
    description: 'Creating and reviewing flashcards for upcoming art history exams.',
    tags: ['flashcards', 'exam'],
    members: [users[2], users[5]],
    maxMembers: 6,
    timeSlots: [
      { day: 'Fri', startTime: '11:00', endTime: '13:00' },
    ],
    location: 'Arts Center, Study Room B',
    createdBy: 'user-3',
    createdAt: '2025-03-26T09:15:00Z',
  },
  {
    id: 'group-4',
    name: 'Essay Workshop',
    course: courses[3],
    description: 'Peer review and essay writing strategies for our final papers.',
    tags: ['discussion', 'practice'],
    members: [users[4], users[6], users[7], users[1]],
    maxMembers: 6,
    timeSlots: [
      { day: 'Wed', startTime: '10:00', endTime: '12:00' },
      { day: 'Sat', startTime: '13:00', endTime: '15:00' },
    ],
    location: 'English Department Lounge',
    createdBy: 'user-5',
    createdAt: '2025-03-25T16:45:00Z',
  },
  {
    id: 'group-5',
    name: 'Data Structures Deep Dive',
    course: courses[6],
    description: 'Intensive review of data structures and algorithms for the upcoming exam.',
    tags: ['exam', 'practice'],
    members: [users[0], users[6], users[7]],
    maxMembers: 5,
    timeSlots: [
      { day: 'Mon', startTime: '18:00', endTime: '20:00' },
      { day: 'Thu', startTime: '18:00', endTime: '20:00' },
    ],
    location: 'Computer Science Lab',
    createdBy: 'user-7',
    createdAt: '2025-03-23T11:30:00Z',
  },
];

export const messages: Message[] = [
  {
    id: 'msg-1',
    groupId: 'group-1',
    userId: 'user-1',
    user: users[0],
    content: 'Hey everyone! Looking forward to our study session today.',
    timestamp: '2025-04-01T14:45:00Z',
  },
  {
    id: 'msg-2',
    groupId: 'group-1',
    userId: 'user-2',
    user: users[1],
    content: 'Me too! I\'m bringing my notes from last week\'s lecture.',
    timestamp: '2025-04-01T14:47:00Z',
  },
  {
    id: 'msg-3',
    groupId: 'group-1',
    userId: 'user-3',
    user: users[2],
    content: 'Could we spend extra time on derivatives? I\'m still struggling with the chain rule.',
    timestamp: '2025-04-01T14:50:00Z',
  },
  {
    id: 'msg-4',
    groupId: 'group-1',
    userId: 'user-1',
    user: users[0],
    content: 'Absolutely! I found a great video tutorial that really helped me, I\'ll share the link.',
    timestamp: '2025-04-01T14:52:00Z',
  },
];
