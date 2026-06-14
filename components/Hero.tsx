import React from 'react';

const PremiumHeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0a0a] pointer-events-none" aria-hidden="true">
      {/* 1. Central Smooth White Ambient Lighting (Apple + Vercel Style) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.03)_0%,transparent_50%)]" />

      {/* 2. Top-Left: Ultra Bright Luxury Red Glowing Blob (No shadow, No dullness, Fully Animated) */}
      <div 
        className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] bg-gradient-to-br from-[#ff0033] via-[#ff1a4a] to-[#ff4d73] rounded-full opacity-40 blur-[130px]"
        style={{
          animation: 'bright-glow-left 25s infinite alternate ease-in-out',
          mixBlendMode: 'screen'
        }}
      />

      {/* 3. Bottom-Right: Ultra Bright Luxury Red Glowing Blob (No shadow, Fully Animated) */}
      <div 
        className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] bg-gradient-to-tl from-[#ff0033] via-[#ff1a4a] to-[#ff3366] rounded-full opacity-35 blur-[140px]"
        style={{
          animation: 'bright-glow-right 28s infinite alternate ease-in-out',
          mixBlendMode: 'screen'
        }}
      />

      {/* 4. Extra Subtle Edge White Soft Glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* CSS Keyframes for smooth bright animation (Add this to your global CSS or style tag) */}
      <style>{`
        @keyframes bright-glow-left {
          0% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(40px, 30px) scale(1.1);
            opacity: 0.5;
          }
          100% {
            transform: translate(-20px, 50px) scale(0.95);
            opacity: 0.4;
          }
        }
        @keyframes bright-glow-right {
          0% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.35;
          }
          50% {
            transform: translate(-50px, -20px) scale(1.05);
            opacity: 0.45;
          }
          100% {
            transform: translate(20px, -40px) scale(0.9);
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumHeroBackground;
