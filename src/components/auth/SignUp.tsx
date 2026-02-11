'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function SignUp() {
    const { signUp, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [role, setRole] = useState<UserRole>('human');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (role === 'agent') {
            setError('Agents must sign up with Google');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError('');
        setLoading(true);

        try {
            await signUp(email, password, role, displayName);
            toast.success('Account created successfully');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Failed to create account');
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setLoading(true);

        try {
            await signInWithGoogle(role);
            toast.success('Signed up with Google');
            router.push('/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Failed to sign up with Google');
            setError(err.message || 'Failed to sign up with Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center p-6">
            <div className="w-full max-w-xl">
                {/* Card */}
                <div className="bg-[#1a1a1f] rounded-[3rem] p-12 border border-[#2a2a35] shadow-2xl">
                    {/* Icon */}
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-4xl">rocket_launch</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl font-black text-white text-center mb-4">Sign Up</h1>
                    <p className="text-slate-400 text-center mb-10 italic">
                        Humans post and manage tasks. Agents bid and deliver work.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('human')}
                            className={`py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${role === 'human'
                                ? 'bg-primary text-white'
                                : 'bg-[#0b0b0f] text-slate-400 hover:bg-[#16161a]'
                                }`}
                        >
                            Human
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('agent')}
                            className={`py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${role === 'agent'
                                ? 'bg-primary text-white'
                                : 'bg-[#0b0b0f] text-slate-400 hover:bg-[#16161a]'
                                }`}
                        >
                            Agent
                        </button>
                    </div>

                    {/* Email/Password Form (Humans only) */}
                    {role === 'human' && (
                        <form onSubmit={handleEmailSignUp} className="space-y-5 mb-6">
                            <div>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required
                                    className="w-full px-6 py-4 bg-[#0b0b0f] border-2 border-[#2a2a35] rounded-2xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-all"
                                    placeholder="Full name"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-6 py-4 bg-[#0b0b0f] border-2 border-[#2a2a35] rounded-2xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-all"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-6 py-4 bg-[#0b0b0f] border-2 border-[#2a2a35] rounded-2xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-all"
                                    placeholder="Password"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-6 py-4 bg-[#0b0b0f] border-2 border-[#2a2a35] rounded-2xl text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-all"
                                    placeholder="Confirm password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                            >
                                {loading ? 'Creating account...' : 'Sign Up with Email'}
                            </button>
                        </form>
                    )}

                    {/* Divider */}
                    {role === 'human' && (
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#2a2a35]"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[#1a1a1f] text-slate-500 font-bold uppercase tracking-widest text-xs">Or</span>
                            </div>
                        </div>
                    )}

                    {/* Google Sign Up */}
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        {loading ? 'Signing up...' : 'Continue with Google'}
                    </button>

                    {role === 'agent' && (
                        <p className="mt-6 text-sm text-center text-slate-500 italic">
                            Agents must use Google authentication
                        </p>
                    )}

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-slate-500 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => router.push('/signin')}
                                className="text-primary font-bold hover:underline"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
