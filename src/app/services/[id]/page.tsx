'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { agentServiceService } from '@/services/agentService';
import { AgentService, ServiceTier } from '@/types';

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { userProfile } = useAuth();
    const [service, setService] = useState<AgentService | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTier, setActiveTier] = useState<'basic' | 'standard' | 'premium'>('basic');

    useEffect(() => {
        if (params.id) {
            fetchServiceDetails();
        }
    }, [params.id]);

    const fetchServiceDetails = async () => {
        setLoading(true);
        try {
            const data = await agentServiceService.getServiceById(params.id as string);
            setService(data);
        } catch (error) {
            console.error('Failed to fetch service:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
                <div className="size-12 border-4 border-[#4b2bee] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!service) return null;

    const currentTier = service.tiers[activeTier] || service.tiers.basic;

    return (
        <main className="min-h-screen bg-[#0b0b0f] text-slate-300">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-6 py-10">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-10">
                    <Link href="/services" className="hover:text-[#4b2bee] transition-colors">Services</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-white">{service.category}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Column: Media & Description */}
                    <div className="lg:col-span-2 space-y-12">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            {service.title}
                        </h1>

                        {/* Agent Info */}
                        <div className="flex items-center gap-4 p-6 bg-[#16161a] border border-white/5 rounded-3xl w-fit">
                            <div className="size-12 bg-white/5 rounded-2xl overflow-hidden">
                                <img src={service.agentAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${service.agentName}`} alt={service.agentName} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white">{service.agentName}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-amber-500 text-xs">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="material-symbols-outlined text-sm shrink-0">star</span>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{service.rating} ({service.reviewCount} reviews)</span>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-white/5 mx-2" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full">Top Seller</span>
                        </div>

                        {/* Gallery */}
                        <div className="space-y-6">
                            <div className="aspect-video bg-[#16161a] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl group relative">
                                <img src={service.mainImage} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
                                    <span className="px-4 py-2 bg-[#4b2bee] text-white text-[10px] font-black uppercase tracking-widest rounded-xl self-start shadow-xl">Best for High Performance</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {service.gallery.map((img, i) => (
                                    <button key={i} className="aspect-video bg-[#16161a] border border-white/5 rounded-2xl overflow-hidden hover:border-[#4b2bee]/50 transition-all opacity-60 hover:opacity-100">
                                        <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-white">Service Description</h2>
                            <div className="prose prose-invert prose-slate max-w-none text-slate-400 font-medium leading-relaxed">
                                <p>{service.description}</p>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Pricing & Sticky Box */}
                    <div className="space-y-8">
                        {/* Pricing Tiers Box */}
                        <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden sticky top-32">
                            {/* Tier Tabs */}
                            <div className="flex border-b border-white/5">
                                {(['basic', 'standard', 'premium'] as const).map((tier) => (
                                    <button
                                        key={tier}
                                        onClick={() => setActiveTier(tier as any)}
                                        className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTier === tier
                                                ? 'text-white border-b-2 border-[#4b2bee] bg-white/5'
                                                : 'text-slate-500 hover:text-white'
                                            }`}
                                    >
                                        {tier}
                                    </button>
                                ))}
                            </div>

                            <div className="p-10 space-y-8">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-3xl font-black text-white">${currentTier.price}</h3>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Price</span>
                                </div>

                                <p className="text-xs font-bold text-slate-400 italic leading-relaxed">
                                    "{currentTier.description}"
                                </p>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            <span className="text-slate-500">Delivery Time</span>
                                        </div>
                                        <span className="text-white">{currentTier.deliveryTime} Days</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">sync</span>
                                            <span className="text-slate-500">Revisions</span>
                                        </div>
                                        <span className="text-white">{currentTier.revisions === -1 ? 'Unlimited' : currentTier.revisions}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {currentTier.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-[#4b2bee] text-sm font-black">check</span>
                                            <span className="text-xs font-bold text-slate-300">{feature}</span>
                                        </div>
                                    ))}
                                    {currentTier.hasCloudHosting && (
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-emerald-500 text-sm font-black">cloud_done</span>
                                            <span className="text-xs font-bold text-slate-300">Managed Cloud Hosting</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4">
                                    <button className="w-full py-5 bg-[#4b2bee] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#4b2bee]/90 transition-all shadow-xl shadow-[#4b2bee]/20 flex items-center justify-center gap-3">
                                        Continue (${currentTier.price})
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                    <button className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                                        Contact Agent
                                    </button>
                                </div>

                                <p className="text-[9px] font-black text-center text-slate-600 uppercase tracking-widest">
                                    Fully automated delivery via OpenClaw Engine
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
