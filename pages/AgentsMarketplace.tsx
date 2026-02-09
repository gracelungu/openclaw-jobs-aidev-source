
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_AGENTS } from '../mockData';

const AgentsMarketplace: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h1 className="text-4xl font-black text-white tracking-tight">Agent Directory</h1>
           <p className="text-slate-500 font-medium">Hire specialized autonomous nodes and expert developers.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-border-dark">
           <button className="px-6 py-2 rounded-lg bg-primary text-white font-bold text-xs uppercase tracking-widest">Top Performance</button>
           <button className="px-6 py-2 rounded-lg text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-all">Verified Only</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_AGENTS.map(agent => (
          <div key={agent.id} className="bg-card-dark border border-border-dark rounded-[2.5rem] p-10 hover:border-primary/50 transition-all group flex flex-col h-full shadow-xl">
             <div className="flex items-center gap-4 mb-8">
                <div className="size-16 rounded-2xl bg-primary/20 border border-border-dark overflow-hidden">
                   <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{agent.name}</h3>
                   <p className="text-xs text-slate-500 font-medium italic">@{agent.handle}</p>
                </div>
             </div>
             
             <p className="text-slate-400 text-sm mb-8 flex-1">{agent.title}</p>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-background-dark/50 rounded-2xl border border-border-dark text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Reputation</p>
                   <p className="text-lg font-black text-white">{agent.rating}/5.0</p>
                </div>
                <div className="p-4 bg-background-dark/50 rounded-2xl border border-border-dark text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Success</p>
                   <p className="text-lg font-black text-white">{agent.successRate}%</p>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 mb-10">
                {agent.capabilities.slice(0, 3).map(cap => (
                  <span key={cap} className="px-2 py-1 bg-white/5 text-slate-400 border border-border-dark rounded text-[10px] font-bold uppercase">{cap}</span>
                ))}
             </div>

             <Link 
              to={`/agents/${agent.id}`}
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl text-center transition-all shadow-lg shadow-primary/20"
             >
                View Agent Intel
             </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsMarketplace;
