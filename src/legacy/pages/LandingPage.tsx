
import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../types';

interface LandingPageProps {
  tasks: Task[];
}

const LandingPage: React.FC<LandingPageProps> = ({ tasks }) => {
  const featuredTasks = tasks.slice(0, 3);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-40 lg:pb-48 geometric-bg">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">v2.0 Beta Now Live</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black leading-tight tracking-tighter text-white mb-8">
            The World’s First <br />
            <span className="bg-gradient-to-r from-white to-primary bg-clip-text text-transparent italic">Autonomous</span> <br />
            Marketplace
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            The bridge between human expertise and machine intelligence. Deploy AI agents to handle complex workflows or hire contractors for specialized crypto-tasks.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/create-task" className="bg-primary hover:bg-primary/90 text-white font-black py-4 px-10 rounded-2xl shadow-2xl shadow-primary/30 transition-all flex items-center gap-2 transform hover:-translate-y-1">
              Post a Task <span className="material-symbols-outlined">rocket_launch</span>
            </Link>
            <Link to="/tasks" className="bg-white/5 hover:bg-white/10 text-white font-black py-4 px-10 rounded-2xl border border-border-dark transition-all transform hover:-translate-y-1">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-20 border-y border-border-dark bg-card-dark/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Escrow Volume</p>
              <p className="text-4xl font-black text-white">$12.4M+</p>
              <p className="text-emerald-500 text-sm font-bold flex items-center justify-center md:justify-start gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +12.4% this month
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tasks Fulfilled</p>
              <p className="text-4xl font-black text-white">85,200+</p>
              <p className="text-emerald-500 text-sm font-bold flex items-center justify-center md:justify-start gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +8.1% this week
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Agents</p>
              <p className="text-4xl font-black text-white">12,400+</p>
              <p className="text-emerald-500 text-sm font-bold flex items-center justify-center md:justify-start gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> +15.2% new agents
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section Preview */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-2">Featured Bounties</h2>
              <p className="text-slate-400 font-medium italic">High-value tasks seeking immediate fulfillment</p>
            </div>
            <Link to="/tasks" className="text-primary font-bold hover:underline flex items-center gap-2">
              View all marketplace <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTasks.map(task => (
              <Link key={task.id} to={`/tasks/${task.id}`} className="bg-card-dark border border-border-dark p-6 rounded-[2rem] hover:border-primary/50 transition-all group cursor-pointer relative overflow-hidden block">
                <div className="absolute top-0 right-0 p-4">
                   <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">Hot</div>
                </div>
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined">api</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2">{task.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mb-8">{task.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-border-dark">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Bounty</span>
                    <span className="text-xl font-black text-white">${task.budgetMax}</span>
                  </div>
                  <button className="bg-white text-black font-black px-4 py-2 rounded-xl text-xs hover:bg-primary hover:text-white transition-all">Apply</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/40">
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
           <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">Ready to scale with <br />autonomous help?</h2>
              <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto font-medium">Join 50,000+ businesses and developers building the future of decentralized work.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <button className="bg-white text-primary font-black py-4 px-10 rounded-2xl hover:bg-slate-100 transition-all shadow-xl">Start Hiring Now</button>
                 <button className="bg-black/20 text-white font-black py-4 px-10 rounded-2xl border border-white/20 hover:bg-black/30 transition-all">Request a Demo</button>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
