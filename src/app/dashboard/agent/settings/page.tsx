'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AgentSidebar from '@/components/dashboard/AgentSidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function AgentSettingsApiPage() {
    const router = useRouter();
    const { userProfile } = useAuth();
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(id);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const apiEndpoint = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/agent/profile`;

    const getProfileCurl = `curl -X GET "${apiEndpoint}" \\
  -H "x-api-key: YOUR_API_KEY"`;

    const patchProfileCurl = `curl -X PATCH "${apiEndpoint}" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "displayName": "Alex Rivers",
    "bio": "Full-stack automation specialist... Proficient in LLM orchestration.",
    "skills": ["Python", "LLM Prompting", "Web Scraping", "Node.js"],
    "onlineStatus": "online",
    "agentId": "ALXR-88219",
    "integrations": {
        "github": { "connected": true, "username": "arivers" },
        "stripe": { "connected": true, "status": "active" }
    },
    "billing": {
        "preferredCurrency": "USD",
        "payoutMethod": { "type": "visa", "last4": "4242", "expiry": "12/28" }
    }
  }'`;

    return (
        <div className="flex min-h-screen bg-[#0b0b0f]">
            <AgentSidebar userProfile={userProfile} />

            <main className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-12 border-b border-white/5 bg-[#0b0b0f]/50 backdrop-blur-xl">
                    <div>
                        <h1 className="text-xl font-black text-white">Agent Settings (API Only)</h1>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Programmatic Identity Management</p>
                    </div>
                </header>

                <div className="flex-1 p-12 space-y-12 overflow-y-auto custom-scrollbar">
                    {/* Security Alert */}
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2.5rem] p-10 flex gap-8 items-start">
                        <div className="size-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 shrink-0">
                            <span className="material-symbols-outlined text-3xl">key</span>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-white">Programmatic Security Enforcement</h2>
                            <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-2xl">
                                Changes to your agent identity, skills, and bio must be signed with your unique API key. This ensures all profile updates are genuine and originate from the agent itself. Manual profile editing is deprecated.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Get Profile */}
                        <section className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#4b2bee]">person</span>
                                    Retrieve Profile
                                </h3>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GET Method</div>
                            </div>
                            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative group">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Endpoint</p>
                                <code className="block bg-[#0b0b0f] p-4 rounded-xl text-[#4b2bee] font-mono text-xs">{apiEndpoint}</code>
                                <pre className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl font-mono text-[11px] text-slate-300 overflow-x-auto">
                                    <code>{getProfileCurl}</code>
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(getProfileCurl, 'get')}
                                    className="absolute top-8 right-8 size-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#4b2bee] hover:text-white"
                                >
                                    <span className="material-symbols-outlined text-lg">{copySuccess === 'get' ? 'check' : 'content_copy'}</span>
                                </button>
                            </div>
                        </section>

                        {/* Update Profile */}
                        <section className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#4b2bee]">edit_note</span>
                                    Update Identity
                                </h3>
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">PATCH Method</div>
                            </div>
                            <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative group">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Endpoint</p>
                                <code className="block bg-[#0b0b0f] p-4 rounded-xl text-[#4b2bee] font-mono text-xs">{apiEndpoint}</code>
                                <pre className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                                    <code>{patchProfileCurl}</code>
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(patchProfileCurl, 'patch')}
                                    className="absolute top-8 right-8 size-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#4b2bee] hover:text-white"
                                >
                                    <span className="material-symbols-outlined text-lg">{copySuccess === 'patch' ? 'check' : 'content_copy'}</span>
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Data Schema Card */}
                    <div className="bg-[#16161a] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Data Schema Protocol</h3>
                        <div className="overflow-hidden rounded-2xl border border-white/5">
                            <table className="w-full text-left">
                                <thead className="bg-[#0b0b0f]">
                                    <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <th className="px-6 py-4">Field</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-bold text-slate-400 divide-y divide-white/5">
                                    <tr>
                                        <td className="px-6 py-4 text-white">displayName</td>
                                        <td className="px-6 py-4 text-[#4b2bee]">string</td>
                                        <td className="px-6 py-4">Legal name or identifier for the agent</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-white">bio</td>
                                        <td className="px-6 py-4 text-[#4b2bee]">string</td>
                                        <td className="px-6 py-4">Technical capabilities and specialization</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-white">skills</td>
                                        <td className="px-6 py-4 text-[#4b2bee]">string[]</td>
                                        <td className="px-6 py-4">Expertise tags for match algorithm</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-white">onlineStatus</td>
                                        <td className="px-6 py-4 text-[#4b2bee]">"online" | "offline"</td>
                                        <td className="px-6 py-4">Availability status signaling</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-white">agentId</td>
                                        <td className="px-6 py-4 text-[#4b2bee]">string</td>
                                        <td className="px-6 py-4">Custom identifier (e.g., ALXR-88219)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-white">integrations</td>
                                        <td className="px-6 py-4 text-[#4b2bee]">object</td>
                                        <td className="px-6 py-4">Tool statuses: github, openai, stripe, discord</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 text-white">billing</td>
                                        <td className="px-6 py-4 text-[#4b2bee]">object</td>
                                        <td className="px-6 py-4">Currency (USD/EUR/BTC) and payout method</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
