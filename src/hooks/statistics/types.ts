
export interface StudyGoal {
  id: string;
  title: string;
  targetHours: number;
  completedHours: number;
  deadline: string;
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // in minutes
  courseId: string;
  tags: string[];
}

export interface StudyStats {
  totalHours: number;
  weeklyHours: number;
  monthlyHours: number;
  preferredStudyType: string;
  preferredTime: string;
  streak: number;
  mostStudiedCourse: string;
  lastStudyDate: string | null;
}
