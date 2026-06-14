import React from 'react';

const HeroVisual: React.FC = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0a0a] pointer-events-none" aria-hidden="true">
    {/* 1. Center Soft Ambient White Lighting */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_65%)]" />

    {/* 2. Top-Left: Bright Red Glow (No shadow/dullness) */}
    <div
      className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-[#ff0033] rounded-full opacity-40 blur-[130px]"
      style={{ animation: 'bright-glow-left 25s infinite alternate ease-in-out', mixBlendMode: 'screen' }}
    />

    {/* 3. Bottom-Right: Bright Red Glow (No shadow/dullness) */}
    <div
      className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] bg-[#ff0033] rounded-full opacity-40 blur-[130px]"
      style={{ animation: 'bright-glow-right 28s infinite alternate ease-in-out', mixBlendMode: 'screen' }}
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
    className={`absolute hidden lg:block px-5 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-sm font-medium text-white ${position}`}
    style={{
      animation: `floatTag 6s ease-in-out infinite ${delay}`,
      boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
    }}
  >
    {text}
  </div>
);

const Hero: React.FC<{ onLoginClick: (e: React.MouseEvent) => void; onSignUpClick: (e: React.MouseEvent) => void; }> = ({ onLoginClick, onSignUpClick }) => {
  return (
    <section className="relative min-h-[100dvh] pt-20 pb-16 md:pt-28 flex items-center overflow-hidden bg-[#0a0a0a]">
      <HeroVisual />

      <div className="relative z-20 max-w-6xl mx-auto px-5 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[2.1rem] leading-[1.05] md:text-5xl lg:text-[5.2rem] font-black tracking-[-2px] mb-6 max-w-5xl text-white">
            Turn Your Catalog Into a{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff0033] to-[#ff4d73]">
              Sales Machine
            </span>
          </h1>

          <p className="text-[15px] md:text-lg lg:text-xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed px-2">
            Ladamark uses AI Labelling to auto-generate rich, contextual tags across your entire product catalog — boosting discoverability, SEO, and conversions instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href="#"
              onClick={onSignUpClick}
              className="px-6 py-3 text-sm font-semibold text-white bg-[#ff0033] rounded-md hover:bg-[#cc0029] transition-all"
            >
              Start Free
            </a>
            <a
              href="#"
              onClick={onLoginClick}
              className="px-6 py-3 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-md hover:bg-white/10 transition-all"
            >
              Watch 2-min Demo
            </a>
          </div>
        </div>
      </div>

      <FloatingTag text="#SummerVibes" delay="0s" position="top-[28%] left-[8%]" />
      <FloatingTag text="Premium Leather" delay="1.2s" position="top-[42%] right-[9%]" />
      <FloatingTag text="Trending • AI" delay="2.4s" position="bottom-[32%] left-[12%]" />
    </section>
  );
};

export default Hero;
