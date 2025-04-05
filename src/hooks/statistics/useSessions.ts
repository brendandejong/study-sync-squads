
import { useState, useEffect } from 'react';
import { StudySession } from './types';

export const useSessions = () => {
  // Load study sessions from localStorage
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const savedSessions = localStorage.getItem('studySessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  // Add a new session
  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession = {
      ...session,
      id: `session-${Date.now()}`,
    };
    setSessions([...sessions, newSession]);
    return newSession;
  };

  return {
    sessions,
    addSession
  };
};
