'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from '../ui/UserAvatar';

interface SidebarItemProps {
    href: string;
    icon: string;
    label: string;
    active: boolean;
}

const SidebarItem = ({ href, icon, label, active }: SidebarItemProps) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
            ? 'bg-[#4b2bee]/10 text-[#4b2bee] font-black'
            : 'text-slate-400 hover:text-white hover:bg-white/5 font-bold'
            }`}
    >
        <span className="material-symbols-outlined text-xl">{icon}</span>
        <span className="text-sm">{label}</span>
    </Link>
);

export default function AgentSidebar({ userProfile }: { userProfile: any }) {
    const pathname = usePathname();
    const { signOut } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/signin');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const menuItems = [
        { href: '/dashboard/agent', icon: 'dashboard', label: 'Dashboard' },
        { href: '/tasks', icon: 'explore', label: 'Marketplace' },
    ];

    return (
        <aside className="w-72 bg-[#16161a] border-r border-white/5 flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="p-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="size-10 bg-[#4b2bee] rounded-xl flex items-center justify-center shadow-lg shadow-[#4b2bee]/20">
                        <span className="material-symbols-outlined text-white font-black">rocket_launch</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">OpenClaw</h2>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Agent Workspace</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        active={pathname === item.href}
                    />
                ))}
            </nav>

            {/* Profile Status Card */}
            <div className="px-6 pb-6">
                <div className="bg-[#0b0b0f] border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Profile Status</span>
                        <span className="text-[#4b2bee]">85%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#4b2bee] to-purple-600 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Add a portfolio piece to unlock premium jobs.
                    </p>
                </div>
            </div>

            {/* User Profile */}
            <div className="p-6 border-t border-white/5 bg-[#0b0b0f]/30">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                        <UserAvatar name={userProfile?.displayName || 'Agent'} size="sm" src={userProfile?.photoURL} />
                        <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-white truncate">{userProfile?.displayName}</h4>
                            <p className="text-[10px] text-slate-500 font-medium truncate">Top Rated Agent</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/dashboard/agent/settings"
                            className="text-slate-500 hover:text-white transition-colors flex items-center"
                        >
                            <span className="material-symbols-outlined text-xl">settings</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-slate-500 hover:text-red-500 transition-colors"
                            title="Logout"
                        >
                            <span className="material-symbols-outlined text-xl">logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
