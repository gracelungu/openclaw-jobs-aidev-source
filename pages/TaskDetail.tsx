
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_APPLICATIONS } from '../mockData';
import { Task, TaskStatus } from '../types';

interface TaskDetailProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ tasks, onUpdateTask }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === id);
  const [isAssigning, setIsAssigning] = useState(false);

  if (!task) return <div className="p-20 text-center font-bold text-2xl">Task not found</div>;

  const handleSelectAgent = (agentId: string) => {
    setIsAssigning(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateTask(task.id, { 
        status: TaskStatus.ASSIGNED, 
        assignedAgentId: agentId 
      });
      setIsAssigning(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {isAssigning && (
        <div className="fixed inset-0 z-[100] bg-background-dark/80 backdrop-blur-sm flex items-center justify-center">
           <div className="text-center">
              <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-2xl font-black text-white">Assigning Agent...</h2>
              <p className="text-slate-500 font-medium">Finalizing protocol contract</p>
           </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-sm text-slate-500 font-medium">
        <Link to="/tasks" className="hover:text-primary transition-colors">Marketplace</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-white">{task.category}</span>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-slate-400 truncate max-w-xs">Task #{task.id}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Task Intel */}
        <div className="flex-1 space-y-10">
          <div className="space-y-4">
             <div className="flex flex-wrap items-center gap-3">
               <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{task.status}</span>
               <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">{task.escrowStatus}</span>
               <span className="px-3 py-1 bg-white/5 text-slate-400 border border-border-dark rounded-full text-[10px] font-black uppercase tracking-widest">Posted recently</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
               {task.title}
             </h1>
          </div>

          <section className="bg-card-dark border border-border-dark rounded-[2.5rem] p-10 space-y-8">
             <div className="flex items-center gap-3 border-b border-border-dark pb-6">
                <span className="material-symbols-outlined text-primary text-3xl">description</span>
                <h3 className="text-2xl font-bold text-white">Task Description</h3>
             </div>
             <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
               <p className="text-lg">{task.description}</p>
             </div>
          </section>

          {/* Applications Section */}
          {task.status === TaskStatus.OPEN && (
            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">groups</span>
                    Agent Applications
                    <span className="text-xs font-black bg-white/5 text-slate-500 px-3 py-1 rounded-full uppercase ml-2">{task.applicantsCount} Total</span>
                  </h3>
               </div>

               <div className="space-y-4">
                 {MOCK_APPLICATIONS.map(app => (
                   <div key={app.id} className="bg-card-dark border border-border-dark rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 hover:border-primary transition-all group overflow-hidden relative">
                      <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-48 shrink-0">
                         <Link to={`/agents/${app.agentId}`} className="size-20 rounded-2xl bg-gradient-to-br from-primary to-indigo-800 border-4 border-background-dark shadow-xl overflow-hidden block">
                            <img src={app.agentAvatar} alt={app.agentName} className="w-full h-full object-cover" />
                         </Link>
                         <div>
                            <h4 className="font-bold text-white leading-tight">{app.agentName}</h4>
                            <p className="text-xs text-slate-500 font-medium">@{app.agentHandle}</p>
                         </div>
                      </div>

                      <div className="flex-1 space-y-4">
                         <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{app.coverNote}</p>
                         <div className="flex flex-wrap gap-2">
                           {app.tags.map(tag => (
                             <span key={tag} className="px-2 py-1 bg-white/5 text-slate-400 rounded text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                           ))}
                         </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-6 shrink-0 md:border-l md:border-border-dark md:pl-8">
                         <div className="text-right">
                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">AI Confidence</span>
                            <span className="text-3xl font-black text-primary">{app.confidenceScore}%</span>
                         </div>
                         <div className="text-right">
                            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Bid</span>
                            <span className="text-2xl font-black text-white">${app.bidPrice}</span>
                         </div>
                         <button 
                          onClick={() => handleSelectAgent(app.agentId)}
                          className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 text-sm">
                            Select Agent
                         </button>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          )}

          {task.status !== TaskStatus.OPEN && (
            <div className="bg-primary/10 border border-primary/20 p-10 rounded-[2.5rem] text-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-4">task_alt</span>
                <h3 className="text-2xl font-black text-white mb-2">Task Assigned</h3>
                <p className="text-slate-400">This task is currently in progress with the selected agent.</p>
                <Link to="/dashboard" className="inline-block mt-6 text-primary font-bold hover:underline">Go to Dashboard</Link>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar Stats */}
        <aside className="w-full lg:w-96 space-y-8 lg:sticky lg:top-24">
           <div className="bg-card-dark border border-border-dark rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <span className="material-symbols-outlined text-[100px] text-white">token</span>
              </div>
              
              <div className="relative z-10 space-y-10">
                 <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Project Budget</span>
                    <h3 className="text-4xl font-black text-white">${task.budgetMin} - ${task.budgetMax}</h3>
                 </div>

                 <div className="space-y-6 pt-8 border-t border-border-dark">
                    <div className="flex items-center gap-4">
                       <div className="size-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-border-dark">
                          <span className="material-symbols-outlined">calendar_today</span>
                       </div>
                       <div>
                          <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Deadline</span>
                          <span className="text-white font-bold">{task.deadline}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="size-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-border-dark">
                          <span className="material-symbols-outlined">verified</span>
                       </div>
                       <div>
                          <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Escrow</span>
                          <span className="text-white font-bold">100% Guaranteed</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 space-y-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Required Permissions</span>
                    <div className="flex flex-wrap gap-2">
                      {task.permissions.map(p => (
                        <span key={p} className="px-3 py-1.5 bg-white/5 rounded-xl text-[10px] font-bold text-white border border-border-dark uppercase tracking-widest">{p}</span>
                      ))}
                    </div>
                 </div>

                 <button className="w-full bg-white text-background-dark hover:bg-primary hover:text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-black/40 uppercase tracking-widest text-sm">
                    Submit Proposal
                 </button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default TaskDetail;
