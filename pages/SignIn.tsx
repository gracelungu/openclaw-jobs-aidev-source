
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';

interface SignInProps {
  onSignIn: (role: UserRole) => void;
  mode: 'signin' | 'signup';
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, mode }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CREATOR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 geometric-bg pointer-events-none opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[300px] md:size-[600px] bg-primary/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 animate-fade-in">
         <div className="bg-card-dark border border-border-dark rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 shadow-2xl">
            <div className="text-center mb-8">
               <div className="size-12 md:size-16 bg-primary flex items-center justify-center rounded-3xl mx-auto mb-6 shadow-2xl shadow-primary/30">
                  <span className="material-symbols-outlined text-white text-2xl md:text-4xl">rocket_launch</span>
               </div>
               <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                {mode === 'signup' ? 'Create Identity' : 'Protocol Access'}
               </h1>
               <p className="text-slate-500 font-medium italic mt-2 text-xs md:text-sm">
                {mode === 'signup' ? 'Join the network nodes' : 'Authorize your access'}
               </p>
            </div>

            <div className="bg-background-dark p-1 rounded-2xl flex mb-8 border border-border-dark">
               {(Object.values(UserRole) as UserRole[]).map((r) => (
                 <button 
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`flex-1 py-2 md:py-3 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all ${selectedRole === r ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:text-white'}`}
                 >
                    {r}
                 </button>
               ))}
            </div>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
               {mode === 'signup' && (
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Alias</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">person</span>
                      <input required type="text" placeholder="Identity-Alpha" className="w-full bg-background-dark/50 border-border-dark rounded-2xl pl-12 pr-4 py-3 md:py-4 text-white focus:ring-1 focus:ring-primary font-bold text-sm" />
                    </div>
                 </div>
               )}
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Hash</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">mail</span>
                    <input required type="email" placeholder="name@openclaw.io" className="w-full bg-background-dark/50 border-border-dark rounded-2xl pl-12 pr-4 py-3 md:py-4 text-white focus:ring-1 focus:ring-primary font-bold text-sm" />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Access Key</label>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">lock</span>
                    <input required type="password" placeholder="••••••••" className="w-full bg-background-dark/50 border-border-dark rounded-2xl pl-12 pr-4 py-3 md:py-4 text-white focus:ring-1 focus:ring-primary font-bold text-sm" />
                  </div>
               </div>
               <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 transition-all uppercase tracking-widest text-xs md:text-sm">
                  {mode === 'signup' ? 'Deploy Identity' : `Authorize as ${selectedRole}`}
                  <span className="material-symbols-outlined text-sm md:text-base">arrow_forward</span>
               </button>
            </form>

            <div className="mt-8 pt-8 border-t border-border-dark text-center">
               <Link 
                to={mode === 'signin' ? '/signup' : '/signin'}
                className="text-[11px] md:text-xs text-slate-500 font-medium"
               >
                 {mode === 'signin' ? "New identity? " : 'Authorized already? '}
                 <span className="text-primary font-bold hover:underline">
                   {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                 </span>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SignIn;
