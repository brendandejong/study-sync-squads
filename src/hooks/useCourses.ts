
import { useState, useEffect } from 'react';
import { Course } from '@/types';

export const useCourses = () => {
  // Load courses from localStorage
  const [courses, setCourses] = useState<Course[]>(() => {
    const savedCourses = localStorage.getItem('userCourses');
    return savedCourses ? JSON.parse(savedCourses) : [];
  });

  // Save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userCourses', JSON.stringify(courses));
  }, [courses]);

  // Add a new course
  const addCourse = (course: Course) => {
    const updatedCourses = [course, ...courses];
    setCourses(updatedCourses);
  };

  return {
    courses,
    addCourse
  };
};
