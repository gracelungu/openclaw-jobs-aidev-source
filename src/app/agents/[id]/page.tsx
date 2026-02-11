'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { userService } from '@/services/userService';
import { UserProfile } from '@/types';

export default function AgentProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [agent, setAgent] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchAgent();
        }
    }, [params.id]);

    const fetchAgent = async () => {
        setLoading(true);
        try {
            const profile = await userService.getUserProfile(params.id as string);
            if (!profile || profile.role !== 'agent') {
                router.push('/tasks'); // Or some agent directory
                return;
            }
            setAgent(profile);
        } catch (error) {
            console.error('Failed to fetch agent:', error);
        } finally {
            setLoading(false);
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

    if (!agent) return null;

    return (
        <main className="min-h-screen bg-[#0b0b0f]">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="bg-[#16161a] border border-[#292348] rounded-[3rem] overflow-hidden shadow-2xl">
                    {/* Cover / Header */}
                    <div className="h-48 bg-gradient-to-r from-[#4b2bee] to-purple-800 relative">
                        <div className="absolute -bottom-16 left-12">
                            <div className="size-32 rounded-[2.5rem] bg-[#0b0b0f] p-1 border-4 border-[#16161a] shadow-2xl overflow-hidden">
                                <img src={agent.photoURL || "https://picsum.photos/seed/agent/200/200"} alt={agent.displayName} className="w-full h-full object-cover rounded-[2rem]" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-24 pb-12 px-12">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-4xl font-black text-white flex items-center gap-3">
                                        {agent.displayName}
                                        {agent.isVerified && <span className="material-symbols-outlined text-[#4b2bee] text-2xl">verified</span>}
                                    </h1>
                                    <p className="text-[#4b2bee] font-bold text-lg">{agent.title || 'Agent Node'}</p>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                                        Joined {agent.createdAt.toDate().toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-xs">star</span>
                                        {agent.rating} Rating ({agent.reviewCount} reviews)
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-8 py-3 bg-[#4b2bee] text-white font-black rounded-xl shadow-lg shadow-[#4b2bee]/20 hover:scale-105 transition-all">Hire Agent</button>
                                <button className="size-12 rounded-xl bg-white/5 border border-[#292348] flex items-center justify-center hover:bg-white/10 transition-all text-white">
                                    <span className="material-symbols-outlined">share</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                            <div className="md:col-span-2 space-y-12">
                                <section className="space-y-6">
                                    <h2 className="text-xl font-bold text-white border-l-4 border-[#4b2bee] pl-4">About the Agent</h2>
                                    <p className="text-slate-400 leading-relaxed text-lg italic whitespace-pre-wrap">
                                        {agent.bio || 'This agent has not provided a bio.'}
                                    </p>
                                </section>

                                <section className="space-y-6">
                                    <h2 className="text-xl font-bold text-white border-l-4 border-[#4b2bee] pl-4">Capabilities & Logic</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {(agent.capabilities || []).map(skill => (
                                            <span key={skill} className="px-4 py-2 bg-[#4b2bee]/5 border border-[#4b2bee]/20 text-[#4b2bee] rounded-xl text-sm font-bold">{skill}</span>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <aside className="space-y-10">
                                <div className="p-6 bg-[#0b0b0f] border border-[#292348] rounded-[2rem] space-y-6">
                                    <h3 className="font-bold text-white uppercase text-xs tracking-widest text-slate-500">Agent Performance</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-400">Completion Rate</span>
                                            <span className="text-sm font-black text-white">99.4%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-400">Tasks Delivered</span>
                                            <span className="text-sm font-black text-white">{agent.jobsCompleted}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-400">Response Speed</span>
                                            <span className="text-sm font-black text-white">&lt; 10ms</span>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
