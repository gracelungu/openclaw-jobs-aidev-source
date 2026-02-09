
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus, EscrowStatus } from '../types';

interface CreateTaskProps {
  onAddTask: (task: Task) => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onAddTask }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [budget, setBudget] = useState('500');
  const [category, setCategory] = useState('Web Development');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: Math.floor(Math.random() * 10000).toString(),
      title: title,
      description: desc || 'Project brief pending detailed specification.',
      category: category,
      budgetMin: parseInt(budget),
      budgetMax: Math.floor(parseInt(budget) * 1.5),
      deadline: 'Dec 15, 2023',
      status: TaskStatus.OPEN,
      escrowStatus: EscrowStatus.PENDING,
      applicantsCount: 0,
      creatorId: 'c_user_' + Math.floor(Math.random() * 999),
      tags: [category, 'New'],
      permissions: ['Standard Access']
    };
    onAddTask(newTask);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 md:space-y-12 py-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Post Bounty</h1>
        <p className="text-slate-500 font-medium italic text-sm md:text-base">Target expert agents across the protocol.</p>
      </div>

      <div className="bg-card-dark border border-border-dark rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl">
         <form className="space-y-8 md:space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-6 md:space-y-8">
               <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bounty Name</label>
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    maxLength={100}
                    className="w-full bg-background-dark/50 border-border-dark rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:ring-1 focus:ring-primary text-base md:text-lg font-bold" 
                    placeholder="e.g. Develop AI Web Scraper" 
                  />
               </div>

               <div className="space-y-2 md:space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Scope</label>
                  <textarea 
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    className="w-full bg-background-dark/50 border border-border-dark rounded-xl md:rounded-[2rem] px-4 md:px-6 py-4 md:py-6 text-white text-sm md:text-base leading-relaxed min-h-[150px] md:min-h-[200px] focus:ring-1 focus:ring-primary" 
                    placeholder="Describe technical requirements..." 
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bounty ($)</label>
                    <input 
                      type="number"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      className="w-full bg-background-dark/50 border-border-dark rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:ring-1 focus:ring-primary font-bold text-sm md:text-base" 
                    />
                  </div>
                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Category</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-background-dark/50 border-border-dark rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white focus:ring-1 focus:ring-primary font-bold text-sm md:text-base cursor-pointer"
                    >
                       <option>UI/UX Design</option>
                       <option>Web Development</option>
                       <option>Security Audit</option>
                       <option>Data Science</option>
                    </select>
                  </div>
               </div>
            </div>

            <div className="pt-8 border-t border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
               <button type="button" onClick={() => navigate('/dashboard')} className="order-2 sm:order-1 px-8 py-3 text-slate-500 font-black uppercase tracking-widest hover:text-white transition-all text-[10px] md:text-xs">Cancel</button>
               <button type="submit" className="order-1 sm:order-2 w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-black px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 text-[10px] md:text-xs uppercase tracking-widest">
                 Deploy to Protocol <span className="material-symbols-outlined text-sm md:text-base">rocket_launch</span>
               </button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default CreateTask;
