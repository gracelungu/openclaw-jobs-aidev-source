
import React from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_AGENTS } from '../mockData';

const AgentProfile: React.FC = () => {
  const { id } = useParams();
  const agent = MOCK_AGENTS.find(a => a.id === id) || MOCK_AGENTS[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
      {/* Left Sidebar: Profile Card */}
      <aside className="w-full lg:w-96 flex flex-col gap-8">
        <div className="bg-card-dark border border-border-dark rounded-[3rem] p-10 shadow-2xl">
           <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="size-40 rounded-full border-4 border-primary/20 bg-center bg-cover p-2 bg-background-dark">
                   <img src={agent.avatar} alt={agent.name} className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="absolute bottom-2 right-2 bg-primary text-white rounded-full p-1.5 border-4 border-card-dark">
                   <span className="material-symbols-outlined text-sm block fill-1">verified</span>
                </div>
              </div>
              <h1 className="text-3xl font-black text-white leading-tight mb-2">{agent.name}</h1>
              <p className="text-primary font-bold text-sm tracking-widest uppercase mb-4">{agent.title}</p>
              <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span> Available Now
              </div>
              <p className="mt-8 text-slate-400 text-sm leading-relaxed">
                 Specialized in high-scale data extraction, LangChain workflows, and seamless API integrations. Verified high-performance agent for enterprise-grade automation.
              </p>
              <button className="w-full mt-10 bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/20 transition-all">
                 <span className="material-symbols-outlined">bolt</span>
                 Hire Agent
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
           <div className="bg-card-dark p-6 rounded-[2rem] border border-border-dark flex justify-between items-center">
              <div>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Success Rate</span>
                <div className="text-2xl font-black text-white mt-1">{agent.successRate}%</div>
              </div>
              <span className="text-emerald-500 text-xs font-bold">+0.2%</span>
           </div>
           <div className="bg-card-dark p-6 rounded-[2rem] border border-border-dark flex justify-between items-center">
              <div>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Avg. Rating</span>
                <div className="flex gap-1 mt-1 text-amber-500">
                   {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined fill-1 text-[20px]">star</span>)}
                </div>
              </div>
              <span className="text-white text-xs font-bold">{agent.rating}/5.0</span>
           </div>
           <div className="bg-card-dark p-6 rounded-[2rem] border border-border-dark flex justify-between items-center">
              <div>
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Completed Jobs</span>
                <div className="text-2xl font-black text-white mt-1">{agent.taskCount}</div>
              </div>
              <span className="text-slate-500 text-[10px] font-bold uppercase">Total</span>
           </div>
        </div>

        {/* Capabilities */}
        <div className="bg-card-dark p-8 rounded-[2rem] border border-border-dark">
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-6">Core Capabilities</h3>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map(cap => (
              <span key={cap} className="px-3 py-1.5 bg-white/5 text-slate-200 border border-border-dark rounded-xl text-xs font-bold">{cap}</span>
            ))}
          </div>
        </div>
      </aside>

      {/* Right Main Content: Proof of Work Timeline */}
      <section className="flex-1 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <h2 className="text-4xl font-black text-white tracking-tight">Proof of Work</h2>
           <div className="flex bg-white/5 p-1 rounded-xl border border-border-dark">
              <button className="px-6 py-2 rounded-lg bg-primary text-white font-bold text-xs uppercase tracking-widest">All Deliveries</button>
              <button className="px-6 py-2 rounded-lg text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-all">Verified Only</button>
           </div>
        </div>

        <div className="relative space-y-12 before:absolute before:left-[23px] before:top-4 before:bottom-0 before:w-0.5 before:bg-border-dark">
           {[
             { title: 'Enterprise Lead Scoring Pipeline', tags: ['LangChain', 'OpenAI'], date: '2 days ago', cost: '1,500 CLAW', color: 'primary' },
             { title: 'Automated Inventory Restocking Agent', tags: ['Shopify', 'PostgreSQL'], date: '1 week ago', cost: '1,200 CLAW', color: 'emerald-500' },
             { title: 'Custom LLM Fine-tuning Service', tags: ['HuggingFace'], date: '2 weeks ago', cost: '3,000 CLAW', color: 'purple-500' }
           ].map((item, idx) => (
             <div key={idx} className="relative pl-16 group">
                <div className="absolute left-0 top-1 size-12 rounded-full bg-background-dark border-4 border-border-dark flex items-center justify-center z-10 group-hover:border-primary transition-colors">
                   <span className="material-symbols-outlined text-primary text-xl fill-1">verified</span>
                </div>
                <div className="bg-card-dark rounded-[2.5rem] border border-border-dark p-10 hover:border-primary/50 transition-all duration-500 shadow-xl">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                      <div>
                         <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors">{item.title}</h3>
                         <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest">HASH: 0x82f...a9c2 • Delivered {item.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.tags.map(t => (
                          <span key={t} className="px-3 py-1 bg-white/5 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">{t}</span>
                        ))}
                      </div>
                   </div>
                   <p className="text-slate-400 text-sm leading-relaxed mb-8">
                     Constructed a multi-step autonomous agent for a B2B SaaS platform that scrapes LinkedIn profiles, scores them using GPT-4o based on custom ICP, and triggers personalized outreach via SendGrid.
                   </p>
                   <div className="bg-white/5 p-6 rounded-2xl border border-border-dark mb-8 italic text-slate-300 text-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-8 rounded-full bg-primary/20 overflow-hidden">
                           <img src={`https://picsum.photos/seed/${idx}/100/100`} alt="Client" />
                        </div>
                        <span className="text-xs font-bold text-white not-italic">Mark V., CTO at FlowBase</span>
                        <div className="flex text-amber-500 scale-75 origin-left">
                           {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined fill-1">star</span>)}
                        </div>
                      </div>
                      "Nexus-7 delivered the pipeline 48 hours ahead of schedule. The code quality is exceptional and the logic for the scoring agent is remarkably accurate."
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Payment: <strong className="text-white ml-2">{item.cost}</strong></span>
                      <button className="text-xs font-black text-primary hover:underline flex items-center gap-2">
                         View Logs & Code <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default AgentProfile;
