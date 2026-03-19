import React, { useState } from 'react';
import { type View } from './MainApplication';
import { type Plan } from './plans';

const Logo = () => (
    <a href="/" className="flex items-center">
        <img 
          src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
          alt="Ladamark Logo" 
          style={{ width: '150px', height: 'auto' }}
        />
    </a>
);

// --- ICONS ---
const XIcon = ({className = "w-6 h-6"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const DashboardIcon = ({className = "w-5 h-5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const SettingsIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const LogoutIcon = ({className = "w-5 h-5"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const HistoryIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" strokeWidth="1.75" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
       <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
       <path d="M12 8l0 4l2 2" />
       <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
    </svg>
);
const ControlsIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.75h18M3 12h18M3 19.25h18M8.25 2.75v4M15.75 10v4M12 17.25v4" /></svg>;

// New Icons
const UpgradeIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 10.5l3.75-3.75 3.75 3.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 13.5L12 17.25l-3.75-3.75" />
    </svg>
);
const CatalogIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>;
const AILabellingIcon = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 10l3-3 3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l3 3 3-3" />
    </svg>
);
const CalculatorIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);
const SeoTagIcon = ({className = "w-5 h-5"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);

interface SidebarProps {
    view: View;
    setView: (view: View) => void;
    onClose: () => void;
    labeledItemsCount: number;
    pendingFilesCount: number;
    onLogout: () => void;
    userName: string;
    plan: Plan;

    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const NavLink: React.FC<{isActive: boolean; onClick: () => void; children: React.ReactNode; count?: number}> = ({isActive, onClick, children, count}) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm ${isActive ? 'bg-[var(--accent-bg-subtle)] text-[var(--accent-text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]'}`}>
        <div className="flex items-center gap-3 font-semibold">{children}</div>
        {count !== undefined && count > 0 && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--accent-primary)]/20 text-[var(--accent-text-primary)]'}`}>{count}</span>
        )}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ 
  view, 
  setView, 
  onClose, 
  labeledItemsCount, 
  pendingFilesCount, 
  onLogout, 
  userName, 
  plan,
  theme,
  setTheme
}) => {

    const handleNav = (targetView: View) => {
        setView(targetView);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in-up" style={{animationDuration: '0.3s'}} onClick={onClose} />
            <aside className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[var(--background-secondary)] border-r border-[var(--border-primary)] p-4 flex flex-col animate-fade-in-up" style={{animationDuration: '0.4s'}}>
                <div className="flex items-center justify-between mb-6 px-2">
                    <Logo />
                    <button onClick={onClose} className="p-1 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                        <XIcon />
                    </button>
                </div>

                <nav className="flex-grow space-y-1.5">
                    {/* Labelling Hub */}
                    <div className="pt-1 pb-1 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Labelling Hub</div>
                    <NavLink isActive={view === 'dashboard'} onClick={() => handleNav('dashboard')}>
                        <DashboardIcon /> Dashboard
                    </NavLink>
                    <NavLink isActive={view === 'ai-labelling'} onClick={() => handleNav('ai-labelling')} count={pendingFilesCount}>
                        <AILabellingIcon /> AI Labelling
                    </NavLink>
                    <NavLink isActive={view === 'catalog'} onClick={() => handleNav('catalog')} count={labeledItemsCount}>
                        <CatalogIcon /> Catalog
                    </NavLink>
                    <NavLink isActive={view === 'history'} onClick={() => handleNav('history')}>
                        <HistoryIcon /> Label Activity
                    </NavLink>

                    {/* Libraries */}
                    <div className="pt-3 pb-1 px-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Libraries</div>
                     <NavLink isActive={view === 'attributes'} onClick={() => handleNav('attributes')}>
                        <ControlsIcon /> Attributes Library
                    </NavLink>
                     <NavLink isActive={view === 'seo'} onClick={() => handleNav('seo')}>
                        <SeoTagIcon /> SEO Library
                    </NavLink>
                     <NavLink isActive={view === 'pricing'} onClick={() => handleNav('pricing')}>
                        <CalculatorIcon /> Pricing Library
                    </NavLink>
                </nav>
                
                {plan === 'free' && (
                    <div className="px-2 my-4">
                        <button
                            onClick={() => handleNav('payment-details')}
                            className="group w-full relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-[var(--accent-primary)] to-red-600 shadow-lg shadow-red-500/20 transition-all duration-300 transform hover:scale-105 hover:shadow-red-500/40"
                        >
                            <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            <UpgradeIcon className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
                            <span>Upgrade to Pro</span>
                        </button>
                    </div>
                )}


{/* THEME SWITCH */}
<div className="px-2 mb-4">
  <div className="flex items-center justify-between bg-[var(--background-primary)] border border-[var(--border-primary)] rounded-xl p-1">
    
    <button
      onClick={() => setTheme('light')}
      className={`w-1/2 px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
        theme === 'light'
          ? 'bg-[var(--background-secondary)] text-[var(--text-primary)] shadow-sm'
          : 'text-[var(--text-secondary)]'
      }`}
    >
      ☀️ Light
    </button>

    <button
      onClick={() => setTheme('dark')}
      className={`w-1/2 px-3 py-1.5 text-sm font-semibold rounded-lg transition ${
        theme === 'dark'
          ? 'bg-[var(--background-secondary)] text-[var(--text-primary)] shadow-sm'
          : 'text-[var(--text-secondary)]'
      }`}
    >
      🌙 Dark
    </button>

  </div>
</div>>

                <div className="space-y-1.5 border-t border-[var(--border-primary)] pt-3 mt-auto">
                     <NavLink isActive={view === 'controls' || view === 'payment-details'} onClick={() => handleNav('controls')}>
                        <SettingsIcon /> Settings
                    </NavLink>
                     <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm text-[var(--text-secondary)] hover:bg-[var(--background-hover)] hover:text-[var(--text-primary)]">
                        <LogoutIcon />
                        <span className="font-semibold">Logout</span>
                    </button>
                    <div className="text-xs text-center text-[var(--text-muted)] px-3 pt-2">
                        &copy; {new Date().getFullYear()} Ladamark, Inc.
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;