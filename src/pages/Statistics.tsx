
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
import { useToast } from '@/components/ui/use-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart as BarChartIcon, 
  Target, 
  Clock, 
  BookOpen, 
  Calendar, 
  Fire, 
  Plus 
} from 'lucide-react';

const Statistics = () => {
  const { toast } = useToast();
  const { goals, stats, addGoal } = useStats();
  const { courses } = useCourses();

  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<StudyGoal>>({
    title: '',
    targetHours: 10,
    completedHours: 0,
    deadline: new Date().toISOString().split('T')[0]
  });

  // Find course names for stats
  const getMostStudiedCourseName = () => {
    const course = courses.find(c => c.id === stats.mostStudiedCourse);
    return course ? `${course.code}: ${course.name}` : "Unknown Course";
  };

  // Prepare data for pie chart
  const studyTypeData = [
    { name: 'Quiet', value: 40, color: '#93c5fd' },
    { name: 'Discussion', value: 25, color: '#c4b5fd' },
    { name: 'Flashcards', value: 15, color: '#fcd34d' },
    { name: 'Practice', value: 10, color: '#86efac' },
    { name: 'Exam Prep', value: 10, color: '#fda4af' }
  ];

  // Prepare data for bar chart
  const weeklyProgressData = [
    { name: 'Mon', hours: 1.5 },
    { name: 'Tue', hours: 2.0 },
    { name: 'Wed', hours: 0.5 },
    { name: 'Thu', hours: 1.0 },
    { name: 'Fri', hours: 1.5 },
    { name: 'Sat', hours: 0 },
    { name: 'Sun', hours: 0 }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-blue">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-4 rounded-lg bg-white bg-opacity-70 backdrop-blur-sm shadow-sm">
          <h1 className="text-2xl font-bold text-blue-800">Study Statistics</h1>
          <Button onClick={() => setIsGoalDialogOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 btn-hover-effect">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="card-gradient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Total Study Time
                  </CardTitle>
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
                  <CardTitle className="text-lg font-medium flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-purple-500" />
                    Most Studied
                  </CardTitle>
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
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Fire className="mr-2 h-5 w-5 text-orange-500" />
                    Study Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-700">{stats.streak} days</div>
                  <p className="text-sm text-muted-foreground">
                    Keep it up!
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChartIcon className="mr-2 h-5 w-5 text-blue-500" />
                    Weekly Progress
                  </CardTitle>
                  <CardDescription>Hours studied per day this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ChartContainer 
                      config={{
                        hours: { color: "#93c5fd" }
                      }}
                    >
                      <BarChart data={weeklyProgressData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="hours" fill="var(--color-hours, #93c5fd)" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                    Study Method Distribution
                  </CardTitle>
                  <CardDescription>Your preferred study methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
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
              {goals.map((goal) => (
                <Card key={goal.id} className="card-gradient">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">{goal.title}</CardTitle>
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Add Goal Dialog */}
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
      </main>
    </div>
  );
};

export default Statistics;
