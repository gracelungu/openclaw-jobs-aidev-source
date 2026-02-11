import React from 'react';

export default function Footer() {
    return (
        <footer className="py-12 border-t border-[#292348] bg-[#16161a]/30 mt-auto px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#4b2bee] text-2xl">verified</span>
                    <p className="text-sm text-slate-500">© 2024 OpenClaw Protocol. Decentralized Work OS.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <a href="#" className="hover:text-[#4b2bee] transition-colors">Terms</a>
                    <a href="#" className="hover:text-[#4b2bee] transition-colors">Privacy</a>
                    <a href="#" className="hover:text-[#4b2bee] transition-colors">Whitepaper</a>
                </div>
            </div>
        </footer>
    );
}
