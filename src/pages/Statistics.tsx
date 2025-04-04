
import { useState } from 'react';
import Header from '@/components/Header';
import { useStats, StudyGoal } from '@/hooks/useStats';
import { useCourses } from '@/hooks/useCourses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart as BarChartIcon, 
  Target, 
  Clock, 
  BookOpen, 
  Calendar, 
  Flame, 
  Plus,
  Edit,
  Trash
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

  const getMostStudiedCourseName = () => {
    const course = courses.find(c => c.id === stats.mostStudiedCourse);
    return course ? `${course.code}: ${course.name}` : "None selected";
  };

  const [studyTypeData, setStudyTypeData] = useState([
    { name: 'Quiet', value: 40, color: '#93c5fd' },
    { name: 'Discussion', value: 25, color: '#c4b5fd' },
    { name: 'Flashcards', value: 15, color: '#fcd34d' },
    { name: 'Practice', value: 10, color: '#86efac' },
    { name: 'Exam Prep', value: 10, color: '#fda4af' }
  ]);

  const [weeklyProgressData, setWeeklyProgressData] = useState([
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
  
  const updateChartData = (chartData, index, newValue) => {
    const updatedData = [...chartData];
    updatedData[index] = { ...updatedData[index], ...newValue };
    return updatedData;
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="card-gradient">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-blue-500" />
                      Total Study Time
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsStatsDialogOpen(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700">{stats.totalHours.toFixed(1)}h</div>
                  <p className="text-sm text-muted-foreground">
                    {stats.weeklyHours.toFixed(1)}h this week
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-gradient">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-purple-500" />
                      Most Studied
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsStatsDialogOpen(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-purple-700 truncate">
                    {getMostStudiedCourseName()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Preferred style: {stats.preferredStudyType}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-gradient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Target className="mr-2 h-5 w-5 text-green-500" />
                    Goal Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-green-700">
                    {goals.length} active goals
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {goals.filter(g => g.completedHours >= g.targetHours).length} completed
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-gradient">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Flame className="mr-2 h-5 w-5 text-orange-500" />
                      Study Streak
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsStatsDialogOpen(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-700">{stats.streak} days</div>
                  <p className="text-sm text-muted-foreground">
                    Keep it up!
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-gradient h-[400px] md:h-[350px]">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <BarChartIcon className="mr-2 h-5 w-5 text-blue-500" />
                      Weekly Progress
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => {
                      toast({
                        title: "Edit Weekly Data",
                        description: "Use the 'Log Session' button to record study time which will update this chart"
                      });
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>Hours studied per day this week</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 h-[calc(100%-70px)]">
                  <div className="w-full h-full">
                    <ChartContainer 
                      config={{
                        hours: { color: "#93c5fd" }
                      }}
                    >
                      <BarChart data={weeklyProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="hours" fill="var(--color-hours, #93c5fd)" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-gradient h-[400px] md:h-[350px]">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                      Study Method Distribution
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => {
                      toast({
                        title: "Edit Study Methods",
                        description: "Use the 'Log Session' button to record your study methods which will update this chart"
                      });
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>Your preferred study methods</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 h-[calc(100%-70px)]">
                  <div className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Pie
                          data={studyTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {studyTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <Card key={goal.id} className="card-gradient">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-medium">{goal.title}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDeleteGoal(goal.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>
                        Target: {goal.targetHours} hours • Due: {new Date(goal.deadline).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress: {goal.completedHours}/{goal.targetHours} hours</span>
                          <span className="font-medium">{Math.round((goal.completedHours / goal.targetHours) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(goal.completedHours / goal.targetHours) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 p-8 text-center bg-blue-50 rounded-lg">
                  <p className="text-gray-500">No study goals yet. Add your first goal to start tracking your progress!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Study Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Complete Calculus Review"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Target Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  step="0.5"
                  value={newGoal.targetHours}
                  onChange={(e) => setNewGoal({ ...newGoal, targetHours: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGoalDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddGoal}>Add Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Study Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <select 
                  id="course"
                  className="w-full border border-gray-300 rounded-md h-10 px-3 py-2"
                  value={studySession.courseId}
                  onChange={(e) => setStudySession({ ...studySession, courseId: e.target.value })}
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code}: {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={studySession.duration}
                  onChange={(e) => setStudySession({ ...studySession, duration: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Study Type</Label>
                <select
                  id="type"
                  className="w-full border border-gray-300 rounded-md h-10 px-3 py-2"
                  value={studySession.tags[0]}
                  onChange={(e) => setStudySession({ ...studySession, tags: [e.target.value] })}
                >
                  <option value="quiet">Quiet</option>
                  <option value="discussion">Discussion</option>
                  <option value="flashcards">Flashcards</option>
                  <option value="practice">Practice</option>
                  <option value="exam">Exam Prep</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={studySession.date}
                  onChange={(e) => setStudySession({ ...studySession, date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSessionDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSession}>Log Session</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Study Insights</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="totalHours">Total Hours Studied</Label>
                <Input
                  id="totalHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={editedStats.totalHours}
                  onChange={(e) => setEditedStats({ ...editedStats, totalHours: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyHours">Hours Studied This Week</Label>
                <Input
                  id="weeklyHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={editedStats.weeklyHours}
                  onChange={(e) => setEditedStats({ ...editedStats, weeklyHours: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="streak">Study Streak (days)</Label>
                <Input
                  id="streak"
                  type="number"
                  min="0"
                  value={editedStats.streak}
                  onChange={(e) => setEditedStats({ ...editedStats, streak: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studyType">Preferred Study Type</Label>
                <select
                  id="studyType"
                  className="w-full border border-gray-300 rounded-md h-10 px-3 py-2"
                  value={editedStats.preferredStudyType}
                  onChange={(e) => setEditedStats({ ...editedStats, preferredStudyType: e.target.value })}
                >
                  <option value="quiet">Quiet</option>
                  <option value="discussion">Discussion</option>
                  <option value="flashcards">Flashcards</option>
                  <option value="practice">Practice</option>
                  <option value="exam">Exam Prep</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStatsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateStats}>Update Stats</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Study Goal</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this goal? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteGoal}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Insights;
