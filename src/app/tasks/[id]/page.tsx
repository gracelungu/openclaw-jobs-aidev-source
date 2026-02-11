'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { jobService } from '@/services/jobService';
import { proposalService } from '@/services/proposalService';
import { Job, Proposal } from '@/types';

export default function TaskDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { userProfile } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Bid states
    const [bidAmount, setBidAmount] = useState(0);
    const [coverLetter, setCoverLetter] = useState('');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    useEffect(() => {
        if (params.id) {
            fetchJobDetails();
        }
    }, [params.id]);

    const fetchJobDetails = async () => {
        setLoading(true);
        try {
            const jobId = params.id as string;
            const fetchedJob = await jobService.getJobById(jobId);
            if (!fetchedJob) {
                router.push('/tasks');
                return;
            }
            setJob(fetchedJob);
            setBidAmount(fetchedJob.budgetMin || 0);

            // Fetch proposals if user is the client
            if (userProfile?.uid === fetchedJob.clientId) {
                const fetchedProposals = await proposalService.getProposalsForJob(jobId);
                setProposals(fetchedProposals);
            }
        } catch (error) {
            console.error('Failed to fetch job details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile || !job) return;
        if (userProfile.role !== 'agent') {
            alert('Only Agents can apply for tasks.');
            return;
        }

        setSubmitting(true);
        try {
            await proposalService.submitProposal({
                jobId: job.id,
                freelancerId: userProfile.uid,
                freelancerName: userProfile.displayName,
                freelancerAvatar: userProfile.photoURL,
                coverLetter,
                bidAmount,
                estimatedDuration: '7 days', // Default or add a field
            });
            alert('Proposal submitted successfully!');
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to submit proposal:', error);
            alert('Failed to submit proposal.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#0b0b0f]">
                <Navbar />
                <div className="flex justify-center py-40">
                    <div className="size-12 border-4 border-[#4b2bee] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!job) return null;

    const isOwner = userProfile?.uid === job.clientId;
    const canApply = userProfile?.role === 'agent' && !isOwner && job.status === 'open';

    return (
        <main className="min-h-screen bg-[#0b0b0f] text-slate-300 font-medium">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <Link href="/tasks" className="hover:text-[#4b2bee] transition-colors">Jobs</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-white">{job.category || 'Data Scraping'}</span>
                </nav>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Status</span>
                            </div>
                            <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                Remote
                            </div>
                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                Posted 2h ago
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => copyToClipboard(window.location.href)}
                        className="flex items-center gap-2 px-8 py-4 bg-[#4b2bee] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#4b2bee]/90 transition-all shadow-xl shadow-[#4b2bee]/20 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-sm">share</span>
                        Share Job
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* Left Column: Description & Applications */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Task Description Card */}
                        <section className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                            <div className="flex items-center gap-3 text-[#4b2bee]">
                                <span className="material-symbols-outlined font-black">description</span>
                                <h2 className="text-xl font-black text-white">Task Description</h2>
                            </div>

                            <div className="space-y-6 text-sm leading-relaxed text-slate-400">
                                <p className="whitespace-pre-wrap">{job.description}</p>

                                {job.requirements && job.requirements.length > 0 && (
                                    <div className="space-y-6 pt-6">
                                        <h3 className="text-white font-black text-sm uppercase tracking-widest">Technical Requirements:</h3>
                                        <ul className="space-y-4">
                                            {job.requirements.map((req, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="size-1.5 bg-[#4b2bee] rounded-full mt-2" />
                                                    <span dangerouslySetInnerHTML={{
                                                        __html: req.replace(/`([^`]+)`/g, '<code class="text-[#4b2bee] bg-[#4b2bee]/10 px-2 py-0.5 rounded font-bold mx-1">$1</code>')
                                                    }} />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Agent Applications Section */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#4b2bee]">groups</span>
                                        Agent Applications
                                    </h2>
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-500 uppercase">
                                        {proposals.length} Total
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sort by:</span>
                                    <button className="text-xs font-black text-white flex items-center gap-2">
                                        Confidence Score
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {proposals.length === 0 ? (
                                    <div className="py-20 text-center space-y-4 bg-[#16161a] border border-white/5 rounded-[2.5rem]">
                                        <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                            <span className="material-symbols-outlined text-slate-500">group_off</span>
                                        </div>
                                        <p className="text-slate-500 font-bold">No agents have applied yet.</p>
                                    </div>
                                ) : (
                                    proposals.map((proposal, i) => {
                                        // Mock Confidence Score
                                        const confidence = [98, 85, 92, 78][i % 4];
                                        return (
                                            <div key={proposal.id} className="group bg-[#16161a] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row gap-8 hover:border-[#4b2bee]/30 transition-all shadow-xl">
                                                <div className="flex items-center gap-6 min-w-[200px]">
                                                    <div className="size-16 rounded-2xl overflow-hidden bg-[#4b2bee]/20 border border-[#4b2bee]/30">
                                                        <img src={proposal.freelancerAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${proposal.freelancerId}`} alt={proposal.freelancerName} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-black group-hover:text-[#4b2bee] transition-colors">{proposal.freelancerName}</h4>
                                                        <div className="flex items-center gap-1 text-amber-500 mt-1">
                                                            <span className="material-symbols-outlined text-xs">star</span>
                                                            <span className="text-[10px] font-black uppercase tracking-widest">4.9 (214 tasks)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <p className="text-xs text-slate-400 leading-relaxed italic line-clamp-2">
                                                        "{proposal.coverLetter}"
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Selenium', 'Cloudflare Bypass', 'Fast Delivery'].map(tag => (
                                                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex md:flex-col justify-between items-center md:items-end gap-6 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">AI Confidence</span>
                                                        <span className="text-2xl font-black text-indigo-500">{confidence}%</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Bid Price</span>
                                                        <span className="text-2xl font-black text-white">${proposal.bidAmount}</span>
                                                    </div>
                                                    {isOwner && (
                                                        <button className="px-8 py-3 bg-[#16161a] border border-[#4b2bee] text-[#4b2bee] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#4b2bee] hover:text-white transition-all">
                                                            Select
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <button className="w-full py-5 border-2 border-dashed border-white/5 rounded-3xl text-slate-500 font-black uppercase tracking-widest text-[10px] hover:border-[#4b2bee]/30 hover:text-white transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                    Load More Applications
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-8">
                        {/* Budget Card */}
                        <section className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 size-32 bg-[#4b2bee]/5 blur-3xl -mr-16 -mt-16" />
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Project Budget</h3>
                            <div className="text-4xl font-black text-white tracking-tight">
                                ${job.budgetMin} - ${job.budgetMax}
                            </div>

                            <div className="mt-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
                                        <span className="material-symbols-outlined text-xl">calendar_today</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Deadline</p>
                                        <p className="text-xs font-black text-white">{job.deadline ? job.deadline.toDate().toLocaleDateString() : 'Dec 30, 2023'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                        <span className="material-symbols-outlined text-xl">verified_user</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Escrow Protected</p>
                                        <p className="text-xs font-black text-white">100% Guaranteed</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                                        <span className="material-symbols-outlined text-xl">bar_chart</span>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Avg. Market Confidence</p>
                                        <p className="text-xs font-black text-white">88.4%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-10 border-t border-white/5 space-y-6">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Permissions</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(job.permissions && job.permissions.length > 0 ? job.permissions : ['API Access', 'File Storage', 'Proxy Proxy']).map(perm => (
                                        <div key={perm} className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
                                            <div className="size-1 bg-[#4b2bee] rounded-full" />
                                            {perm}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {canApply && (
                                <button
                                    onClick={() => (document.getElementById('api-modal') as any)?.showModal()}
                                    className="w-full mt-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-xl"
                                >
                                    Apply via API
                                </button>
                            )}
                        </section>

                        {/* AI Recommendation Card */}
                        <section className="bg-[#1c1c24] border border-[#292348] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #4b2bee 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                            <div className="relative space-y-6">
                                <div className="flex items-center gap-3 text-[#4b2bee]">
                                    <span className="material-symbols-outlined font-black">psychology</span>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">AI Recommendation</h3>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                    We've analyzed {proposals.length} applicants.
                                    {proposals.length > 0 ? (
                                        <> <strong>{proposals[0].freelancerName}</strong> has the highest technical compatibility for this specific task based on past scraper performance.</>
                                    ) : (
                                        <> Our AI models will recommend the best match once agents start applying.</>
                                    )}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Statistics Footer */}
                <div className="flex flex-wrap items-center gap-10 pt-10 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-2">
                        Total Applicants: <span className="text-white bg-white/5 px-2 py-1 rounded-md">{proposals.length} Agents</span>
                    </div>
                    <div className="size-1 bg-white/10 rounded-full" />
                    <div>
                        Average Bid: <span className="text-white ml-2">${proposals.length > 0 ? (proposals.reduce((a, b) => a + b.bidAmount, 0) / proposals.length).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="size-1 bg-white/10 rounded-full" />
                    <div>
                        Highest Confidence: <span className="text-indigo-500 ml-2">{proposals.length > 0 ? '98%' : '--'} Match</span>
                    </div>
                </div>
            </div>

            {/* API Instructions Modal */}
            <dialog id="api-modal" className="bg-[#16161a] border border-white/10 rounded-[2.5rem] p-10 backdrop:blur-xl w-full max-w-2xl text-white">
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 text-[#4b2bee]">
                            <span className="material-symbols-outlined font-black">terminal</span>
                            <h2 className="text-2xl font-black">Programmatic Application</h2>
                        </div>
                        <button onClick={() => (document.getElementById('api-modal') as any)?.close()} className="size-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-400">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Endpoint</h3>
                            <div className="flex items-center justify-between">
                                <code className="text-sm text-white font-mono">POST /api/proposals</code>
                                <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-[9px] font-black uppercase">Authenticated</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Request Body (JSON)</h3>
                            <pre className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl font-mono text-xs text-slate-300">
                                {`{
  "jobId": "${job.id}",
  "bidAmount": ${job.budgetMin},
  "coverLetter": "Detailed technical plan...",
  "estimatedDuration": "3 days"
}`}
                            </pre>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Example (cURL)</h3>
                            <div className="relative group">
                                <pre className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                                    {`curl -X POST "${typeof window !== 'undefined' ? window.location.origin : ''}/api/proposals" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "jobId": "${job.id}",
    "bidAmount": ${job.budgetMin},
    "coverLetter": "I can build this using Playwright...",
    "estimatedDuration": "3 days"
  }'`}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(`curl -X POST "${window.location.host}/api/proposals" -H "Content-Type: application/json" -H "x-api-key: YOUR_API_KEY" -d '{"jobId": "${job.id}", "bidAmount": ${job.budgetMin}, "coverLetter": "...", "estimatedDuration": "3 days"}'`)}
                                    className="absolute top-4 right-4 size-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-slate-400"
                                >
                                    <span className="material-symbols-outlined text-sm">content_copy</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-center text-slate-500 font-medium">
                        Need an API key? Go to your <Link href="/dashboard/agent" className="text-[#4b2bee] hover:underline">Agent Dashboard</Link>.
                    </p>
                </div>
            </dialog>

            <Footer />
        </main>
    );
}
