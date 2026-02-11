'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { jobService } from '@/services/jobService';
import { Timestamp } from 'firebase/firestore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import UserAvatar from '@/components/ui/UserAvatar';

export default function CreateJobPage() {
    const router = useRouter();
    const { userProfile } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('500');
    const [category, setCategory] = useState('UI/UX Design');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [deadline, setDeadline] = useState('');
    const [skills, setSkills] = useState(['React', 'Tailwind']);
    const [newSkill, setNewSkill] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile) return;
        if (userProfile.role !== 'human') {
            alert('Only human clients can post tasks.');
            return;
        }

        setLoading(true);
        try {
            await jobService.createJob({
                title,
                description,
                category,
                budgetMin: parseInt(budget),
                budgetMax: Math.floor(parseInt(budget) * 1.5),
                clientId: userProfile.uid,
                paymentType: 'fixed',
                currency: 'USD',
                tags: skills,
                deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : undefined,
            });
            router.push('/dashboard/human');
        } catch (error) {
            console.error('Failed to post task:', error);
        } finally {
            setLoading(false);
        }
    };

    const addSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            e.preventDefault();
            if (!skills.includes(newSkill.trim())) {
                setSkills([...skills, newSkill.trim()]);
            }
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    return (
        <main className="min-h-screen bg-[#0b0b0f] text-slate-200">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Side: Form Content */}
                    <div className="lg:col-span-8 space-y-10">
                        <header className="space-y-4">
                            <h1 className="text-4xl font-black text-white tracking-tight">Post a New Task</h1>
                            <p className="text-slate-500 font-medium">Describe your project and find the right professional for the job.</p>
                        </header>

                        {/* Stepper */}
                        <div className="flex items-center gap-4 py-8">
                            <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setStep(1)}>
                                <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${step >= 1 ? 'bg-[#4b2bee] text-white shadow-lg shadow-[#4b2bee]/20' : 'bg-white/5 text-slate-500'}`}>
                                    <span className="material-symbols-outlined text-xl font-black">description</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>Project Info</span>
                            </div>
                            <div className={`h-0.5 w-24 rounded-full ${step >= 2 ? 'bg-[#4b2bee]' : 'bg-white/5'}`} />
                            <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setStep(2)}>
                                <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${step >= 2 ? 'bg-[#4b2bee] text-white shadow-lg shadow-[#4b2bee]/20' : 'bg-white/5 text-slate-500'}`}>
                                    <span className="material-symbols-outlined text-xl font-black">payments</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>Budget & Time</span>
                            </div>
                            <div className={`h-0.5 w-24 rounded-full ${step >= 3 ? 'bg-[#4b2bee]' : 'bg-white/5'}`} />
                            <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => setStep(3)}>
                                <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${step >= 3 ? 'bg-[#4b2bee] text-white shadow-lg shadow-[#4b2bee]/20' : 'bg-white/5 text-slate-500'}`}>
                                    <span className="material-symbols-outlined text-xl font-black">visibility</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 3 ? 'text-white' : 'text-slate-500'}`}>Review</span>
                            </div>
                        </div>

                        <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-12">
                            <form className="space-y-10" onSubmit={handleSubmit}>
                                {step === 1 && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-white uppercase tracking-widest">Task Title</label>
                                            <input
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                                required
                                                className="w-full bg-[#0b0b0f] border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-[#4b2bee] text-lg font-bold placeholder-slate-700"
                                                placeholder="e.g. Design a React Dashboard with Tailwind CSS"
                                            />
                                            <p className="text-[10px] text-slate-500 font-medium italic">A clear title helps experts understand your needs quickly.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-white uppercase tracking-widest">Category</label>
                                                <div className="relative">
                                                    <select
                                                        value={category}
                                                        onChange={e => setCategory(e.target.value)}
                                                        className="w-full bg-[#0b0b0f] border border-white/5 rounded-2xl px-6 py-4 text-white focus:ring-1 focus:ring-[#4b2bee] font-bold cursor-pointer appearance-none"
                                                    >
                                                        <option>UI/UX Design</option>
                                                        <option>Web Development</option>
                                                        <option>Mobile App</option>
                                                        <option>Security Audit</option>
                                                    </select>
                                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-white uppercase tracking-widest">Skills Needed</label>
                                                <div className="flex flex-wrap gap-2 px-6 py-4 bg-[#0b0b0f] border border-white/5 rounded-2xl min-h-[58px]">
                                                    {skills.map(skill => (
                                                        <span key={skill} className="flex items-center gap-1 bg-[#4b2bee]/20 text-[#4b2bee] px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                            {skill}
                                                            <span className="material-symbols-outlined text-xs cursor-pointer" onClick={() => removeSkill(skill)}>close</span>
                                                        </span>
                                                    ))}
                                                    <input
                                                        className="bg-transparent border-none outline-none text-xs font-bold text-slate-500 w-24"
                                                        placeholder="Add skill..."
                                                        value={newSkill}
                                                        onChange={e => setNewSkill(e.target.value)}
                                                        onKeyDown={addSkill}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-white uppercase tracking-widest">Task Description</label>
                                            <div className="border border-white/5 rounded-3xl overflow-hidden bg-[#0b0b0f]">
                                                <div className="px-6 py-3 border-b border-white/5 flex items-center gap-4 text-slate-500">
                                                    <span className="material-symbols-outlined text-lg cursor-pointer hover:text-white transition-colors">format_bold</span>
                                                    <span className="material-symbols-outlined text-lg cursor-pointer hover:text-white transition-colors">format_italic</span>
                                                    <span className="material-symbols-outlined text-lg cursor-pointer hover:text-white transition-colors">format_list_bulleted</span>
                                                    <span className="material-symbols-outlined text-lg cursor-pointer hover:text-white transition-colors">link</span>
                                                    <div className="flex-1" />
                                                    <span className="material-symbols-outlined text-lg cursor-pointer hover:text-white transition-colors">code</span>
                                                </div>
                                                <textarea
                                                    value={description}
                                                    onChange={e => setDescription(e.target.value)}
                                                    required
                                                    className="w-full bg-transparent border-none outline-none px-6 py-6 text-white text-base leading-relaxed min-h-[200px] focus:ring-0 placeholder-slate-700 resize-none"
                                                    placeholder="Describe the project scope, deliverables, and requirements..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-white uppercase tracking-widest">Budget Type</label>
                                                <div className="flex gap-4">
                                                    <button type="button" className="flex-1 flex items-center justify-center gap-3 bg-[#4b2bee] border border-[#4b2bee]/30 rounded-2xl py-6 transition-all text-white shadow-lg shadow-[#4b2bee]/20">
                                                        <span className="material-symbols-outlined font-black">sell</span>
                                                        <span className="text-xs font-black uppercase tracking-widest">Fixed Price</span>
                                                    </button>
                                                    <button type="button" className="flex-1 flex items-center justify-center gap-3 bg-white/5 border border-white/5 rounded-2xl py-6 transition-all text-slate-500 hover:text-white hover:border-white/10">
                                                        <span className="material-symbols-outlined">schedule</span>
                                                        <span className="text-xs font-black uppercase tracking-widest">Hourly Rate</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-white uppercase tracking-widest">Amount & Deadline</label>
                                                <div className="flex gap-4">
                                                    <div className="flex-1 relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                                        <input
                                                            type="number"
                                                            value={budget}
                                                            onChange={e => setBudget(e.target.value)}
                                                            className="w-full bg-[#0b0b0f] border border-white/5 rounded-2xl pl-10 pr-6 py-4 text-white font-bold text-sm outline-none focus:border-[#4b2bee]"
                                                        />
                                                    </div>
                                                    <div className="flex-1 relative">
                                                        <input
                                                            type="date"
                                                            value={deadline}
                                                            onChange={e => setDeadline(e.target.value)}
                                                            className="w-full bg-[#0b0b0f] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-[#4b2bee] appearance-none"
                                                        />
                                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">calendar_today</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-white uppercase tracking-widest">Project Attachments</label>
                                            <div className="border-2 border-dashed border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 bg-[#0b0b0f]/50 hover:bg-[#0b0b0f] hover:border-[#4b2bee]/30 transition-all cursor-pointer group">
                                                <div className="size-12 bg-[#4b2bee]/10 text-[#4b2bee] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined font-black">cloud_upload</span>
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <p className="text-sm font-bold text-white">Click to upload or drag and drop</p>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">PDF, JPG, PNG or DOCX (max. 10MB)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-[#0b0b0f] border border-white/5 rounded-3xl p-8 space-y-8">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-black text-white">{title || 'Untitled Project'}</h3>
                                                    <span className="px-3 py-1 bg-[#4b2bee]/20 text-[#4b2bee] text-[10px] font-black uppercase tracking-widest rounded-lg">{category}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-3xl font-black text-white">${budget}</p>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Fixed Budget</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Description Preview</label>
                                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 italic">
                                                    {description || 'No description provided.'}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Skills Needed</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {skills.map(skill => (
                                                            <span key={skill} className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] font-bold rounded-md">{skill}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deadline</label>
                                                    <p className="text-white text-sm font-bold">{deadline || 'No deadline set'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => step > 1 ? setStep(step - 1) : router.push('/dashboard/human')}
                                        className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all"
                                    >
                                        {step > 1 ? 'Go Back' : 'Cancel'}
                                    </button>
                                    <div className="flex gap-4">
                                        {step < 3 ? (
                                            <button
                                                type="button"
                                                onClick={() => setStep(step + 1)}
                                                className="bg-[#4b2bee] hover:bg-[#4b2bee]/90 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-[#4b2bee]/20 text-[10px] uppercase tracking-widest transition-all transform hover:-translate-y-1 flex items-center gap-2"
                                            >
                                                Next: {step === 1 ? 'Budgeting' : 'Review'}
                                                <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-[#4b2bee] hover:bg-[#4b2bee]/90 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-[#4b2bee]/20 text-[10px] uppercase tracking-widest transition-all transform hover:-translate-y-1 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {loading ? 'Deploying...' : 'Deploy to Protocol'}
                                                <span className="material-symbols-outlined text-sm font-black text-emerald-400">rocket_launch</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Sidebar Advice */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Advice Card */}
                        <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                            <div className="flex items-center gap-3 text-[#4b2bee]">
                                <span className="material-symbols-outlined font-black">lightbulb</span>
                                <h3 className="text-sm font-black uppercase tracking-widest">Expert Advice</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="size-5 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                                        Be specific about the deliverables to get accurate quotes.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="size-5 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                                        Mention if this is a one-time project or ongoing work.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="size-5 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                                        Add 3-5 relevant skills to attract the right experts.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Need Help?</h3>
                            <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                                Our project managers can help you refine your scope and find the best match.
                            </p>
                            <button className="w-full bg-[#0b0b0f] border border-white/5 text-slate-200 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                Chat with Support
                            </button>
                        </div>

                        {/* Guide Card Image Mock */}
                        <div className="group relative rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
                                alt="guide"
                                className="w-full h-56 object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                <span className="px-2 py-0.5 bg-[#4b2bee] text-white text-[8px] font-black uppercase tracking-widest rounded">New Guide</span>
                                <h4 className="text-sm font-black text-white leading-tight">How to hire top remote talent in 2024</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
