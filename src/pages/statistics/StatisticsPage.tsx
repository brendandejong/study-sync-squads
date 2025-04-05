
import React from 'react';
import Header from '@/components/Header';
import { useStatisticsPage } from './hooks/useStatisticsPage';
import StatisticsHeader from './components/StatisticsHeader';
import StatisticsTabs from './components/StatisticsTabs';
import StatisticsDialogs from './components/StatisticsDialogs';

const StatisticsPage = () => {
  const {
    // Data
    goals,
    stats,
    courses,
    studyTypeData,
    weeklyProgressData,
    sessions,
    
    // Dialog states
    isGoalDialogOpen,
    setIsGoalDialogOpen,
    isStatsDialogOpen,
    setIsStatsDialogOpen,
    isSessionDialogOpen, 
    setIsSessionDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    
    // Form states
    newGoal,
    setNewGoal,
    studySession,
    setStudySession,
    editedStats,
    setEditedStats,
    
    // Event handlers
    handleAddGoal,
    handleAddSession,
    handleUpdateStats,
    confirmDeleteGoal,
    handleDeleteGoal,
    handleCompleteGoal,
    handleUpdateGoalProgress
  } = useStatisticsPage();

  return (
    <div className="min-h-screen bg-gradient-blue">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <StatisticsHeader
          onLogSession={() => setIsSessionDialogOpen(true)}
          onAddGoal={() => setIsGoalDialogOpen(true)}
        />
        
        <StatisticsTabs
          stats={stats}
          goals={goals}
          courses={courses}
          weeklyProgressData={weeklyProgressData}
          studyTypeData={studyTypeData}
          sessions={sessions}
          onEditStats={() => setIsStatsDialogOpen(true)}
          onDeleteGoal={confirmDeleteGoal}
          onCompleteGoal={handleCompleteGoal}
          onUpdateGoalProgress={handleUpdateGoalProgress}
        />
        
        <StatisticsDialogs
          isGoalDialogOpen={isGoalDialogOpen}
          setIsGoalDialogOpen={setIsGoalDialogOpen}
          isStatsDialogOpen={isStatsDialogOpen}
          setIsStatsDialogOpen={setIsStatsDialogOpen}
          isSessionDialogOpen={isSessionDialogOpen}
          setIsSessionDialogOpen={setIsSessionDialogOpen}
          isDeleteDialogOpen={isDeleteDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          
          newGoal={newGoal}
          setNewGoal={setNewGoal}
          studySession={studySession}
          setStudySession={setStudySession}
          editedStats={editedStats}
          setEditedStats={setEditedStats}
          
          onAddGoal={handleAddGoal}
          onAddSession={handleAddSession}
          onUpdateStats={handleUpdateStats}
          onConfirmDelete={handleDeleteGoal}
        />
      </main>
    </div>
  );
};

export default StatisticsPage;
