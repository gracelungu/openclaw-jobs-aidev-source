
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface LayoutProps {
  currentRole: UserRole | null;
  onSignOut: () => void;
}

const Layout: React.FC<LayoutProps> = ({ currentRole, onSignOut }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDashboardView = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/review') ||
                          location.pathname.includes('/create-task');

  // Sync body scroll lock with mobile menu state
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card-dark">
      <div className="p-6 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          {(isSidebarOpen || isMobileMenuOpen) && <span className="text-xl font-black tracking-tight text-white">OpenClaw</span>}
        </Link>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-semibold text-sm">Dashboard</span>}
        </Link>
        <Link to="/tasks" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${location.pathname === '/tasks' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
          <span className="material-symbols-outlined">explore</span>
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium text-sm">Marketplace</span>}
        </Link>
        <Link to="/agents" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-400 hover:bg-white/5 hover:text-white`}>
          <span className="material-symbols-outlined">groups</span>
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium text-sm">Agents</span>}
        </Link>
        
              </nav>

      <div className="p-4 mt-auto border-t border-border-dark">
        <div className="flex items-center gap-3 p-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50 overflow-hidden">
            <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          {(isSidebarOpen || isMobileMenuOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-white">Alex Rivera</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentRole}</p>
            </div>
          )}
        </div>
        <button 
          onClick={onSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all`}
        >
          <span className="material-symbols-outlined">logout</span>
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-bold text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  if (isDashboardView && currentRole) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#0b0b0f]">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:flex ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-border-dark flex-col bg-card-dark z-50`}>
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <div className="absolute inset-0 bg-background-dark shadow-2xl" onClick={() => setIsMobileMenuOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card-dark border-r border-border-dark animate-in slide-in-from-left duration-300">
              <SidebarContent />
            </aside>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-background-dark custom-scrollbar flex flex-col">
          <header className="h-16 border-b border-border-dark flex items-center justify-between px-4 md:px-8 bg-card-dark/50 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <button onClick={() => window.innerWidth < 1024 ? setIsMobileMenuOpen(true) : setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                <span className="material-symbols-outlined">menu</span>
              </button>
              <h1 className="text-sm font-black text-white uppercase tracking-widest hidden sm:block">Protocol Node</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/signin')} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Switch Role</button>
              <button className="size-9 rounded-lg border border-border-dark flex items-center justify-center text-slate-400 hover:bg-white/5 relative">
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full"></span>
              </button>
            </div>
          </header>
          <div className="p-4 md:p-8 flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  // Marketing Layout
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-[#0b0b0f]/80 backdrop-blur-md px-4 md:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="size-8 md:size-9 bg-primary flex items-center justify-center rounded-lg shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-base md:text-xl">rocket_launch</span>
            </div>
            <h2 className="text-lg md:text-xl font-bold leading-tight tracking-tight text-white whitespace-nowrap">OpenClaw</h2>
          </Link>
          <nav className="hidden lg:flex items-center gap-10">
            <Link to="/tasks" className="text-sm font-medium hover:text-primary transition-colors">Marketplace</Link>
            <Link to="/agents" className="text-sm font-medium hover:text-primary transition-colors">Agents</Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            {currentRole ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link to="/dashboard" className="hidden sm:block text-sm font-bold text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all border border-border-dark">Dashboard</Link>
                <div className="size-8 md:size-9 rounded-full bg-primary/20 border border-primary/50 overflow-hidden cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/signin" className="text-sm font-bold text-slate-400 hover:text-white px-4 py-2">Sign In</Link>
                <Link to="/signup" className="bg-primary hover:bg-primary/90 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-bold shadow-lg shadow-primary/20 transition-all">Sign Up</Link>
              </div>
            )}
            <button
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="lg:hidden p-2 text-slate-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[300] lg:hidden isolate">
            <div
              className="absolute inset-0 bg-[#0b0b0f]/96 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <div className="absolute right-0 top-0 bottom-0 z-[310] w-full max-w-xs bg-[#16161a] p-8 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-right duration-300 border-l border-[#292348]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  </div>
                  <span className="text-lg font-black tracking-tight text-white">Menu</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <nav className="flex flex-col gap-6 text-xl font-bold">
                <Link to="/tasks" className="hover:text-primary transition-colors flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">explore</span> Marketplace
                </Link>
                <Link to="/agents" className="hover:text-primary transition-colors flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">groups</span> Agents
                </Link>
                <Link to="/how-it-works" className="hover:text-primary transition-colors flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">help</span> How it Works
                </Link>
                <div className="h-px bg-border-dark my-2" />
                {currentRole ? (
                  <Link to="/dashboard" className="text-white bg-primary px-6 py-3 rounded-xl text-center shadow-lg shadow-primary/20">Dashboard</Link>
                ) : (
                  <>
                    <Link to="/signin" className="text-slate-400 hover:text-white transition-colors">Sign In</Link>
                    <Link to="/signup" className="text-white bg-primary px-6 py-3 rounded-xl text-center shadow-lg shadow-primary/20">Sign Up</Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-12 border-t border-border-dark bg-card-dark/30 mt-auto px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex items-center gap-2">
             <span className="material-symbols-outlined text-primary text-2xl">verified</span>
             <p className="text-sm text-slate-500">© 2023 OpenClaw Protocol. Decentralized Work OS.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Whitepaper</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
