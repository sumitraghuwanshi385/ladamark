import React, { useState, useEffect } from 'react';
import { Menu, X, Plus } from 'lucide-react'; // lucide-react use kar rahe hain

const Logo = () => (
  <a href="/" className="flex items-center -ml-0.5">
    <img 
      src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
      alt="Ladamark Logo" 
      style={{ width: '132px', height: 'auto' }}
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Product', href: '#product' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Company', href: '#company' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed z-50 w-full transition-all duration-700 ease-out
      ${isScrolled 
        ? 'top-3 left-4 right-4 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-white/5' 
        : 'top-0 left-0 right-0 bg-transparent'
      }`}>
      
      <div className="container mx-auto px-5 py-3 flex justify-between items-center"> {/* size compact kiya */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {menuItems.slice(0, 3).map((item) => (
            <a 
              key={item.label}
              href={item.href} 
              className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop Red "Let's Label" Button */}
          <button
            onClick={onSignUpClick}
            className="hidden md:flex items-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl transition-all duration-300 shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95"
          >
            Let's Label
          </button>

          {/* Hamburger Menu Button (Mobile only) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sliding Sidebar - Width reduced + compact */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Sidebar - Width kam kiya (w-72) */}
        <div className={`absolute top-0 right-0 h-full w-72 bg-white dark:bg-zinc-950 border-l border-white/20 dark:border-white/10 shadow-2xl transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-5 flex flex-col h-full"> {/* padding reduce */}
            <div className="flex justify-between items-center mb-8">
              <Logo />
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-[var(--text-secondary)] p-1"
              >
                <X size={26} />
              </button>
            </div>

            <div className="flex flex-col space-y-5 text-base font-medium"> {/* text size reduce */}
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-1"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
              <button
                onClick={(e) => {
                  setIsMenuOpen(false);
                  onLoginClick(e);
                }}
                className="w-full text-left text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-3 text-base" // size reduce
              >
                Sign In
              </button>
              
              <button
                onClick={(e) => {
                  setIsMenuOpen(false);
                  onSignUpClick(e);
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-[0.985] text-base"
              >
                Let's Label
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;