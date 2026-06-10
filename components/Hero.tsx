import React from 'react';

const HeroVisual: React.FC = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Large moving red blobs - Only red glows */}
    <div
      className="hero-blob absolute top-[-25%] -left-[15%] w-[65%] h-[65%] bg-gradient-to-br from-rose-500 via-red-500 to-rose-600 rounded-[60%] opacity-30 blur-3xl"
      style={{ animation: 'move-blob-1 35s infinite alternate ease-in-out' }}
    />
    <div
      className="hero-blob absolute bottom-[-18%] -right-[12%] w-[62%] h-[62%] bg-gradient-to-br from-red-600 via-rose-600 to-red-500 rounded-[60%] opacity-30 blur-3xl"
      style={{ animation: 'move-blob-2 42s infinite alternate ease-in-out -8s' }}
    />
    
    {/* Extra red accent orb */}
    <div
      className="absolute top-[30%] left-[55%] w-96 h-96 bg-red-500/20 rounded-full blur-[120px] animate-pulse"
      style={{ animationDuration: '18s' }}
    />
  </div>
);

const FloatingTag: React.FC<{ text: string; delay: string; position: string }> = ({ text, delay, position }) => (
  <div
    className={`absolute hidden lg:block px-5 py-2.5 bg-white/10 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 rounded-2xl text-sm font-medium text-white shadow-xl ${position}`}
    style={{
      animation: `floatTag 6s ease-in-out infinite ${delay}`,
      boxShadow: '0 10px 30px -10px rgb(244 63 94 / 0.4)'
    }}
  >
    {text}
  </div>
);

const Hero: React.FC<{ onLoginClick: (e: React.MouseEvent) => void; onSignUpClick: (e: React.MouseEvent) => void; }> = ({ onLoginClick, onSignUpClick }) => {
  return (
    <section className="relative min-h-[100dvh] pt-20 pb-16 md:pt-28 flex items-center overflow-hidden bg-[var(--background-secondary)]">
      <HeroVisual />

      <div className="relative z-20 max-w-6xl mx-auto px-5 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Headline - Much smaller on mobile */}
          <h1 className="text-[2.1rem] leading-[1.05] md:text-5xl lg:text-[5.2rem] font-black tracking-[-2px] mb-6 max-w-5xl animate-fade-in-up" style={{ textWrap: 'balance' }}>
            Turn Your Catalog Into a{' '}
            <span className="animated-reddish-text bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-500 to-rose-600 font-black tracking-[-2px] text-[2.25rem] md:text-[5.1rem] lg:text-[5.4rem]">
              Sales Machine
            </span>
          </h1>

          {/* Subheadline - Reduced size especially on mobile */}
          <p className="text-[15px] md:text-lg lg:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up animation-delay-200 px-2" style={{ textWrap: 'balance' }}>
            Ladamark uses advanced AI to auto-generate rich, contextual tags across your entire product catalog — boosting discoverability, SEO, and conversions instantly.
          </p>

          {/* CTA Buttons - Significantly reduced size on mobile */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto animate-fade-in-up animation-delay-300">
            <a
              href="#"
              onClick={onSignUpClick}
              className="group relative w-full sm:w-auto px-6 md:px-9 py-3 md:py-4.5 text-[15px] md:text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-rose-500/40 flex items-center justify-center gap-2.5"
            >
              <span className="relative z-10">Start Free</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </a>

            <a
              href="#"
              onClick={onLoginClick}
              className="w-full sm:w-auto px-6 md:px-9 py-3 md:py-4.5 text-[15px] md:text-base font-semibold text-white border border-white/30 hover:border-white/60 backdrop-blur-md rounded-2xl transition-all duration-300 hover:bg-white/5 flex items-center justify-center"
            >
              Watch 2-min Demo
            </a>
          </div>

          {/* Bottom trust text - Smaller */}
          <p className="mt-6 text-xs md:text-sm text-[var(--text-muted)] flex items-center gap-2 animate-fade-in-up animation-delay-500">
            No credit card • Cancel anytime • Used by 100+ brands
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
    </section>
  );
};

export default Hero;