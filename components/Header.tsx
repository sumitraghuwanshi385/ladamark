import React, { useState, useEffect } from 'react';

const Logo = () => (
  <a href="/" className="flex items-center -ml-1">
    <img 
      src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
      alt="Ladamark Logo" 
      style={{ width: '140px', height: 'auto' }}
      className="transition-all duration-300"
    />
  </a>
);

const SunIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

const MoonIcon = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const ThemeToggle: React.FC<{ theme: 'light' | 'dark'; setTheme: (theme: 'light' | 'dark') => void; }> = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button 
            onClick={toggleTheme} 
            className="group relative p-2.5 rounded-2xl bg-[var(--background-secondary-translucent)] backdrop-blur-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30 shadow-inner transition-all duration-500 hover:scale-105 active:scale-95 focus:outline-none overflow-hidden"
            aria-label="Toggle theme"
        >
            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className={`relative transition-transform duration-500 ${theme === 'dark' ? 'rotate-0' : 'rotate-180'}`}>
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </div>
            
            {/* Subtle glow ring */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-[var(--accent-primary)]/0 group-hover:ring-[var(--accent-primary)]/20 transition-all duration-300" />
        </button>
    );
};

interface HeaderProps {
    onLoginClick: (e: React.MouseEvent) => void;
    onSignUpClick: (e: React.MouseEvent) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignUpClick, theme, setTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed z-50 transition-all duration-500 ease-out 
      ${isScrolled 
        ? 'top-3 left-4 right-4 py-2.5 bg-[var(--background-secondary-translucent)] backdrop-blur-2xl border border-[var(--border-primary)] rounded-3xl shadow-2xl shadow-[var(--shadow-primary)]' 
        : 'top-0 left-0 right-0 bg-transparent py-4'
      }`}>
      
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Logo />

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            
            <a 
              href="#" 
              onClick={onLoginClick} 
              className="hidden sm:inline-block text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Sign In
            </a>

            <a 
              href="#" 
              onClick={onSignUpClick} 
              className="text-sm font-semibold text-white bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] hover:brightness-110 active:brightness-95 px-5 py-2.5 rounded-2xl transition-all duration-300 shadow-lg shadow-[var(--accent-secondary)]/30"
            >
              Label Now
            </a>
        </div>
      </div>
    </header>
  );
};

export default Header;