import React, { useState, useEffect, useRef } from 'react';

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="h-full bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 sm:p-6 rounded-md border border-zinc-200/60 dark:border-zinc-800/60 transition-all duration-500 hover:border-red-500/30 hover:bg-white dark:hover:bg-zinc-900 hover:scale-[1.01] flex flex-col text-left"
       style={{ boxShadow: '0 4px 20px -2px rgba(120, 120, 120, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)' }}>
    
    {/* Rounded-Rectangular Image Placeholder Container */}
    <div className="w-full h-32 sm:h-36 mb-4 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/40 dark:border-zinc-700/30 rounded-md overflow-hidden flex items-center justify-center relative group-hover:border-red-500/20 transition-colors">
      <span className="text-[11px] font-medium tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
        Feature Asset Image
      </span>
      {/* Jab aap image lagao toh is span ko hata kar niche wali img line uncomment kr lena: */}
      {/* <img src="YOUR_IMAGE_URL" alt={title} className="w-full h-full object-cover" /> */}
    </div>
    
    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1.5 tracking-tight">{title}</h3>
    <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium flex-grow">{description}</p>
  </div>
);

const features = [
  {
    name: "Visual Recognition",
    description: "Uploads are instantly scanned to understand product type, brand, category, and style.",
  },
  {
    name: "Product Name & Description Generation",
    description: "Get compelling, detailed product titles and descriptions using AI — optimized for eCommerce.",
  },
  {
    name: "Price Recommendation",
    description: "Ladamark suggests price ranges using real-time product intelligence.",
  },
  {
    name: "Auto Attributes",
    description: "AI detects and fills in critical attributes like color, material, type, gender, style, etc.",
  },
  {
    name: "Smart SEO Tagging",
    description: "AI suggests high-intent, keyword-rich SEO tags to improve search visibility.",
  },
  {
    name: "Quick Edit & Approve",
    description: "Review, edit, or approve results with one click — and send to your catalog instantly."
  }
];

const Features: React.FC<{ onSignUpClick: (e: React.MouseEvent) => void }> = ({ onSignUpClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative py-12 sm:py-20 overflow-hidden bg-gradient-to-b from-white via-zinc-50/50 to-white dark:from-zinc-950 dark:via-zinc-900/30 dark:to-zinc-950 border-t border-b border-zinc-100 dark:border-zinc-900 scroll-mt-20">
      {/* Subtle Premium Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className={`text-center mb-10 sm:mb-14 max-w-xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase text-red-500 bg-red-500/5 border border-red-500/10 mb-3.5">
            Capabilities
          </span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            What Ladamark AI does for you:
          </h2>
          <p className="mt-2.5 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-lg mx-auto">
            Supercharge your catalog management with automated visual tagging, high-converting copy, and real-time market insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, index) => (
            <div key={feature.name} className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${index * 75}ms`}}>
              <FeatureCard 
                title={feature.name}
                description={feature.description}
              />
            </div>
          ))}
        </div>

        {/* CTA Button Section */}
        <div className={`text-center mt-10 sm:mt-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a 
            href="#"
            onClick={onSignUpClick}
            className="group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-600 rounded-md transition-all duration-300 overflow-hidden hover:scale-[1.02]"
          >
            <span className="relative z-10">Start Smart Tagging for Free</span>
            <svg className="relative z-10 w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
            <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
