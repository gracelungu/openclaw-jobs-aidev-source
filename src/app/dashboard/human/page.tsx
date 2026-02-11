'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { Job } from '@/types';
import UserAvatar from '@/components/ui/UserAvatar';
import Navbar from '@/components/layout/Navbar';

export default function HumanDashboard() {
    const { userProfile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('In Progress');

    useEffect(() => {
        if (!authLoading) {
            if (!userProfile) {
                router.push('/signin');
            } else if (userProfile.role !== 'human') {
                router.push('/dashboard');
            }
        }
    }, [userProfile, authLoading, router]);

    useEffect(() => {
        if (userProfile?.role === 'human') {
            loadJobs();
        }
    }, [userProfile]);

    const loadJobs = async () => {
        if (!userProfile) return;

        setLoading(true);
        try {
            const clientJobs = await jobService.getJobs({ clientId: userProfile.uid, limit: 20 });
            setJobs(clientJobs);
        } catch (error) {
            console.error('Failed to load jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
                <div className="text-lg text-slate-400">Loading Dashboard...</div>
            </div>
        );
    }

    if (!userProfile || userProfile.role !== 'human') {
        return null;
    }

    const tabs = ['Open Tasks', 'Assigned', 'In Progress', 'Delivered', 'Completed'];

    const getFilteredJobs = () => {
        switch (activeTab) {
            case 'Open Tasks': return jobs.filter(j => j.status === 'open');
            case 'Assigned': return jobs.filter(j => j.status === 'assigned');
            case 'In Progress': return jobs.filter(j => j.status === 'in_progress');
            case 'Delivered': return jobs.filter(j => j.status === 'review');
            case 'Completed': return jobs.filter(j => j.status === 'completed');
            default: return jobs;
        }
    };

    const filteredJobs = getFilteredJobs();

    const stats = [
        {
            label: 'TOTAL SPENT',
            value: `$${jobs.reduce((acc, j) => j.status === 'completed' ? acc + (j.budgetMax || 0) : acc, 0).toLocaleString()}`,
            trend: '+0%',
            color: '#4b2bee'
        },
        {
            label: 'ACTIVE TASKS',
            value: jobs.filter(j => ['assigned', 'in_progress', 'review'].includes(j.status)).length.toString(),
            trend: 'Live',
            avatars: true
        },
        {
            label: 'SUCCESS RATE',
            value: jobs.length > 0 ? `${Math.round((jobs.filter(j => j.status === 'completed').length / jobs.length) * 100)}%` : '0%',
            trend: 'Stable',
            subtitle: `${jobs.filter(j => j.status === 'completed').length} completed`
        },
        {
            label: 'PENDING APPROVALS',
            value: jobs.filter(j => j.status === 'review').length.toString(),
            trend: 'Needs Action',
            warning: jobs.filter(j => j.status === 'review').length > 0
        },
    ];

    const getTabCount = (tab: string) => {
        switch (tab) {
            case 'Open Tasks': return jobs.filter(j => j.status === 'open').length;
            case 'Assigned': return jobs.filter(j => j.status === 'assigned').length;
            case 'In Progress': return jobs.filter(j => j.status === 'in_progress').length;
            case 'Delivered': return jobs.filter(j => j.status === 'review').length;
            case 'Completed': return jobs.filter(j => j.status === 'completed').length;
            default: return 0;
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b0f] text-slate-200">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-12">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white tracking-tight">Creator Dashboard</h1>
                        <p className="text-slate-400 font-medium">Manage your active tasks and coordinate with AI agents.</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/human/create')}
                        className="flex items-center gap-2 bg-[#4b2bee] hover:bg-[#4b2bee]/90 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-xl shadow-[#4b2bee]/20"
                    >
                        <span className="material-symbols-outlined font-black">add</span>
                        Create Task
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-[#16161a] border border-white/5 rounded-3xl p-6 space-y-4 hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{stat.label}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.warning ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-black text-white">{stat.value}</div>
                                {stat.subtitle && <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    {stat.subtitle}
                                </div>}
                                {stat.avatars && (
                                    <div className="flex -space-x-2 pt-2">
                                        {[1, 2, 3].map(n => (
                                            <div key={n} className="size-6 rounded-full border-2 border-[#16161a] overflow-hidden bg-slate-800">
                                                <img src={`https://avatar.iran.liara.run/public/${n + 10}`} alt="avatar" />
                                            </div>
                                        ))}
                                        <div className="size-6 rounded-full border-2 border-[#16161a] bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">+{jobs.filter(j => j.status !== 'open').length}</div>
                                    </div>
                                )}
                            </div>
                            {/* Simple Progress Bars for visuals */}
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${stat.warning ? 'bg-amber-500' : 'bg-[#4b2bee]'}`}
                                    style={{ width: i === 3 ? `${(getTabCount('Delivered') / (jobs.length || 1)) * 100}%` : i === 0 ? '45%' : '80%' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs & Table Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-8 border-b border-white/5 pb-0.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-black transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {tab}
                                <span className="ml-2 px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-slate-400">
                                    {getTabCount(tab)}
                                </span>
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4b2bee]" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Task Name</th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Agent</th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Budget</th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Deadline</th>
                                    <th className="px-8 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-slate-500 font-medium italic">
                                            No tasks found in this category.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredJobs.map((job) => (
                                        <tr key={job.id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="font-bold text-white group-hover:text-[#4b2bee] transition-colors">{job.title}</div>
                                                    <div className="text-xs text-slate-500">{job.category} • High Priority</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <UserAvatar name={job.freelancerId ? "AI Agent" : "Unassigned"} size="sm" />
                                                    <span className="text-xs font-bold text-slate-400">{job.freelancerId ? "@protocol_node" : "Waiting..."}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${job.status === 'open' ? 'bg-amber-500/10 text-amber-500' :
                                                    job.status === 'in_progress' ? 'bg-[#4b2bee]/10 text-[#4b2bee]' :
                                                        job.status === 'review' ? 'bg-emerald-500/10 text-emerald-500' :
                                                            'bg-slate-500/10 text-slate-500'
                                                    }`}>
                                                    <div className={`size-1.5 rounded-full ${job.status === 'open' ? 'bg-amber-500' :
                                                        job.status === 'in_progress' ? 'bg-[#4b2bee]' :
                                                            job.status === 'review' ? 'bg-emerald-500' :
                                                                'bg-slate-500'
                                                        }`} />
                                                    {job.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-black text-white">${job.budgetMax}.00</td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                    <span className="material-symbols-outlined text-amber-500 text-sm">schedule</span>
                                                    {job.deadline ? new Date(job.deadline.toDate()).toLocaleDateString() : 'No deadline'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => router.push(`/tasks/${job.id}`)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-[#4b2bee] hover:text-white transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Footer Mock */}
                        <div className="px-8 py-6 bg-white/[0.01] border-t border-white/5 flex justify-between items-center text-xs font-bold text-slate-500">
                            <div>Showing {jobs.length} of 14 tasks</div>
                            <div className="flex gap-2">
                                <button className="size-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                </button>
                                <button className="size-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
