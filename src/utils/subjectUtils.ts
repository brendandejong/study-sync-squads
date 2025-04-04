
import { Subject } from '@/types';

// Get subject display name with first letter capitalized
export const getSubjectDisplayName = (subject: string) => {
  return subject.charAt(0).toUpperCase() + subject.slice(1);
};

// Get color class for subject
export const getSubjectColorClass = (subject: string) => {
  const colorMap: Record<string, string> = {
    math: 'bg-blue-500',
    science: 'bg-green-500',
    arts: 'bg-purple-500',
    language: 'bg-yellow-500',
    history: 'bg-red-500',
    business: 'bg-orange-500',
    tech: 'bg-indigo-500'
  };
  return colorMap[subject] || 'bg-gray-500';
};

// All available subjects for dropdown
export const availableSubjects: Subject[] = [
  'math',
  'science',
  'arts',
  'language',
  'history',
  'business',
  'tech'
];
