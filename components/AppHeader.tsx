



import React, { useState, useEffect, useRef } from 'react';
import { type View } from './MainApplication';
import { type UserProfile } from '../App';

const MenuIcon = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const SettingsIcon = ({className = "w-4 h-4"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33-1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const LogoutIcon = ({className = "w-4 h-4"}) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const SunIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

const MoonIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const LightningIcon = ({ className = 'h-4 w-4' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ThemeToggle: React.FC<{ theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void; }> = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-bg-subtle)] transition-colors duration-300 focus:outline-none"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
        </button>
    );
};

const DailyQuotaIndicator: React.FC<{ used: number; limit: number }> = ({ used, limit }) => (
  <div className="relative group flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] border border-[var(--border-secondary)] rounded-full px-3 py-1.5 transition-colors hover:border-[var(--accent-primary)]/50 hover:bg-[var(--accent-bg-muted)]">
    <LightningIcon className="h-4 w-4 text-[var(--accent-primary)]" />
    <span className="text-[var(--text-primary)]">{used}</span>
    <span className="text-[var(--text-muted)]">/</span>
    <span className="text-[var(--text-muted)]">{limit}</span>
    
    <div className="absolute top-full right-0 mt-2 w-max max-w-xs px-3 py-2 bg-[var(--background-tertiary)] border border-[var(--border-secondary)] text-[var(--text-secondary)] text-xs font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
        You have used <span className="font-bold text-[var(--text-primary)]">{used}</span> of your <span className="font-bold text-[var(--text-primary)]">{limit}</span> daily image labels.
        <br />
        Quota resets at midnight UTC.
    </div>
  </div>
);


interface AppHeaderProps {
    onMenuClick: () => void;
    onLogout: () => void;
    setView: (view: View) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    profile: UserProfile;
    quota: {
        daily: { used: number; limit: number };
        monthly: { used: number; limit: number };
    };
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick, onLogout, setView, theme, setTheme, profile, quota }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSettingsClick = () => {
        setView('controls');
        setIsProfileMenuOpen(false);
    };

    const handleLogoutClick = () => {
        onLogout();
        setIsProfileMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-[var(--background-secondary-translucent)] backdrop-blur-lg border-b border-[var(--border-primary)]">
            <div className="container mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
                {/* Left Section */}
                <div className="flex items-center justify-start">
                    <button onClick={onMenuClick} className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-tertiary)] transition-colors">
                        <MenuIcon />
                    </button>
                </div>
                
                {/* Center Section (Empty) */}
                <div className="flex-1" />

                {/* Right Section */}
                <div className="flex items-center justify-end gap-2">
                    <ThemeToggle theme={theme} setTheme={setTheme} />
                    <DailyQuotaIndicator used={quota.daily.used} limit={quota.daily.limit} />
                    <div className="relative" ref={profileMenuRef}>
                        <button onClick={() => setIsProfileMenuOpen(p => !p)} className="w-9 h-9 rounded-full bg-[var(--background-tertiary)] hover:bg-[var(--background-hover)] border border-[var(--border-secondary)]/50 transition-colors flex items-center justify-center overflow-hidden">
                             <img src={profile.profilePic} alt={profile.name} className="w-full h-full object-cover" />
                        </button>
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-lg shadow-2xl z-20 overflow-hidden animate-fade-in-up" style={{animationDuration: '0.2s'}}>
                                <div className="p-2 border-b border-[var(--border-primary)]">
                                    <p className="text-sm font-semibold text-[var(--text-primary)] px-2 truncate">{profile.name}</p>
                                    <p className="text-xs text-[var(--text-muted)] px-2">user@example.com</p>
                                </div>
                                <div className="p-2 border-b border-[var(--border-primary)]">
                                    <p className="px-2 text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Monthly Usage</p>
                                    <div className="px-2">
                                        <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)] mb-1">
                                            <span>{quota.monthly.used} / {quota.monthly.limit}</span>
                                            <span>{((quota.monthly.used / quota.monthly.limit) * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-[var(--background-tertiary)] rounded-full h-1.5">
                                            <div className="bg-[var(--accent-primary)] h-1.5 rounded-full" style={{ width: `${(quota.monthly.used / quota.monthly.limit) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-1">
                                    <button onClick={handleSettingsClick} className="w-full text-left flex items-center gap-3 px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--accent-bg-muted)] hover:text-[var(--accent-text-primary)] transition-colors rounded-md">
                                        <SettingsIcon />
                                        Settings
                                    </button>
                                    <button onClick={handleLogoutClick} className="w-full text-left flex items-center gap-3 px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors rounded-md">
                                        <LogoutIcon />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;