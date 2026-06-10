import React from 'react';

const AnimatedGrid: React.FC = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Subtle animated grid */}
    <div
      className="absolute inset-0 h-full w-full opacity-10 dark:[&>div]:bg-zinc-800 light:[&>div]:bg-zinc-200"
      style={{
        backgroundImage: 'linear-gradient(var(--border-secondary) 1px, transparent 1px), linear-gradient(to right, var(--border-secondary) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'pan-grid 40s linear infinite',
      }}
    />
    
    {/* Radial glow overlays */}
    <div className="absolute inset-0 bg-[radial-gradient(at_30%_20%,rgba(244,63,94,0.12),transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(at_70%_70%,rgba(185,28,28,0.12),transparent_50%)]" />
    
    {/* Top & bottom fade */}
    <div className="absolute inset-0 bg-gradient-to-b from-[var(--background-secondary)] via-transparent to-[var(--background-secondary)]" />
  </div>
);

const HeroVisual: React.FC = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Large moving blobs */}
    <div
      className="hero-blob absolute top-[-30%] -left-[20%] w-[70%] h-[70%] bg-gradient-to-br from-rose-500 via-red-500 to-purple-600 rounded-[60%] opacity-30 blur-3xl"
      style={{ animation: 'move-blob-1 35s infinite alternate ease-in-out' }}
    />
    <div
      className="hero-blob absolute bottom-[-20%] -right-[15%] w-[65%] h-[65%] bg-gradient-to-br from-red-600 via-rose-600 to-pink-500 rounded-[60%] opacity-30 blur-3xl"
      style={{ animation: 'move-blob-2 42s infinite alternate ease-in-out -8s' }}
    />
    
    {/* Extra accent orb */}
    <div
      className="absolute top-[25%] left-[55%] w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse"
      style={{ animationDuration: '18s' }}
    />
  </div>
);

const FloatingTag: React.FC<{ text: string; delay: string; position: string }> = ({ text, delay, position }) => (
  <div
    className={`absolute hidden lg:block px-5 py-2.5 bg-white/10 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 rounded-2xl text-sm font-medium text-white shadow-xl ${position}`}
    style={{
      animation: `floatTag 6s ease-in-out infinite ${delay}`,
      boxShadow: '0 10px 30px -10px rgb(244 63 94 / 0.3)'
    }}
  >
    {text}
  </div>
);

const Hero: React.FC<{ onLoginClick: (e: React.MouseEvent) => void; onSignUpClick: (e: React.MouseEvent) => void; }> = ({ onLoginClick, onSignUpClick }) => {
  return (
    <section className="relative min-h-[100dvh] pt-24 pb-20 md:pt-32 flex items-center overflow-hidden bg-[var(--background-secondary)]">
      <AnimatedGrid />
      <HeroVisual />

      {/* Subtle particle-like dots */}
      <div className="absolute inset-0 z-10 opacity-20 pointer-events-none" 
           style={{
             backgroundImage: 'radial-gradient(circle at 25% 30%, white 1px, transparent 1px), radial-gradient(circle at 75% 60%, white 1px, transparent 1px)',
             backgroundSize: '80px 80px'
           }} 
      />

      <div className="relative z-20 max-w-6xl mx-auto px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6 animate-fade-in-up">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-[2px] font-mono text-emerald-400">Now AI-Powered</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-[5.2rem] font-black tracking-[-3px] leading-[1.05] mb-8 max-w-5xl animate-fade-in-up" style={{ textWrap: 'balance' }}>
            Turn Your Catalog Into a <span className="animated-reddish-text bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-500 to-purple-500">Sales Machine</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up animation-delay-200" style={{ textWrap: 'balance' }}>
            Ladamark uses advanced AI to auto-generate rich, contextual tags across your entire product catalog — 
            boosting discoverability, SEO, and conversions instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in-up animation-delay-300">
            <a
              href="#"
              onClick={onSignUpClick}
              className="group relative w-full sm:w-auto px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/40 flex items-center justify-center gap-3"
            >
              <span className="relative z-10">Start Free Trial</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </a>

            <a
              href="#"
              onClick={onLoginClick}
              className="w-full sm:w-auto px-10 py-5 text-lg font-semibold text-white border border-white/30 hover:border-white/60 backdrop-blur-md rounded-2xl transition-all duration-300 hover:bg-white/5 flex items-center justify-center"
            >
              Watch 2-min Demo
            </a>
          </div>

          <p className="mt-6 text-sm text-[var(--text-muted)] flex items-center gap-2">
            <span className="inline-block w-4 h-px bg-white/30" /> No credit card • Cancel anytime • Used by 12,000+ brands
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <FloatingTag 
        text="#SummerVibes" 
        delay="0s" 
        position="top-[28%] left-[8%]" 
      />
      <FloatingTag 
        text="Premium Leather" 
        delay="1.2s" 
        position="top-[42%] right-[9%]" 
      />
      <FloatingTag 
        text="Trending • AI" 
        delay="2.4s" 
        position="bottom-[32%] left-[12%]" 
      />

      {/* Bottom trust bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-[var(--text-muted)]">
        <div>AS SEEN IN</div>
        <div className="flex items-center gap-8 opacity-70">
          <span className="font-semibold">VOGUE</span>
          <span className="font-semibold">FORBES</span>
          <span className="font-semibold">TECHCRUNCH</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;