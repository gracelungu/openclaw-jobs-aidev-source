
import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Platform Intel</h1>
            <p className="text-slate-500 text-sm font-medium italic mt-1 flex items-center gap-2">
               <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
               Core Systems Operational • 42ms Latency
            </p>
         </div>
         <button className="bg-primary text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-primary/20">System Export</button>
      </div>

      {/* Queue Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-card-dark border border-border-dark rounded-[2.5rem] flex flex-col h-[480px] shadow-2xl">
            <div className="p-8 border-b border-border-dark flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-rose-500 text-3xl">flag</span>
                  <h3 className="text-xl font-bold text-white">Moderation Queue</h3>
                  <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">12 Flagged</span>
               </div>
               <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Expand</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
               {[
                 { title: 'Logo Design Spam Submission', reason: 'Spam Content', reporter: 'user_992', priority: 'High' },
                 { title: 'Essay Writing Request', reason: 'Prohibited Category', reporter: 'AI_Audit', priority: 'Medium' },
                 { title: 'Automated Account Spammer', reason: 'TOS Violation', reporter: 'System', priority: 'Critical' },
               ].map((flag, idx) => (
                 <div key={idx} className="bg-background-dark/30 border border-border-dark p-6 rounded-2xl flex items-center justify-between group">
                    <div className="flex-1 min-w-0">
                       <h4 className="text-sm font-bold text-white truncate">{flag.title}</h4>
                       <p className="text-[10px] text-slate-500 font-medium italic mt-1">Reason: <span className="text-rose-400">{flag.reason}</span> • Reported by {flag.reporter}</p>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="size-10 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><span className="material-symbols-outlined">check</span></button>
                       <button className="size-10 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-card-dark border border-border-dark rounded-[2.5rem] flex flex-col h-[480px] shadow-2xl">
            <div className="p-8 border-b border-border-dark flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">gavel</span>
                  <h3 className="text-xl font-bold text-white">Active Disputes</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">4 Pending</span>
               </div>
               <button className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">Resolution Center</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
               {[
                 { id: '#882', title: 'Frontend Bug Fix', vs: 'John D. vs Sarah L.', value: '$450.00', elapsed: '24h 12m' },
                 { id: '#885', title: 'Tech Article Series', vs: 'Mike R. vs TechCorp', value: '$1,200.00', elapsed: '3h 45m' },
               ].map((dispute, idx) => (
                 <div key={idx} className="bg-background-dark/30 border border-border-dark p-6 rounded-2xl flex items-center justify-between group">
                    <div>
                       <h4 className="text-sm font-bold text-white">Dispute {dispute.id}: {dispute.title}</h4>
                       <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{dispute.vs} • <span className="text-primary">{dispute.value}</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-mono text-slate-500 mb-2">Elapsed: {dispute.elapsed}</p>
                       <button className="bg-primary text-white text-[10px] font-black px-4 py-2 rounded-xl hover:scale-105 transition-all uppercase tracking-widest">Assign Me</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* User Directory Preview */}
      <section className="bg-card-dark border border-border-dark rounded-[2.5rem] overflow-hidden shadow-2xl">
         <div className="p-10 border-b border-border-dark flex items-center justify-between">
            <div>
               <h3 className="text-2xl font-black text-white">User Intelligence</h3>
               <p className="text-slate-500 text-sm font-medium italic mt-1">Manage platform members and permissions.</p>
            </div>
            <div className="flex gap-4">
               <button className="bg-white/5 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest border border-border-dark">Filter Roles</button>
               <button className="bg-primary text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-primary/20">+ Create Admin</button>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-background-dark/30 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-border-dark">
                  <tr>
                    <th className="px-10 py-6">User Identity</th>
                    <th className="px-10 py-6">Protocol Role</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6">Reputation</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-dark">
                  {[
                    { name: 'Jordan Davis', email: 'j.davis@example.com', role: 'Freelancer', status: 'Active', rep: 4.9, color: 'emerald-500' },
                    { name: 'Marcus Low', email: 'm.low@studio.io', role: 'Client', status: 'Suspended', rep: 2.1, color: 'rose-500' },
                  ].map((user, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                            <div className="size-10 rounded-2xl bg-primary/20 border border-border-dark flex items-center justify-center font-black text-primary uppercase">{user.name.charAt(0)}</div>
                            <div>
                               <p className="text-base font-black text-white leading-none">{user.name}</p>
                               <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-border-dark">{user.role}</span>
                      </td>
                      <td className="px-10 py-8">
                         <div className={`flex items-center gap-2 text-${user.color} text-xs font-black uppercase tracking-widest`}>
                            <span className={`size-2 bg-${user.color} rounded-full animate-pulse`}></span>
                            {user.status}
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-1">
                            <span className="text-sm font-black text-white">{user.rep}</span>
                            <span className="material-symbols-outlined text-amber-500 text-sm fill-1">star</span>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <button className="material-symbols-outlined text-slate-500 hover:text-white transition-colors">more_vert</button>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
