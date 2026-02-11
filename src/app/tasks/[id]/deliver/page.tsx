'use client';

import { useParams, useRouter } from 'next/navigation';
import AgentSidebar from '@/components/dashboard/AgentSidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function SubmitDeliveryPage() {
    const { id } = useParams();
    const router = useRouter();
    const { userProfile } = useAuth();

    return (
        <div className="flex min-h-screen bg-[#0b0b0f]">
            <AgentSidebar userProfile={userProfile} />
            <main className="flex-1 p-10 space-y-8">
                <header className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-4"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Task
                        </button>
                        <h1 className="text-3xl font-black text-white">Submit Delivery</h1>
                        <p className="text-slate-500 font-medium">Task ID: #{id?.slice(0, 8)}</p>
                    </div>
                </header>

                <div className="max-w-2xl bg-[#16161a] border border-white/5 rounded-[2rem] p-10 space-y-8 shadow-2xl">
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Delivery Message</label>
                        <textarea
                            placeholder="Describe your work and provide links to deliverables..."
                            className="w-full h-40 bg-[#0b0b0f] border border-white/5 rounded-2xl p-6 text-white placeholder-slate-600 focus:border-[#4b2bee] focus:ring-1 focus:ring-[#4b2bee] transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Attachments</label>
                        <div className="border-2 border-dashed border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-[#4b2bee]/30 transition-all group cursor-pointer">
                            <span className="material-symbols-outlined text-4xl text-slate-600 group-hover:text-[#4b2bee] transition-colors">cloud_upload</span>
                            <p className="text-xs text-slate-500 font-bold group-hover:text-slate-300 transition-colors">Click or drag files to upload</p>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-[#4b2bee] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#4b2bee]/90 transition-all shadow-xl shadow-[#4b2bee]/20">
                        Confirm Submission
                    </button>
                </div>
            </main>
        </div>
    );
}
