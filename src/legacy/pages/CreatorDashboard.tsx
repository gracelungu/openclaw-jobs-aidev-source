
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus } from '../types';

interface CreatorDashboardProps {
  tasks: Task[];
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ tasks }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('All');

  const filteredTasks = activeTab === 'All' ? tasks : tasks.filter(t => t.status === activeTab);

  const totalSpent = tasks
    .filter(t => t.status === TaskStatus.APPROVED)
    .reduce((acc, t) => acc + t.budgetMax, 0);

  const activeCount = tasks.filter(t => t.status !== TaskStatus.APPROVED).length;

  return (
    <div className="space-y-6 md:space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">Creator Board</h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium italic">Active protocol task management.</p>
        </div>
        <button 
          onClick={() => navigate('/create-task')}
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-black px-6 md:px-8 py-3 md:py-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xl shadow-primary/20 transition-all text-xs uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Deploy Task
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { label: 'Budget Used', val: `$${totalSpent.toLocaleString()}` },
          { label: 'Live Tasks', val: activeCount },
          { label: 'In Bidding', val: tasks.filter(t => t.status === TaskStatus.BIDDING || t.status === TaskStatus.OPEN).length },
          { label: 'Verified', val: tasks.filter(t => t.status === TaskStatus.APPROVED).length },
        ].map((stat, i) => (
          <div key={i} className="bg-card-dark border border-border-dark p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl">
            <span className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{stat.label}</span>
            <p className="text-base md:text-2xl font-black text-white truncate">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
         <div className="border-b border-border-dark flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-px">
            {['All', ...Object.values(TaskStatus)].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
         </div>

         <div className="bg-card-dark border border-border-dark rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
                  <thead>
                    <tr className="bg-background-dark/30 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-border-dark">
                      <th className="px-6 md:px-8 py-4 md:py-5">Task Identity</th>
                      <th className="px-6 md:px-8 py-4 md:py-5">Status</th>
                      <th className="hidden sm:table-cell px-6 md:px-8 py-4 md:py-5">Escrow</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dark">
                    {filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 md:px-8 py-4 md:py-6">
                           <div className="min-w-0">
                              <p className="text-xs md:text-sm font-black text-white truncate max-w-[150px] md:max-w-xs">{task.title}</p>
                              <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase mt-1">{task.category}</p>
                           </div>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-6 whitespace-nowrap">
                           <span className="px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                              {task.status}
                           </span>
                        </td>
                        <td className="hidden sm:table-cell px-6 md:px-8 py-4 md:py-6 whitespace-nowrap">
                           <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-emerald-500">
                              {task.escrowStatus}
                           </span>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-6 text-right whitespace-nowrap">
                           <button onClick={() => navigate(`/tasks/${task.id}`)} className="bg-white/5 hover:bg-white/10 text-white text-[8px] md:text-[10px] font-black px-3 py-1.5 rounded-lg border border-border-dark uppercase tracking-widest mr-2">Brief</button>
                           {(task.status === TaskStatus.ASSIGNED || task.status === TaskStatus.SUBMITTED || task.status === TaskStatus.REVISION_REQUESTED) && (
                             <button onClick={() => navigate(`/review/${task.id}`)} className="bg-primary hover:bg-primary/90 text-white text-[8px] md:text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg shadow-primary/20 uppercase tracking-widest">Review</button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
               {filteredTasks.length === 0 && (
                 <div className="px-8 py-10 text-center text-slate-500 font-medium italic text-sm">No protocol items in this state.</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
