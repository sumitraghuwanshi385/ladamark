import React, { useState, useEffect } from 'react';

const Logo = () => (
  <a href="/" className="flex items-center -ml-1">
    <img 
      src="https://i.postimg.cc/nrRJ43f4/Picsart-25-07-19-15-59-42-768.png" 
      alt="Ladamark Logo" 
      style={{ width: '138px', height: 'auto' }}
      className="transition-all duration-300"
    />
  </a>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6h12v12" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
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
        ? 'top-3 left-4 right-4 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-3xl border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-white/5' 
        : 'top-0 left-0 right-0 bg-transparent'
      }`}>
      
      <div className="container mx-auto px-6 py-3.5 flex justify-between items-center">
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
          {/* Get Started Red Button */}
          <button
            onClick={onSignUpClick}
            className="hidden sm:flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-2xl transition-all duration-300 shadow-lg shadow-red-500/30 hover:scale-105 active:scale-95"
            aria-label="Get Started"
          >
            <PlusIcon />
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Sliding Sidebar Menu */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <div className={`absolute top-0 right-0 h-full w-80 bg-white dark:bg-zinc-950 border-l border-white/20 dark:border-white/10 shadow-2xl transition-transform duration-500 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-10">
              <Logo />
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="text-[var(--text-secondary)] p-2"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col space-y-6 text-lg font-medium">
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

            <div className="mt-auto pt-8 border-t border-white/10">
              <button
                onClick={(e) => {
                  setIsMenuOpen(false);
                  onLoginClick(e);
                }}
                className="w-full text-left text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors py-3 text-lg"
              >
                Sign In
              </button>
              
              <button
                onClick={(e) => {
                  setIsMenuOpen(false);
                  onSignUpClick(e);
                }}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.985]"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;