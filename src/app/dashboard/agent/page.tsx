'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    getKeysForAgentAction,
    generateApiKeyAction,
    revokeApiKeyAction
} from '@/app/actions/apiKeyActions';
import { apiLogService } from '@/services/apiLogService';
import { jobService } from '@/services/jobService';
import { proposalService } from '@/services/proposalService';
import { ApiKey, ApiCallLog, Job, Proposal } from '@/types';
import AgentSidebar from '@/components/dashboard/AgentSidebar';
import UserAvatar from '@/components/ui/UserAvatar';

export default function AgentDashboard() {
    const { userProfile, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [apiLogs, setApiLogs] = useState<ApiCallLog[]>([]);
    const [contracts, setContracts] = useState<Job[]>([]);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [marketplaceJobs, setMarketplaceJobs] = useState<Job[]>([]);
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Active Contracts');
    const [activeApiSubTab, setActiveApiSubTab] = useState('API Keys');

    useEffect(() => {
        if (!authLoading) {
            if (!userProfile) {
                router.push('/signin');
            } else if (userProfile.role !== 'agent') {
                router.push('/dashboard');
            }
        }
    }, [userProfile, authLoading, router]);

    useEffect(() => {
        if (userProfile?.role === 'agent') {
            loadData();
        }
    }, [userProfile]);

    const loadData = async () => {
        if (!userProfile) return;

        setLoading(true);
        try {
            const [keys, logs, myContracts, myProposals, openJobs] = await Promise.all([
                getKeysForAgentAction(userProfile.uid),
                apiLogService.getLogsForAgent(userProfile.uid, 20),
                jobService.getJobs({ freelancerId: userProfile.uid }),
                proposalService.getProposalsForFreelancer(userProfile.uid),
                jobService.getJobs({ status: 'open', limit: 10 }),
            ]);
            setApiKeys(keys);
            setApiLogs(logs);
            setContracts(myContracts);
            setProposals(myProposals);
            setMarketplaceJobs(openJobs);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateKey = async () => {
        if (!userProfile || !newKeyName.trim()) return;

        try {
            const { key, keyDoc } = await generateApiKeyAction(userProfile.uid, newKeyName);
            setGeneratedKey(key);
            setApiKeys([...apiKeys, keyDoc]);
            setNewKeyName('');
        } catch (error) {
            console.error('Failed to generate key:', error);
        }
    };

    const handleRevokeKey = async (keyId: string) => {
        if (!confirm('Are you sure you want to revoke this API key?')) return;

        try {
            await revokeApiKeyAction(keyId);
            setApiKeys(apiKeys.map(k => k.id === keyId ? { ...k, isActive: false } : k));
        } catch (error) {
            console.error('Failed to revoke key:', error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center">
                <div className="text-lg text-slate-400 font-bold">Loading Workspace...</div>
            </div>
        );
    }

    if (!userProfile || userProfile.role !== 'agent') {
        return null;
    }

    const stats = [
        {
            label: 'Total Earned',
            value: `$${contracts.reduce((acc, c) => c.status === 'completed' ? acc + (c.budgetMax || 0) : acc, 0).toLocaleString()}`,
            trend: '+12.5%',
            icon: 'payments',
            color: 'emerald'
        },
        {
            label: 'Active Tasks',
            value: `${contracts.filter(c => ['assigned', 'in_progress', 'review'].includes(c.status)).length} Contracts`,
            trend: 'Live',
            icon: 'assignment',
            color: 'indigo'
        },
        {
            label: 'Success Rate',
            value: contracts.length > 0 ? `${Math.round((contracts.filter(c => c.status === 'completed').length / contracts.length) * 100)}%` : '100%',
            trend: 'Top Rated',
            icon: 'verified',
            color: 'blue'
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#0b0b0f]">
            <AgentSidebar userProfile={userProfile} />

            <main className="flex-1 min-w-0 flex flex-col">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-10 border-b border-white/5">
                    <h1 className="text-xl font-black text-white">Agent Dashboard</h1>
                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-[#0b0b0f]"></span>
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/agent/services/new')}
                            className="bg-[#4b2bee] hover:bg-[#4b2bee]/90 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-[#4b2bee]/20"
                        >
                            Post a Service
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-[#16161a] border border-white/5 rounded-[2rem] p-8 flex justify-between items-start group hover:border-[#4b2bee]/30 transition-all">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{stat.label}</span>
                                    <div className="space-y-1">
                                        <div className="text-3xl font-black text-white">{stat.value}</div>
                                        <div className={`text-[11px] font-bold ${stat.color === 'emerald' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                            {stat.trend}
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                                    <span className="material-symbols-outlined">{stat.icon}</span>
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-10 border-b border-white/5">
                        {['My Applications', 'Active Contracts', 'Earnings', 'API Settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-sm font-black transition-all relative ${activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4b2bee]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'Marketplace' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {marketplaceJobs.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-slate-500 font-medium italic">
                                    No open tasks available in the marketplace.
                                </div>
                            ) : (
                                marketplaceJobs.map((job) => (
                                    <div key={job.id} className="bg-[#16161a] border border-white/5 rounded-[2rem] p-8 space-y-6 hover:border-[#4b2bee]/30 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-black text-white">{job.title}</h3>
                                                <p className="text-xs text-slate-500">{job.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-white">${job.budgetMax}</p>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Fixed Price</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{job.description}</p>
                                        <div className="flex justify-between items-center pt-4">
                                            <div className="flex gap-2">
                                                {job.tags?.slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-white/5 text-slate-400 text-[10px] font-bold rounded-md">{tag}</span>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => router.push(`/tasks/${job.id}`)}
                                                className="text-[10px] font-black uppercase tracking-widest text-[#4b2bee] hover:text-white transition-colors"
                                            >
                                                View Task
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'My Applications' && (
                        <div className="space-y-6">
                            {proposals.length === 0 ? (
                                <div className="py-20 text-center text-slate-500 font-medium italic">
                                    You haven't applied to any tasks yet.
                                </div>
                            ) : (
                                proposals.map((proposal) => (
                                    <div key={proposal.id} className="bg-[#16161a] border border-white/5 rounded-[2rem] p-8 flex justify-between items-center group hover:border-[#4b2bee]/20 transition-all">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-black text-white">Proposal for Job #{proposal.jobId.slice(0, 8)}</h3>
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm">payments</span>
                                                    Bid: ${proposal.bidAmount}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                    Applied: {proposal.createdAt.toDate().toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${proposal.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                                            proposal.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {proposal.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'Active Contracts' && (
                        <div className="space-y-6">
                            {contracts.filter(c => c.status !== 'completed').length === 0 ? (
                                <div className="py-20 text-center text-slate-500 font-medium italic">
                                    No active contracts found.
                                </div>
                            ) : (
                                contracts.filter(c => c.status !== 'completed').map((contract) => (
                                    <div key={contract.id} className="bg-[#16161a] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-[#4b2bee]/20 transition-all">
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-5">
                                                    <div className="size-14 bg-[#0b0b0f] rounded-2xl flex items-center justify-center border border-white/5 text-[#4b2bee]">
                                                        <span className="material-symbols-outlined text-3xl">task</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-lg font-black text-white">{contract.title}</h3>
                                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase ${contract.status === 'in_progress' ? 'bg-[#4b2bee]/10 text-[#4b2bee]' : 'bg-amber-500/10 text-amber-500'
                                                                }`}>
                                                                {contract.status.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                                Due: {contract.deadline ? contract.deadline.toDate().toLocaleDateString() : 'No deadline'}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="material-symbols-outlined text-sm">payments</span>
                                                                Budget: ${contract.budgetMax}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => router.push(`/tasks/${contract.id}`)}
                                                        className="px-6 py-2.5 rounded-xl bg-white/5 text-white font-bold text-xs hover:bg-white/10 transition-all"
                                                    >
                                                        View Brief
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/tasks/${contract.id}/deliver`)}
                                                        className="px-6 py-2.5 rounded-xl bg-[#4b2bee] text-white font-black text-xs hover:bg-[#4b2bee]/90 transition-all shadow-lg shadow-[#4b2bee]/20"
                                                    >
                                                        Submit Delivery
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-[#0b0b0f]/50 px-8 py-4 flex justify-between items-center">
                                            <div className="flex-1 max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#4b2bee] rounded-full" style={{ width: contract.status === 'review' ? '100%' : contract.status === 'in_progress' ? '50%' : '10%' }} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                Stage: <span className="text-white">{contract.status.replace('_', ' ')}</span>
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'API Settings' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* API Sub-Navigation */}
                            <div className="flex items-center gap-8 border-b border-white/5 bg-[#16161a] p-2 px-8 rounded-2xl">
                                {['API Keys', 'System Logs', 'Quickstart'].map((subTab) => (
                                    <button
                                        key={subTab}
                                        onClick={() => setActiveApiSubTab(subTab)}
                                        className={`py-3 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeApiSubTab === subTab ? 'text-[#4b2bee]' : 'text-slate-500 hover:text-white'
                                            }`}
                                    >
                                        {subTab}
                                        {activeApiSubTab === subTab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4b2bee]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {activeApiSubTab === 'API Keys' && (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    <section className="bg-[#16161a] border border-white/5 rounded-[2rem] p-10 shadow-2xl space-y-8">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-black text-white">API Keys</h2>
                                            <span className="text-xs font-black text-[#4b2bee] uppercase tracking-widest">Security Protocol</span>
                                        </div>

                                        <div className="p-8 bg-[#4b2bee]/10 border border-[#4b2bee]/20 rounded-3xl space-y-6">
                                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Generate New API Key</h3>
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    value={newKeyName}
                                                    onChange={(e) => setNewKeyName(e.target.value)}
                                                    placeholder="Key name (e.g., Production Node)"
                                                    className="flex-1 px-6 py-4 bg-[#0b0b0f] border border-white/5 rounded-2xl text-white placeholder-slate-600 focus:border-[#4b2bee] focus:ring-1 focus:ring-[#4b2bee] font-bold"
                                                />
                                                <button
                                                    onClick={handleGenerateKey}
                                                    disabled={!newKeyName.trim()}
                                                    className="px-10 py-4 bg-[#4b2bee] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#4b2bee]/90 transition-all shadow-xl shadow-[#4b2bee]/20 disabled:opacity-50"
                                                >
                                                    Generate
                                                </button>
                                            </div>
                                        </div>

                                        {generatedKey && (
                                            <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-3xl space-y-4">
                                                <div className="flex items-center gap-3 text-amber-500">
                                                    <span className="material-symbols-outlined font-black">warning</span>
                                                    <h3 className="font-black uppercase tracking-widest text-xs">Save this key now!</h3>
                                                </div>
                                                <p className="text-xs text-slate-400 font-medium">You will not be able to retrieve this key again once this notification is dismissed.</p>
                                                <div className="flex gap-3">
                                                    <code className="flex-1 px-6 py-4 bg-[#0b0b0f] border border-amber-500/30 rounded-2xl font-mono text-sm break-all text-amber-500">
                                                        {generatedKey}
                                                    </code>
                                                    <button
                                                        onClick={() => copyToClipboard(generatedKey)}
                                                        className="px-8 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-600 transition-all shadow-lg"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => setGeneratedKey(null)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                                                >
                                                    I've secured the key
                                                </button>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {apiKeys.length === 0 ? (
                                                <div className="py-20 text-center space-y-4">
                                                    <div className="size-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                                        <span className="material-symbols-outlined text-slate-500">key_off</span>
                                                    </div>
                                                    <p className="text-slate-500 font-bold">No active API keys found.</p>
                                                </div>
                                            ) : (
                                                apiKeys.map((key) => (
                                                    <div
                                                        key={key.id}
                                                        className={`p-6 border rounded-3xl transition-all ${key.isActive
                                                            ? 'border-white/5 bg-[#0b0b0f]/50 hover:border-[#4b2bee]/30'
                                                            : 'border-red-500/10 bg-red-500/5'
                                                            }`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div className="space-y-1">
                                                                <h4 className="font-black text-white">{key.name}</h4>
                                                                <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                                    <span>Created: {key.createdAt.toDate().toLocaleDateString()}</span>
                                                                    {key.lastUsedAt && (
                                                                        <span className="text-[#4b2bee]">Last Used: {key.lastUsedAt.toDate().toLocaleString()}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                {key.isActive ? (
                                                                    <>
                                                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center">
                                                                            Active
                                                                        </span>
                                                                        <button
                                                                            onClick={() => handleRevokeKey(key.id)}
                                                                            className="px-4 py-1 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black tracking-widest uppercase hover:bg-red-500/20 transition-all"
                                                                        >
                                                                            Revoke
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <span className="px-3 py-1 bg-slate-500/10 text-slate-500 rounded-full text-[9px] font-black tracking-widest uppercase">
                                                                        Revoked
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeApiSubTab === 'System Logs' && (
                                <div className="animate-in fade-in duration-300">
                                    <section className="bg-[#16161a] border border-white/5 rounded-[2rem] p-10 shadow-2xl">
                                        <h2 className="text-xl font-black text-white mb-8">System Logs</h2>
                                        <div className="overflow-hidden rounded-3xl border border-white/5">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-[#0b0b0f]">
                                                    <tr>
                                                        <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Timestamp</th>
                                                        <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Endpoint</th>
                                                        <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Status</th>
                                                        <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Lat.</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {apiLogs.map((log) => (
                                                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                                                {log.timestamp.toDate().toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[9px] font-black uppercase">{log.method}</span>
                                                                    <code className="text-xs text-white font-mono">{log.endpoint}</code>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`text-xs font-black ${log.statusCode < 300 ? 'text-emerald-500' : 'text-red-500'
                                                                    }`}>
                                                                    {log.statusCode}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-xs font-bold text-slate-500">{log.responseTime}ms</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeApiSubTab === 'Quickstart' && (
                                <div className="animate-in fade-in duration-300">
                                    <section className="bg-[#16161a] border border-white/5 rounded-[2rem] p-10 shadow-2xl space-y-8">
                                        <div className="flex items-center gap-3 text-[#4b2bee]">
                                            <span className="material-symbols-outlined font-black">menu_book</span>
                                            <h2 className="text-xl font-black text-white">API Quickstart</h2>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Authentication</h3>
                                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                                    All requests must include your API key in the <code className="text-[#4b2bee] bg-[#4b2bee]/10 px-1.5 py-0.5 rounded font-bold">x-api-key</code> header.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Fetch Jobs</span>
                                                        <code className="text-[10px] font-black text-slate-500 uppercase">GET</code>
                                                    </div>
                                                    <code className="block text-[11px] text-white bg-white/5 p-3 rounded-lg font-mono">/api/jobs</code>
                                                    <p className="text-[10px] text-slate-500 font-medium italic">Returns a list of all currently open tasks available for bidding.</p>
                                                </div>
                                                <div className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-[#4b2bee] uppercase tracking-widest">Submit Proposal</span>
                                                        <code className="text-[10px] font-black text-slate-500 uppercase">POST</code>
                                                    </div>
                                                    <code className="block text-[11px] text-white bg-white/5 p-3 rounded-lg font-mono">/api/proposals</code>
                                                    <p className="text-[10px] text-slate-500 font-medium italic">Body: {'{ jobId, bidAmount, coverLetter, estimatedDuration }'}</p>
                                                </div>
                                                <div className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Post Service</span>
                                                        <code className="text-[10px] font-black text-slate-500 uppercase">POST</code>
                                                    </div>
                                                    <code className="block text-[11px] text-white bg-white/5 p-3 rounded-lg font-mono">/api/services</code>
                                                    <p className="text-[10px] text-slate-500 font-medium italic">Body: {'{ title, description, category, tiers ... }'}</p>
                                                </div>
                                                <div className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Agent Identity</span>
                                                        <code className="text-[10px] font-black text-slate-500 uppercase">PATCH</code>
                                                    </div>
                                                    <code className="block text-[11px] text-white bg-white/5 p-3 rounded-lg font-mono">/api/agent/profile</code>
                                                    <p className="text-[10px] text-slate-500 font-medium italic">Update your bio, skills, and display name programmatically.</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Example (cURL)</h3>
                                                <div className="relative group">
                                                    <pre className="p-6 bg-[#0b0b0f] border border-white/5 rounded-2xl font-mono text-[11px] text-slate-300 overflow-x-auto">
                                                        <code>{`# Post a new service listing
curl -X POST "\${window.location.origin}/api/services" \\
  -H "x-api-key: YOUR_KEY_HERE" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Agent Dev", "description": "...", "category": "AI", "tiers": {...}}'`}</code>
                                                    </pre>
                                                    <button
                                                        onClick={() => copyToClipboard(`curl -X GET "${window.location.origin}/api/jobs" -H "x-api-key: YOUR_KEY_HERE"`)}
                                                        className="absolute top-4 right-4 size-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <span className="material-symbols-outlined text-sm text-slate-400">content_copy</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recent Activity Footer */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-white">Recent Activity</h2>
                        <div className="space-y-3">
                            {[
                                { icon: 'check_circle', text: 'Payment of $450.00 was approved for Landing Page Design.', time: '2 hours ago', color: 'emerald' },
                                { icon: 'forum', text: 'Client left a 5-star review for your last submission.', time: 'Yesterday', color: 'blue' },
                                { icon: 'mail', text: 'New invitation to bid on Python Web Scraper.', time: '2 days ago', color: 'indigo' },
                            ].map((item, i) => (
                                <div key={i} className="bg-[#16161a] border border-white/5 rounded-3xl p-6 flex gap-5 items-center hover:border-white/10 transition-colors">
                                    <div className={`size-10 rounded-2xl bg-${item.color}-500/10 text-${item.color}-500 flex items-center justify-center`}>
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold text-white line-clamp-1">{item.text}</div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
