
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task, TaskStatus, EscrowStatus } from '../types';

interface DeliveryReviewProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

const DeliveryReview: React.FC<DeliveryReviewProps> = ({ tasks, onUpdateTask }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === id) || tasks[0];
  const [activeFile, setActiveFile] = useState('main_logic.py');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (isApprove: boolean) => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpdateTask(task.id, {
        status: isApprove ? TaskStatus.APPROVED : TaskStatus.IN_PROGRESS,
        escrowStatus: isApprove ? EscrowStatus.RELEASED : EscrowStatus.FUNDED
      });
      setIsProcessing(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="space-y-6 md:space-y-10 pb-40 md:pb-48 animate-fade-in relative">
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-background-dark/80 backdrop-blur-sm flex items-center justify-center">
           <div className="text-center">
              <div className="size-12 md:size-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl md:text-2xl font-black text-white">Syncing Ledger...</h2>
              <p className="text-slate-500 font-medium text-xs md:text-sm">Updating on-chain escrow status</p>
           </div>
        </div>
      )}

      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 overflow-hidden whitespace-nowrap">
        <span className="text-white flex-shrink-0">Review</span>
        <span className="material-symbols-outlined text-sm flex-shrink-0">chevron_right</span>
        <span className="truncate">{task.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
        <div className="flex-1 space-y-6 md:space-y-10 min-w-0">
           <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                 <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">Delivery Review</h1>
                 <p className="text-slate-500 font-medium italic mt-1 text-sm md:text-base">Locked Bounty: <span className="text-emerald-500 font-bold">${task.budgetMax}</span></p>
              </div>
           </div>

           <div className="bg-card-dark border border-border-dark rounded-[2rem] p-6 md:p-8 shadow-xl">
              <h3 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary">chat_bubble</span>
                 Agent Brief
              </h3>
              <div className="bg-background-dark/50 border border-border-dark p-4 md:p-6 rounded-2xl italic text-slate-400 text-sm md:text-base leading-relaxed">
                 "Implementation successfully verified against protocol test suite."
              </div>
           </div>

           <div className="bg-card-dark border border-border-dark rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="px-6 md:px-10 py-4 md:py-6 border-b border-border-dark bg-background-dark/30 flex items-center justify-between">
                 <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2 md:gap-3">
                    <span className="material-symbols-outlined text-primary">inventory_2</span>
                    Artifacts
                 </h3>
              </div>
              <div className="flex flex-col sm:flex-row sm:h-[400px]">
                 <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-border-dark bg-background-dark/30 p-4 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto no-scrollbar">
                    {['main_logic.py', 'settings.yaml', 'POW.json'].map(file => (
                      <button 
                        key={file} 
                        onClick={() => setActiveFile(file)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap flex-shrink-0 sm:flex-shrink ${activeFile === file ? 'bg-primary/10 text-primary border border-primary/20' : 'text-slate-500 hover:text-white'}`}
                      >
                         <span className="material-symbols-outlined text-base">description</span>
                         <span className="text-xs font-bold truncate">{file}</span>
                      </button>
                    ))}
                 </div>
                 <div className="flex-1 bg-[#0d0a1a] p-6 md:p-8 font-mono text-[10px] md:text-xs overflow-auto custom-scrollbar leading-relaxed">
                    <pre className="text-blue-300">
{`# Artifact: ${activeFile}
# Protocol delivery verified.

def run_protocol():
    # Final execution logic
    pass`}
                    </pre>
                 </div>
              </div>
           </div>
        </div>

        <aside className="w-full lg:w-80 space-y-6">
           <div className="bg-card-dark border border-border-dark rounded-[2rem] p-6 shadow-xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-border-dark pb-3">Trace Log</h3>
              <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-0 before:w-px before:bg-border-dark">
                 <div className="relative pl-10">
                    <div className="absolute left-0 top-0 size-8 rounded-full bg-background-dark border-2 border-border-dark flex items-center justify-center text-emerald-500 z-10">
                       <span className="material-symbols-outlined text-base">check_circle</span>
                    </div>
                    <p className="text-xs font-bold text-white">Delivered</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Status: Verified</p>
                 </div>
              </div>
           </div>
        </aside>
      </div>

      {/* Persistent Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 z-50 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent pointer-events-none">
         <div className="max-w-5xl mx-auto bg-card-dark border border-primary/30 p-4 md:p-6 rounded-[2rem] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8 backdrop-blur-xl pointer-events-auto border-b-primary/50">
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <div className="size-10 md:size-14 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 flex-shrink-0">
                  <span className="material-symbols-outlined text-xl md:text-3xl">verified</span>
               </div>
               <div className="min-w-0">
                  <h4 className="text-base md:text-xl font-black text-white truncate leading-none mb-1">Final Verdict</h4>
                  <p className="text-slate-500 font-medium text-[9px] md:text-xs">Releasing funds is irreversible.</p>
               </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <button onClick={() => handleAction(false)} className="flex-1 sm:flex-none px-6 py-3 border border-border-dark text-white font-black rounded-xl hover:bg-white/5 transition-all text-[10px] uppercase tracking-widest whitespace-nowrap">Revision</button>
               <button onClick={() => handleAction(true)} className="flex-1 sm:flex-none px-6 py-3 bg-primary text-white font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-[10px] uppercase tracking-widest whitespace-nowrap">Approve & Pay</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DeliveryReview;
