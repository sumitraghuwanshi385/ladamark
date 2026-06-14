import React from 'react';

const HeroVisual: React.FC = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-white dark:bg-[#0a0a0a] pointer-events-none" aria-hidden="true">
    {/* 1. Center Soft Ambient Lighting */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_65%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_65%)]" />

    {/* 2. Top-Left: Bright Red Glow (Visible in both White & Dark Modes) */}
    <div
      className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-[#ff0033] rounded-full opacity-20 dark:opacity-40 blur-[130px] mix-blend-multiply dark:mix-blend-screen"
      style={{ animation: 'bright-glow-left 25s infinite alternate ease-in-out' }}
    />

    {/* 3. Bottom-Right: Bright Red Glow (Visible in both White & Dark Modes) */}
    <div
      className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] bg-[#ff0033] rounded-full opacity-20 dark:opacity-40 blur-[130px] mix-blend-multiply dark:mix-blend-screen"
      style={{ animation: 'bright-glow-right 28s infinite alternate ease-in-out' }}
    />

    <style>{`
      @keyframes bright-glow-left {
        0% { transform: translate(0px, 0px) scale(1); }
        50% { transform: translate(40px, 30px) scale(1.1); }
        100% { transform: translate(-20px, 50px) scale(0.95); }
      }
      @keyframes bright-glow-right {
        0% { transform: translate(0px, 0px) scale(1); }
        50% { transform: translate(-50px, -20px) scale(1.05); }
        100% { transform: translate(20px, -40px) scale(0.9); }
      }
    `}</style>
  </div>
);

const FloatingTag: React.FC<{ text: string; delay: string; position: string }> = ({ text, delay, position }) => (
  <div
    className={`absolute hidden lg:block px-5 py-2.5 bg-zinc-900/5 dark:bg-white/5 backdrop-blur-xl border border-zinc-900/10 dark:border-white/10 rounded-2xl text-sm font-medium text-zinc-900 dark:text-white ${position}`}
    style={{
      animation: `floatTag 6s ease-in-out infinite ${delay}`,
      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.12)'
    }}
  >
    {text}
  </div>
);

const Hero: React.FC<{ onLoginClick: (e: React.MouseEvent) => void; onSignUpClick: (e: React.MouseEvent) => void; }> = ({ onLoginClick, onSignUpClick }) => {
  return (
    <section className="relative min-h-[100dvh] pt-20 pb-16 md:pt-28 flex items-center overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <HeroVisual />

      <div className="relative z-20 max-w-6xl mx-auto px-5 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="text-[2.1rem] leading-[1.05] md:text-5xl lg:text-[5.2rem] font-black tracking-[-2px] mb-6 max-w-5xl text-zinc-950 dark:text-white" style={{ textWrap: 'balance' }}>
            Turn Your Catalog Into a{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff0033] to-[#ff4d73] font-black tracking-[-2px] text-[2.25rem] md:text-[5.1rem] lg:text-[5.4rem]">
              Sales Machine
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-[15px] md:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed px-2" style={{ textWrap: 'balance' }}>
            Ladamark uses AI Labelling to auto-generate rich, contextual tags across your entire product catalog — boosting discoverability, SEO, and conversions instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="#"
              onClick={onSignUpClick}
              className="group relative w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#ff0033] to-[#ff3366] rounded-md overflow-hidden transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-2"
            >
              <span className="relative z-10">Start Free</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </a>

            <a
              href="#"
              onClick={onLoginClick}
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-md transition-all duration-300 flex items-center justify-center hover:scale-[1.02] text-zinc-900 dark:text-white border border-zinc-900/10 dark:border-white/20 bg-zinc-900/5 dark:bg-white/5 backdrop-blur-xl"
              style={{
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              Watch 2-min Demo
            </a>
          </div>

          {/* Bottom trust text */}
          <p className="mt-6 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            No credit card • Cancel anytime • Used by 100+ brands
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <FloatingTag text="#SummerVibes" delay="0s" position="top-[28%] left-[8%]" />
      <FloatingTag text="Premium Leather" delay="1.2s" position="top-[42%] right-[9%]" />
      <FloatingTag text="Trending • AI" delay="2.4s" position="bottom-[32%] left-[12%]" />
    </section>
  );
};

export default Hero;
