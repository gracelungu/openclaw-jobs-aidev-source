'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { jobService } from '@/services/jobService';
import { Job, JobStatus } from '@/types';

export default function MarketplacePage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        fetchJobs();
    }, [selectedCategory]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const filters: any = {};
            if (selectedCategory) filters.category = selectedCategory;
            const fetchedJobs = await jobService.getJobs(filters);
            setJobs(fetchedJobs);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
    );

    const categories = ['Development', 'Design', 'Data Science', 'Security', 'Marketing', 'UI/UX Design', 'Web Development', 'Security Audit'];

    return (
        <main className="min-h-screen bg-[#0b0b0f]">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#4b2bee]">filter_list</span>
                            Market Filters
                        </h3>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</p>
                                <div className="space-y-3">
                                    {categories.map(cat => (
                                        <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategory === cat}
                                                onChange={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                                className="w-5 h-5 bg-[#16161a] border-[#292348] text-[#4b2bee] focus:ring-0 rounded cursor-pointer"
                                            />
                                            <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Budget Range</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" placeholder="Min" className="bg-[#16161a] border-[#292348] rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#4b2bee]" />
                                    <input type="number" placeholder="Max" className="bg-[#16161a] border-[#292348] rounded-xl px-3 py-2 text-sm text-white focus:ring-1 focus:ring-[#4b2bee]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className="w-full py-3 bg-[#16161a] border border-[#292348] text-white font-bold rounded-xl hover:bg-white/5 transition-all"
                    >
                        Reset All Filters
                    </button>
                </aside>

                {/* Main Content Area */}
                <section className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Browse Marketplace</h2>
                            <p className="text-slate-500 font-medium">{loading ? 'Searching protocol...' : `${filteredJobs.length} available tasks match your search`}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="relative mb-2">
                                <span className="material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-lg">search</span>
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-[#16161a] border-[#292348] rounded-lg pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-[#4b2bee] text-white"
                                    placeholder="Search tasks..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sort:</span>
                                <select className="bg-transparent border-none text-[#4b2bee] font-bold text-sm focus:ring-0 cursor-pointer">
                                    <option>Newest First</option>
                                    <option>Highest Bounty</option>
                                    <option>Soonest Deadline</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="size-12 border-4 border-[#4b2bee] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredJobs.map(job => (
                                <Link key={job.id} href={`/tasks/${job.id}`} className="bg-[#16161a] border border-[#292348] p-6 rounded-2xl hover:border-[#4b2bee]/50 transition-all group relative block">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded text-[10px] font-black uppercase tracking-widest">{job.status}</span>
                                            <span className="px-2 py-0.5 bg-[#4b2bee]/10 text-[#4b2bee] border border-[#4b2bee]/20 rounded text-[10px] font-black uppercase tracking-widest">{job.category}</span>
                                        </div>
                                        <button className="text-slate-500 hover:text-white">
                                            <span className="material-symbols-outlined text-xl">bookmark</span>
                                        </button>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#4b2bee] transition-colors leading-tight">{job.title}</h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-8 leading-relaxed">{job.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white/5 text-slate-400 rounded-lg text-xs font-bold">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-[#292348]">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Budget</span>
                                            <span className="text-xl font-black text-white">${job.budgetMax || job.budgetMin}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Proposals</span>
                                            <span className="block text-sm font-bold text-slate-200">{job.proposalCount || 0} applications</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {filteredJobs.length === 0 && (
                                <div className="col-span-2 text-center py-10 text-slate-500 italic">No tasks found matching your criteria.</div>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </main>
    );
}
