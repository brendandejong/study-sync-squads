
import { useState, useEffect } from 'react';
import { Course } from '@/types';
import { courses as defaultCourses } from '@/data/mockData';

export const useCourses = () => {
  // Load courses from localStorage, but include default courses as well
  const [courses, setCourses] = useState<Course[]>(() => {
    const savedCourses = localStorage.getItem('userCourses');
    const userCourses = savedCourses ? JSON.parse(savedCourses) : [];
    
    // Combine user courses with default courses, avoiding duplicates
    const combinedCourses = [...userCourses];
    
    // Add default courses if they don't already exist in user courses
    defaultCourses.forEach(defaultCourse => {
      if (!combinedCourses.some(course => course.id === defaultCourse.id)) {
        combinedCourses.push(defaultCourse);
      }
    });
    
    return combinedCourses;
  });

  // Save courses to localStorage whenever they change
  useEffect(() => {
    // Only save user-added courses (not the default ones)
    const userCourses = courses.filter(
      course => !defaultCourses.some(defaultCourse => defaultCourse.id === course.id)
    );
    localStorage.setItem('userCourses', JSON.stringify(userCourses));
  }, [courses]);

  // Add a new course
  const addCourse = (course: Course) => {
    const updatedCourses = [course, ...courses];
    setCourses(updatedCourses);
  };

  // Delete a course
  const deleteCourse = (courseId: string) => {
    // Don't allow deleting default courses
    if (defaultCourses.some(course => course.id === courseId)) {
      return;
    }
    const updatedCourses = courses.filter(course => course.id !== courseId);
    setCourses(updatedCourses);
  };

  return {
    courses,
    addCourse,
    deleteCourse
  };
};
