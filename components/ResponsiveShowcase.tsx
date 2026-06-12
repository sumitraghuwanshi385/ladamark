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

                {/* Interactive Layout Mockups Container */}
                <div className={`relative h-[24rem] sm:h-[28rem] flex items-center justify-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    
                    {/* Desktop Premium Laptop Glass Dashboard Mockup */}
                    <div className="w-full max-w-3xl h-[20rem] sm:h-[24rem] bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-xl shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/70 dark:border-zinc-800/70 p-2 flex flex-col transform hover:-translate-y-1 transition-transform duration-500 overflow-hidden">
                        
                        {/* Browser Control Accent Top Bar */}
                        <div className="flex items-center gap-1.5 px-2 pb-2 pt-1 flex-shrink-0 border-b border-zinc-100 dark:border-zinc-800/60">
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                        </div>
                        
                        {/* Perfect-fit Desktop Image Canvas Panel */}
                        <div className="flex-grow w-full h-full rounded-lg bg-zinc-50 dark:bg-zinc-950/60 overflow-hidden relative">
                            <img 
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" 
                                alt="Ladamark Desktop Dashboard View" 
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                    </div>

                    {/* Mobile Premium Bezel Smartphone Mockup */}
                    <div 
                        className={`absolute -bottom-4 right-4 sm:right-12 md:right-16 w-[7.5rem] sm:w-[9.5rem] h-[14rem] sm:h-[18rem] bg-zinc-950 rounded-[22px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-1.5 border border-zinc-800/80 transition-all duration-1000 ease-out z-20`}
                        style={{ 
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
                            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                            opacity: isVisible ? 1 : 0,
                            transitionDelay: '450ms'
                        }}
                    >
                        {/* Phone Screen Image Canvas Panel */}
                        <div className="bg-zinc-900 w-full h-full rounded-[17px] relative overflow-hidden border border-zinc-800/40">
                            {/* Dynamic Island Camera Notch */}
                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-zinc-950 rounded-full z-30" />
                            
                            {/* Perfect-fit Mobile Image Wrapper */}
                            <img 
                                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop" 
                                alt="Ladamark Mobile Version View" 
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ResponsiveShowcase;
