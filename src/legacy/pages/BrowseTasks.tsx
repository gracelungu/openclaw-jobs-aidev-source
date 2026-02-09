
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../types';

interface BrowseTasksProps {
  tasks: Task[];
}

const BrowseTasks: React.FC<BrowseTasksProps> = ({ tasks }) => {
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
      {/* Filters Sidebar */}
      <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">filter_list</span>
            Market Filters
          </h3>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</p>
              <div className="space-y-3">
                {['Development', 'Design', 'Data Science', 'Security', 'Marketing'].map(cat => (
                  <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 bg-card-dark border-border-dark text-primary focus:ring-0 rounded cursor-pointer" />
                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Budget Range</p>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Min" className="bg-card-dark border-border-dark rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary" />
                <input type="number" placeholder="Max" className="bg-card-dark border-border-dark rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verification</p>
              <label className="flex items-center gap-3 group cursor-pointer">
                <input type="checkbox" className="w-5 h-5 bg-card-dark border-border-dark text-primary focus:ring-0 rounded cursor-pointer" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Verified Clients Only</span>
              </label>
            </div>
          </div>
        </div>
        <button className="w-full py-3 bg-card-dark border border-border-dark text-white font-bold rounded-xl hover:bg-white/5 transition-all">
          Reset All Filters
        </button>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Browse Marketplace</h2>
            <p className="text-slate-500 font-medium">{filteredTasks.length} available tasks match your search</p>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="relative mb-2">
                <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-lg">search</span>
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-card-dark border-border-dark rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary text-white" 
                  placeholder="Search tasks..." 
                />
             </div>
             <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sort:</span>
                <select className="bg-transparent border-none text-primary font-bold text-sm focus:ring-0 cursor-pointer">
                   <option>Newest First</option>
                   <option>Highest Bounty</option>
                   <option>Soonest Deadline</option>
                </select>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredTasks.map(task => (
            <Link key={task.id} to={`/tasks/${task.id}`} className="bg-card-dark border border-border-dark p-6 rounded-2xl hover:border-primary/50 transition-all group relative block">
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[10px] font-black uppercase tracking-widest">{task.escrowStatus}</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-black uppercase tracking-widest">{task.status}</span>
                 </div>
                 <button className="text-slate-500 hover:text-white">
                   <span className="material-symbols-outlined text-xl">bookmark</span>
                 </button>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight">{task.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed">{task.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {task.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 text-slate-400 rounded-lg text-xs font-bold">{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border-dark">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Range</span>
                    <span className="text-xl font-black text-white">${task.budgetMin} - ${task.budgetMax}</span>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deadline</span>
                    <span className="block text-sm font-bold text-slate-200">{task.deadline}</span>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BrowseTasks;
