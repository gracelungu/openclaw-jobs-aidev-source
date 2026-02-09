
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus } from '../types';

interface AgentDashboardProps {
  tasks: Task[];
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({ tasks }) => {
  const navigate = useNavigate();

  const myTasks = tasks.filter(t => t.assignedAgentId === 'a1');

  const totalEarnings = myTasks
    .filter(t => t.status === TaskStatus.APPROVED)
    .reduce((acc, t) => acc + t.budgetMax, 0);

  return (
    <div className="space-y-6 md:space-y-10 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight truncate">Agent Node</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium italic">Monitor active protocol contracts.</p>
        </div>
        <button onClick={() => navigate('/tasks')} className="w-full md:w-auto bg-white text-background-dark hover:bg-primary hover:text-white transition-all font-black px-6 md:px-8 py-3 md:py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-2xl shadow-black/40 uppercase tracking-widest text-xs md:text-sm">
          <span className="material-symbols-outlined text-lg">explore</span>
          Find Tasks
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Earnings', val: `$${totalEarnings.toLocaleString()}`, color: 'emerald-500', icon: 'payments' },
          { label: 'Active', val: `${myTasks.length} Units`, color: 'primary', icon: 'description' },
          { label: 'Reputation', val: '99.4%', color: 'blue-500', icon: 'verified' },
        ].map((stat, i) => (
          <div key={i} className="bg-card-dark border border-border-dark p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-4 -right-4 size-20 bg-white/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
               <div className={`p-2.5 bg-${stat.color}/10 text-${stat.color} rounded-2xl`}>
                 <span className="material-symbols-outlined text-xl">{stat.icon}</span>
               </div>
            </div>
            <p className="text-2xl md:text-3xl font-black text-white truncate">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
         <div className="border-b border-border-dark flex gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-px">
            {['Active Contracts', 'Proposals', 'History'].map((tab, idx) => (
              <button key={tab} className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${idx === 0 ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-white'}`}>
                {tab}
              </button>
            ))}
         </div>

         <div className="grid grid-cols-1 gap-4 md:gap-6">
            {myTasks.length > 0 ? myTasks.map((task) => (
              <div key={task.id} className="bg-card-dark border border-border-dark rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all shadow-2xl group">
                 <div className="p-6 md:p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6 md:gap-8">
                    <div className="flex gap-4 md:gap-6 min-w-0">
                       <div className="size-12 md:size-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-border-dark flex-shrink-0">
                          <span className="material-symbols-outlined text-2xl md:text-3xl">api</span>
                       </div>
                       <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                             <h3 className="text-xl md:text-2xl font-black text-white leading-none truncate">{task.title}</h3>
                             <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                               {task.status}
                             </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
                             <span className="flex items-center gap-2 whitespace-nowrap"><span className="material-symbols-outlined text-sm">person</span> Creator #{task.creatorId}</span>
                             <span className="flex items-center gap-2 whitespace-nowrap"><span className="material-symbols-outlined text-sm">payments</span> ${task.budgetMax}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 w-full xl:w-auto">
                       <button onClick={() => navigate(`/tasks/${task.id}`)} className="flex-1 xl:flex-none px-4 md:px-8 py-3 md:py-3.5 border border-border-dark text-slate-400 font-bold rounded-2xl hover:bg-white/5 hover:text-white transition-all text-sm whitespace-nowrap">Brief</button>
                       <button onClick={() => navigate(`/review/${task.id}`)} className="flex-1 xl:flex-none px-4 md:px-8 py-3 md:py-3.5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-sm whitespace-nowrap">Submit</button>
                    </div>
                 </div>
              </div>
            )) : (
              <div className="p-16 text-center bg-card-dark border border-border-dark rounded-[2.5rem] italic text-slate-500 text-sm">
                No active protocol items found.
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
