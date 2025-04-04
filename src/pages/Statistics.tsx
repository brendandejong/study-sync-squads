
import { useState } from 'react';
import Header from '@/components/Header';
import { useStats, StudyGoal } from '@/hooks/useStats';
import { useCourses } from '@/hooks/useCourses';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Clock, Plus } from 'lucide-react';

// Import our new components
import StatsOverview from '@/components/statistics/StatsOverview';
import ChartSection from '@/components/statistics/ChartSection';
import GoalList from '@/components/statistics/GoalList';
import AddGoalDialog from '@/components/statistics/dialogs/AddGoalDialog';
import LogSessionDialog from '@/components/statistics/dialogs/LogSessionDialog';
import EditStatsDialog from '@/components/statistics/dialogs/EditStatsDialog';
import DeleteGoalDialog from '@/components/statistics/dialogs/DeleteGoalDialog';

const Insights = () => {
  const { toast } = useToast();
  const { goals, stats, addGoal, updateStats, logStudySession, deleteGoal } = useStats();
  const { courses } = useCourses();

  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  
  const [newGoal, setNewGoal] = useState<Partial<StudyGoal>>({
    title: '',
    targetHours: 10,
    completedHours: 0,
    deadline: new Date().toISOString().split('T')[0]
  });
  
  const [studySession, setStudySession] = useState({
    duration: 0,
    courseId: '',
    tags: ['quiet'],
    date: new Date().toISOString().split('T')[0]
  });
  
  const [editedStats, setEditedStats] = useState({
    totalHours: stats.totalHours,
    weeklyHours: stats.weeklyHours,
    streak: stats.streak,
    preferredStudyType: stats.preferredStudyType
  });

  const [studyTypeData] = useState([
    { name: 'Quiet', value: 40, color: '#93c5fd' },
    { name: 'Discussion', value: 25, color: '#c4b5fd' },
    { name: 'Flashcards', value: 15, color: '#fcd34d' },
    { name: 'Practice', value: 10, color: '#86efac' },
    { name: 'Exam Prep', value: 10, color: '#fda4af' }
  ]);

  const [weeklyProgressData] = useState([
    { name: 'Mon', hours: 0 },
    { name: 'Tue', hours: 0 },
    { name: 'Wed', hours: 0 },
    { name: 'Thu', hours: 0 },
    { name: 'Fri', hours: 0 },
    { name: 'Sat', hours: 0 },
    { name: 'Sun', hours: 0 }
  ]);

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetHours) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addGoal(newGoal as Omit<StudyGoal, 'id'>);
    setIsGoalDialogOpen(false);
    setNewGoal({
      title: '',
      targetHours: 10,
      completedHours: 0,
      deadline: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Goal added",
      description: "Your study goal has been added successfully"
    });
  };
  
  const handleAddSession = () => {
    if (!studySession.courseId || studySession.duration <= 0) {
      toast({
        title: "Missing information",
        description: "Please select a course and enter a valid duration",
        variant: "destructive"
      });
      return;
    }
    
    logStudySession({
      date: studySession.date,
      duration: studySession.duration,
      courseId: studySession.courseId,
      tags: [studySession.tags[0]]
    });
    
    setIsSessionDialogOpen(false);
    setStudySession({
      duration: 0,
      courseId: '',
      tags: ['quiet'],
      date: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Session logged",
      description: "Your study session has been recorded"
    });
  };
  
  const handleUpdateStats = () => {
    updateStats({
      ...stats,
      ...editedStats
    });
    
    setIsStatsDialogOpen(false);
    
    toast({
      title: "Stats updated",
      description: "Your insights have been updated successfully"
    });
  };
  
  const confirmDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteGoal = () => {
    if (goalToDelete) {
      deleteGoal(goalToDelete);
      setIsDeleteDialogOpen(false);
      setGoalToDelete(null);
      
      toast({
        title: "Goal deleted",
        description: "Your study goal has been removed successfully"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-blue">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 rounded-lg bg-white bg-opacity-70 backdrop-blur-sm shadow-sm">
          <h1 className="text-2xl font-bold text-blue-800">Study Insights</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsSessionDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 btn-hover-effect">
              <Clock className="h-4 w-4 mr-2" />
              Log Session
            </Button>
            <Button onClick={() => setIsGoalDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 btn-hover-effect">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-blue-50 mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              Overview
            </TabsTrigger>
            <TabsTrigger value="goals" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
              Study Goals
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <StatsOverview 
              stats={stats} 
              goals={goals} 
              courses={courses} 
              onEditStats={() => setIsStatsDialogOpen(true)} 
            />
            
            <ChartSection 
              weeklyProgressData={weeklyProgressData}
              studyTypeData={studyTypeData}
            />
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-6">
            <GoalList 
              goals={goals} 
              onDeleteGoal={confirmDeleteGoal} 
            />
          </TabsContent>
        </Tabs>
        
        <AddGoalDialog 
          open={isGoalDialogOpen}
          onOpenChange={setIsGoalDialogOpen}
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          onAddGoal={handleAddGoal}
        />
        
        <LogSessionDialog 
          open={isSessionDialogOpen}
          onOpenChange={setIsSessionDialogOpen}
          studySession={studySession}
          setStudySession={setStudySession}
          onAddSession={handleAddSession}
        />
        
        <EditStatsDialog 
          open={isStatsDialogOpen}
          onOpenChange={setIsStatsDialogOpen}
          editedStats={editedStats}
          setEditedStats={setEditedStats}
          onUpdateStats={handleUpdateStats}
        />
        
        <DeleteGoalDialog 
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirmDelete={handleDeleteGoal}
        />
      </main>
    </div>
  );
};

export default Insights;
