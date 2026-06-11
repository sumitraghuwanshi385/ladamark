import React, { useRef, useEffect, useState } from 'react';

const ResponsiveShowcase: React.FC = () => {
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
            { threshold: 0.15 }
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
        <section ref={sectionRef} className="relative py-12 sm:py-20 overflow-hidden bg-gradient-to-b from-white via-zinc-50/40 to-white dark:from-zinc-950 dark:via-zinc-900/20 dark:to-zinc-950 border-t border-b border-zinc-100 dark:border-zinc-900 scroll-mt-20">
            {/* Soft Premium Glow background */}
            <div className="absolute top-1/2 left-1/3 w-[450px] h-[450px] bg-red-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-5 lg:px-8 relative z-10">
                
                {/* Header Section */}
                <div className={`text-center mb-10 max-w-xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase text-red-500 bg-red-500/5 border border-red-500/10 mb-3">
                        Cross-Platform
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                        Access Anywhere, On Any Device
                    </h2>
                    <p className="mt-2 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mx-auto leading-relaxed">
                        Ladamark is fully responsive, delivering a seamless catalog management experience whether you're at your desktop or handling ops on mobile.
                    </p>
                </div>

                {/* Interactive Layout Mockups Container (Height Reduced) */}
                <div className={`relative h-[22rem] sm:h-[24rem] flex items-center justify-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    
                    {/* Desktop Premium Glass Dashboard Mockup */}
                    <div className="w-full max-w-3xl h-64 sm:h-72 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-md shadow-xl shadow-zinc-200/40 dark:shadow-none border border-zinc-200/70 dark:border-zinc-800/70 p-3 flex flex-col transform hover:-translate-y-1 transition-transform duration-500">
                        {/* Browser Dots Control Bar */}
                        <div className="flex items-center gap-1.5 mb-2.5 flex-shrink-0">
                            <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                            <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                        </div>
                        
                        {/* Mock Dashboard Layout Interior */}
                        <div className="flex-grow bg-zinc-50 dark:bg-zinc-950/60 rounded border border-zinc-100 dark:border-zinc-900 p-3 flex gap-3 overflow-hidden">
                            {/* Sidebar Area */}
                            <div className="w-1/5 h-full bg-white dark:bg-zinc-900/50 border border-zinc-200/40 dark:border-zinc-800/40 rounded p-1.5 flex flex-col gap-1.5">
                                <div className="h-2 w-10 bg-red-500/10 dark:bg-red-500/5 rounded border border-red-500/20" />
                                <div className="h-1.5 w-full bg-zinc-200/60 dark:bg-zinc-800 rounded" />
                                <div className="h-1.5 w-3/4 bg-zinc-200/60 dark:bg-zinc-800 rounded" />
                                <div className="h-1.5 w-4/5 bg-zinc-200/60 dark:bg-zinc-800 rounded" />
                            </div>
                            {/* Main Grid Feed Area */}
                            <div className="w-4/5 h-full rounded flex flex-col gap-2">
                                <div className="h-8 w-full bg-white dark:bg-zinc-900/50 border border-zinc-200/40 dark:border-zinc-800/40 rounded flex items-center px-2">
                                    <div className="h-2 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-sm" />
                                </div>
                                <div className="flex-grow w-full grid grid-cols-3 gap-2">
                                    <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/40 rounded p-1.5 flex flex-col justify-between">
                                        <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                                        <div className="h-1.5 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/40 rounded p-1.5 flex flex-col justify-between">
                                        <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                                        <div className="h-1.5 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                                    </div>
                                    <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/40 rounded p-1.5 flex flex-col justify-between">
                                        <div className="h-12 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                                        <div className="h-1.5 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Premium Bezel Smartphone Mockup */}
                    <div 
                        className={`absolute -bottom-6 right-8 sm:right-16 md:right-24 w-36 h-64 bg-zinc-950 rounded-[20px] shadow-2xl shadow-zinc-950/20 p-1.5 border border-zinc-800 transition-all duration-1000 ease-out`}
                        style={{ 
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
                            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                            opacity: isVisible ? 1 : 0,
                            transitionDelay: '450ms'
                        }}
                    >
                        {/* Phone Screen Canvas Panel */}
                        <div className="bg-zinc-50 dark:bg-zinc-900 w-full h-full rounded-[15px] p-2 flex flex-col gap-2 relative overflow-hidden border border-zinc-200/20 dark:border-zinc-800/50">
                            {/* Dynamic Island Ear-speaker Micro Bezels */}
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-zinc-950 rounded-full flex items-center justify-center z-30" />
                            
                            {/* Mock Screen Component Blocks */}
                            <div className="h-6 w-full bg-white dark:bg-zinc-950 rounded-sm mt-2 border border-zinc-200/40 dark:border-zinc-800/40" />
                            <div className="h-16 w-full bg-white dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 rounded p-1 flex flex-col justify-between">
                                <div className="h-8 w-full bg-zinc-100 dark:bg-zinc-800/60 rounded" />
                                <div className="h-1 w-8 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                            </div>
                            <div className="flex-grow w-full bg-white dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/40 rounded p-1.5 flex flex-col gap-1.5">
                                <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="h-1 w-5/6 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="h-1 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                                <div className="h-12 w-full bg-red-500/5 border border-red-500/10 rounded-sm mt-auto" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ResponsiveShowcase;
