import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

const Logo = () => (
  <a href="/" className="flex items-center -ml-0.5">
    <img 
      src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
      alt="Ladamark Logo" 
      style={{ width: '125px', height: 'auto' }}
      className="transition-all duration-300"
    />
  </a>
);

interface HeaderProps {
    onLoginClick: (e: React.MouseEvent) => void;
    onSignUpClick: (e: React.MouseEvent) => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignUpClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Synchronize theme on load
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || 
                   localStorage.getItem('theme') === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // Clean links: removed "Product" and "Company" root titles
  const menuItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];
 
  return (
    <>
      <header
        className={`fixed z-50 transition-all duration-700 ease-out
        ${isScrolled
          ? 'top-2 inset-x-3 w-auto bg-white/[0.35] dark:bg-zinc-950/[0.45] backdrop-blur-[40px] backdrop-saturate-[190%] border border-white/40 dark:border-white/10 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]'
          : 'top-0 left-0 right-0 w-full bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <Logo />

          {/* Desktop Navigation - Compact style */}
          <nav className="hidden md:flex items-center space-x-6 text-[13px] font-medium">
            {menuItems.map((item) => (
              <a 
                key={item.label}
                href={item.href} 
                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Desktop Mode - Micro Compact Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex items-center justify-center p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Desktop Red "Let's Label" Button - Compact with minimal padding */}
            <button
              onClick={onSignUpClick}
              className="hidden md:flex items-center gap-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Let's Label
            </button>

            {/* Hamburger Menu Button (Mobile only) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sliding Sidebar */}
      <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Sidebar Panel */}
        <div className={`absolute top-0 right-0 h-full w-64 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-900 transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-5 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <Logo />
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-[var(--text-secondary)] p-1 hover:opacity-70 transition-opacity"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex flex-col space-y-3.5 text-sm font-semibold tracking-wide">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-1 block"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* iOS Style Theme Switcher + CTA Container at the bottom */}
            <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900">
              
              {/* Premium iOS style Switcher */}
              <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 rounded-lg p-2.5 mb-4">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Dark Mode</span>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    isDarkMode ? 'bg-red-500' : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Mobile "Let's Label" Button */}
              <button
                onClick={(e) => {
                  setIsMenuOpen(false);
                  onSignUpClick(e);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-md transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
              >
                Let's Label
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
