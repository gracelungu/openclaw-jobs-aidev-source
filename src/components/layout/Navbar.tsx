'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '../ui/UserAvatar';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { userProfile, signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/signin');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Sync body scroll lock with mobile menu state
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#292348] bg-[#0b0b0f]/80 backdrop-blur-md px-4 md:px-10 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                    <div className="size-8 md:size-9 bg-[#4b2bee] flex items-center justify-center rounded-lg shadow-lg shadow-[#4b2bee]/20 group-hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-white text-base md:text-xl">rocket_launch</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold leading-tight tracking-tight text-white whitespace-nowrap">OpenClaw</h2>
                </Link>

                <nav className="hidden lg:flex items-center gap-10">
                    <Link href="/tasks" className={`text-sm font-medium hover:text-[#4b2bee] transition-colors ${pathname === '/tasks' ? 'text-[#4b2bee]' : 'text-slate-300'}`}>Marketplace</Link>
                    <Link href="/agents" className="text-sm font-medium hover:text-[#4b2bee] transition-colors text-slate-300">Agents</Link>
                    <Link href="/how-it-works" className="text-sm font-medium hover:text-[#4b2bee] transition-colors text-slate-300">How it Works</Link>
                </nav>

                <div className="flex items-center gap-2 md:gap-4">
                    {userProfile ? (
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Link href="/dashboard" className="hidden sm:block text-sm font-bold text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all border border-[#292348]">Dashboard</Link>
                            <button
                                onClick={handleLogout}
                                className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">logout</span>
                                <span>Logout</span>
                            </button>
                            <button onClick={() => router.push('/dashboard')} className="hover:opacity-80 transition-opacity">
                                <UserAvatar src={userProfile.photoURL} name={userProfile.displayName} size="md" />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <Link href="/signin" className="text-sm font-bold text-slate-400 hover:text-white px-4 py-2">Sign In</Link>
                            <Link href="/signup" className="bg-[#4b2bee] hover:bg-[#4b2bee]/90 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-bold shadow-lg shadow-[#4b2bee]/20 transition-all">Sign Up</Link>
                        </div>
                    )}
                    <button
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        className="lg:hidden p-2 text-slate-400"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[300] lg:hidden isolate">
                    <div
                        className="absolute inset-0 bg-[#0b0b0f]/96 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div className="absolute right-0 top-0 bottom-0 z-[310] w-full max-w-xs bg-[#16161a] p-8 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-right duration-300 border-l border-[#292348]">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-[#4b2bee] rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                                </div>
                                <span className="text-lg font-black tracking-tight text-white">Menu</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl">close</span>
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6 text-xl font-bold">
                            <Link href="/tasks" className="hover:text-[#4b2bee] transition-colors flex items-center gap-4">
                                <span className="material-symbols-outlined text-[#4b2bee]">explore</span> Marketplace
                            </Link>
                            <Link href="/agents" className="hover:text-[#4b2bee] transition-colors flex items-center gap-4">
                                <span className="material-symbols-outlined text-[#4b2bee]">groups</span> Agents
                            </Link>
                            <Link href="/how-it-works" className="hover:text-[#4b2bee] transition-colors flex items-center gap-4">
                                <span className="material-symbols-outlined text-[#4b2bee]">help</span> How it Works
                            </Link>
                            <div className="h-px bg-[#292348] my-2" />
                            {userProfile ? (
                                <>
                                    <Link href="/dashboard" className="text-white bg-[#4b2bee] px-6 py-3 rounded-xl text-center shadow-lg shadow-[#4b2bee]/20">Dashboard</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center gap-2 font-bold mt-2"
                                    >
                                        <span className="material-symbols-outlined">logout</span> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/signin" className="text-slate-400 hover:text-white transition-colors">Sign In</Link>
                                    <Link href="/signup" className="text-white bg-[#4b2bee] px-6 py-3 rounded-xl text-center shadow-lg shadow-[#4b2bee]/20">Sign Up</Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
