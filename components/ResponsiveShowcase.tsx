import React, { useRef, useEffect, useState } from 'react';

const DemoVideoShowcase: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (videoRef.current) {
                        videoRef.current.play().catch(() => {});
                        setIsPlaying(true);
                    }
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

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(() => {});
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <section 
            ref={sectionRef} 
            className="relative py-12 sm:py-20 overflow-hidden bg-gradient-to-b from-white via-zinc-50/40 to-white dark:from-zinc-950 dark:via-zinc-900/20 dark:to-zinc-950 border-t border-b border-zinc-100 dark:border-zinc-900 scroll-mt-20"
        >
            {/* Soft Premium Glow Background - Exactly matching your red-500 tint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/[0.03] dark:bg-red-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-5 lg:px-8 relative z-10">
                
                {/* Header Section */}
                <div className={`text-center mb-12 max-w-xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase text-red-500 bg-red-500/5 border border-red-500/10 mb-3 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Demo
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                        See Ladamark in Action
                    </h2>
                    <p className="mt-2 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mx-auto leading-relaxed">
                        Discover how our intuitive ecosystem simplifies your catalog operations in less than two minutes.
                    </p>
                </div>

                {/* Video Dashboard Canvas Container */}
                <div className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    
                    {/* Premium Laptop/Dashboard Glass Container */}
                    <div className="w-full bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-xl shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/70 dark:border-zinc-800/70 p-2 flex flex-col transform hover:-translate-y-1 transition-all duration-500 overflow-hidden group">
                        
                        {/* Browser Control Accent Top Bar */}
                        <div className="flex items-center justify-between px-2 pb-2 pt-1 flex-shrink-0 border-b border-zinc-100 dark:border-zinc-800/60">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-red-500/30 transition-colors duration-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-red-500/30 transition-colors duration-300"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover:bg-red-500/30 transition-colors duration-300"></div>
                            </div>
                            {/* URL Mockup badge for realism */}
                            <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100/50 dark:bg-zinc-950/40 px-3 py-0.5 rounded border border-zinc-200/40 dark:border-zinc-800/40 select-none">
                                ladamark.com/demo
                            </div>
                            <div className="w-12" />
                        </div>
                        
                        {/* Video Display Core */}
                        <div className="flex-grow w-full rounded-lg bg-zinc-50 dark:bg-zinc-950/60 overflow-hidden relative aspect-video mt-2 group/video">
                            
                            {/* Replace the src with your actual dashboard walkthrough video link */}
                            <video 
                                ref={videoRef}
                                className="w-full h-full object-cover object-top"
                                loop
                                muted
                                playsInline
                                src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-a-lappy-42261-large.mp4"
                            />

                            {/* Clickable Hover Play/Pause Overlay */}
                            <div 
                                onClick={togglePlay}
                                className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-300 ${isPlaying ? 'opacity-0 group-hover/video:opacity-100 bg-zinc-950/10 dark:bg-zinc-950/30' : 'opacity-100 bg-zinc-950/5 dark:bg-zinc-950/20'}`}
                            >
                                {/* Premium Action Trigger Ball - Dynamic Theme Matching */}
                                <div className="w-14 h-14 sm:w-18 sm:h-18 flex items-center justify-center rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white backdrop-blur shadow-xl transform transition-all duration-300 group-hover/video:scale-110 group-hover/video:bg-red-500 group-hover/video:text-white group-hover/video:shadow-red-500/20 border border-zinc-200/50 dark:border-zinc-700/50 group-hover/video:border-red-400">
                                    {isPlaying ? (
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current pl-0.5" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Red Progress Indicator Bar synced with theme */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800">
                                <div className="h-full bg-red-500 w-1/4 animate-[pulse_2s_infinite]" />
                            </div>
                        </div>
                    </div>

                    {/* Premium Light Drop-shadow Glow Effect beneath the layout */}
                    <div className="absolute -bottom-4 left-12 right-12 h-6 bg-red-500/[0.04] dark:bg-red-500/[0.02] blur-xl rounded-full -z-10" />
                </div>
            </div>
        </section>
    );
};

export default DemoVideoShowcase;
