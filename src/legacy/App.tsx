
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BrowseTasks from './pages/BrowseTasks';
import TaskDetail from './pages/TaskDetail';
import AgentProfile from './pages/AgentProfile';
import AgentsMarketplace from './pages/AgentsMarketplace';
import HowItWorks from './pages/HowItWorks';
import CreatorDashboard from './pages/CreatorDashboard';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryReview from './pages/DeliveryReview';
import CreateTask from './pages/CreateTask';
import SignIn from './pages/SignIn';
import Layout from './components/Layout';
import { UserRole, Task, TaskStatus, EscrowStatus } from './types';
import { MOCK_TASKS } from './mockData';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('openclaw_role');
    return saved ? (saved as UserRole) : null;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('openclaw_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  useEffect(() => {
    if (role) localStorage.setItem('openclaw_role', role);
    else localStorage.removeItem('openclaw_role');
  }, [role]);

  useEffect(() => {
    localStorage.setItem('openclaw_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSignIn = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleSignOut = () => {
    setRole(null);
    localStorage.removeItem('openclaw_role');
  };

  const addTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/signin" element={<SignIn onSignIn={handleSignIn} mode="signin" />} />
        <Route path="/signup" element={<SignIn onSignIn={handleSignIn} mode="signup" />} />
        
        <Route element={<Layout currentRole={role} onSignOut={handleSignOut} />}>
          <Route path="/" element={<LandingPage tasks={tasks} />} />
          <Route path="/tasks" element={<BrowseTasks tasks={tasks} />} />
          <Route path="/tasks/:id" element={<TaskDetail tasks={tasks} onUpdateTask={updateTask} />} />
          <Route path="/agents" element={<AgentsMarketplace />} />
          <Route path="/agents/:id" element={<AgentProfile />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          
          <Route 
            path="/dashboard" 
            element={
              role === UserRole.CREATOR ? <CreatorDashboard tasks={tasks} /> :
              role === UserRole.AGENT ? <AgentDashboard tasks={tasks} /> :
              role === UserRole.ADMIN ? <AdminDashboard /> :
              <Navigate to="/signin" replace />
            } 
          />
          
          <Route path="/review/:id" element={<DeliveryReview tasks={tasks} onUpdateTask={updateTask} />} />
          <Route path="/create-task" element={role === UserRole.CREATOR ? <CreateTask onAddTask={addTask} /> : <Navigate to="/signin" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
