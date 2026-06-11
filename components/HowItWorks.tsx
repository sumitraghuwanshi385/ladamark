import React, { useState, useEffect, useRef } from 'react';
import { Bot, Download } from 'lucide-react';

const steps = [
  {
    stepNumber: "01",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 5C17.4142 5 18.1213 5 18.5607 5.43934C19 5.87868 19 6.58579 19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 5C6.58579 5 5.87868 5 5.43934 5.43934C5 5.87868 5 6.58579 5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Upload Your Images",
    description: "Effortlessly upload your entire product catalog. Our secure, high-speed system processes thousands of images in minutes, getting you ready for analysis.",
  },
  {
    stepNumber: "02",
    icon: <Bot size={20} strokeWidth={2} />,
    title: "Let AI Suggest Tags",
    description: "Our vision AI analyzes each image for context, color, material, and style, suggesting a rich set of tags with industry-leading accuracy to build your taxonomy.",
  },
  {
    stepNumber: "03",
    icon: <Download size={20} strokeWidth={2} />,
    title: "Approve & Export Data",
    description: "Quickly review and approve the AI's suggestions in our intuitive editor. Once perfected, export your complete, structured data as a clean CSV or JSON file.",
  },
];

const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
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
    <section 
      ref={sectionRef} 
      className="relative py-14 sm:py-24 overflow-hidden bg-gradient-to-b from-white via-zinc-50/50 to-white dark:from-zinc-950 dark:via-zinc-900/30 dark:to-zinc-950 border-t border-b border-zinc-100 dark:border-zinc-900"
    >
      {/* Subtle Premium Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className={`text-center mb-10 md:mb-16 max-w-xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase text-red-500 bg-red-500/5 border border-red-500/10 mb-3.5">
            Workflow
          </span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            Get started in 3 simple steps
          </h2>
          <p className="mt-2.5 text-xs md:text-base text-zinc-500 dark:text-zinc-400 font-medium">
            Labeling your entire product catalog has never been easier.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`group relative bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 md:p-8 rounded-md border border-zinc-200/60 dark:border-zinc-800/60 transition-all duration-500 hover:border-red-500/30 hover:bg-white dark:hover:bg-zinc-900 hover:scale-[1.01] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                boxShadow: '0 4px 20px -2px rgba(120, 120, 120, 0.03), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)'
              }}
            >
              {/* Card Top Line Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:via-red-500/40 transition-all duration-500 rounded-t-md" />

              <div className="flex justify-between items-start mb-4">
                {/* Minimalist Red Icon Container */}
                <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 text-red-500 bg-red-500/5 dark:bg-red-500/10 rounded-md border border-red-500/10 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
                
                {/* Fine Premium Counter Number */}
                <span className="text-[19px] md:text-2xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 group-hover:text-red-500/20 transition-colors duration-300 select-none font-mono">
                  {step.stepNumber}
                </span>
              </div>

              {/* Text Content */}
              <h3 className="text-base md:text-lg font-bold text-zinc-900 dark:text-white mb-2 tracking-tight group-hover:text-red-500 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-[12.5px] md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
