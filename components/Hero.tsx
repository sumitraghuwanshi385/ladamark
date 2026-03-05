
import React from 'react';

const AnimatedGrid: React.FC = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div 
      className="absolute inset-0 h-full w-full opacity-10 dark:[&>div]:bg-zinc-800 light:[&>div]:bg-zinc-200"
      style={{
        backgroundImage: 'linear-gradient(var(--border-secondary) 1px, transparent 1px), linear-gradient(to right, var(--border-secondary) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        animation: 'pan-grid 25s linear infinite',
      }}
    ></div>
    <div className="absolute inset-0 bg-gradient-to-b from-[var(--background-secondary)] via-[var(--background-secondary)] to-transparent"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-secondary)] via-[var(--background-secondary)] to-transparent"></div>
  </div>
);

const HeroVisual: React.FC = () => (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div 
            className="hero-blob top-0 -left-1/4 w-full h-full bg-rose-500 rounded-full" 
            style={{ animation: 'move-blob-1 25s infinite alternate ease-in-out' }} 
        />
        <div 
            className="hero-blob bottom-0 -right-1/4 w-full h-full bg-red-600 rounded-full" 
            style={{ animation: 'move-blob-2 30s infinite alternate ease-in-out -5s' }} 
        />
    </div>
);


const Hero: React.FC<{ onLoginClick: (e: React.MouseEvent) => void; onSignUpClick: (e: React.MouseEvent) => void; }> = ({ onLoginClick, onSignUpClick }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 text-center overflow-hidden bg-[var(--background-secondary)]">
        <AnimatedGrid />
        <HeroVisual />
      <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto px-6">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 animated-reddish-text" style={{textWrap: 'balance'}}>
            Unlock Your Catalog's Potential with AI-Powered Tagging.
          </h1>
        </div>
        <div className="animate-fade-in-up animation-delay-200">
          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10" style={{textWrap: 'balance'}}>
            Ladamark instantly generates rich, accurate tags for your entire product catalog, enhancing discoverability and driving sales. Stop manual tagging. Start intelligent selling.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto animate-fade-in-up animation-delay-400">
          <a 
              href="#" 
              onClick={onSignUpClick} 
              className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full transition-all duration-300 overflow-hidden transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-shadow)]"
          >
              <span className="relative z-10">Try Ladamark for Free</span>
              <svg className="relative z-10 w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
          <a 
              href="#" 
              className="w-full sm:w-auto text-base font-semibold text-[var(--text-primary)] bg-gray-500/10 dark:bg-white/10 backdrop-blur-sm border border-[var(--border-secondary)] dark:border-white/20 hover:border-[var(--accent-primary)]/70 py-4 px-10 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent-shadow)]"
          >
              Request Enterprise Demo
          </a>
        </div>
        <p className="mt-6 text-sm text-[var(--text-muted)] animate-fade-in-up animation-delay-500">Free plan available. No credit card required to start.</p>
      </div>
    </section>
  );
};

export default Hero;
