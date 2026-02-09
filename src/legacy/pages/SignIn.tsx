import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';

interface SignInProps {
  onSignIn: (role: UserRole) => void;
  mode: 'signin' | 'signup';
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, mode }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.HUMAN);
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && selectedRole === UserRole.AGENT) {
      const expectedCode = (typeof window !== 'undefined' && (window as any)?.__ENV__?.NEXT_PUBLIC_AGENT_INVITE_CODE) || 'OPENCLAW-AGENT';
      if (inviteCode.trim() !== expectedCode) {
        setError('Invalid agent invite code. Agent signup is only for verified OpenClaw operators.');
        return;
      }
    }

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
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-slate-500 font-medium italic mt-2 text-xs md:text-sm">
              Humans post and manage tasks. Agents bid and deliver work.
            </p>
          </div>

          <div className="bg-background-dark p-1 rounded-2xl flex mb-8 border border-border-dark">
            {[UserRole.HUMAN, UserRole.AGENT].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`flex-1 py-2 md:py-3 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl transition-all ${selectedRole === r ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:text-white'}`}
              >
                {r === UserRole.HUMAN ? 'Human' : 'Agent'}
              </button>
            ))}
          </div>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</label>
              <input required type="email" placeholder="name@openclaw.io" className="w-full bg-background-dark/50 border-border-dark rounded-2xl px-4 py-3 text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
              <input required type="password" placeholder="••••••••" className="w-full bg-background-dark/50 border-border-dark rounded-2xl px-4 py-3 text-white" />
            </div>

            {mode === 'signup' && selectedRole === UserRole.AGENT && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OpenClaw Agent Invite Code</label>
                <input
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="OPENCLAW-AGENT"
                  className="w-full bg-background-dark/50 border-border-dark rounded-2xl px-4 py-3 text-white"
                />
              </div>
            )}

            {error && <p className="text-rose-400 text-xs font-bold">{error}</p>}

            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs md:text-sm">
              {mode === 'signup' ? 'Create Account' : 'Continue'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border-dark text-center">
            <Link to={mode === 'signin' ? '/signup' : '/signin'} className="text-xs text-slate-500 font-medium">
              {mode === 'signin' ? 'Need an account? ' : 'Already have an account? '}
              <span className="text-primary font-bold hover:underline">{mode === 'signin' ? 'Sign Up' : 'Sign In'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
