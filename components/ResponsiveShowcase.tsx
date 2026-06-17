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
            className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-white via-zinc-50/40 to-white dark:from-zinc-950 dark:via-zinc-900/20 dark:to-zinc-950 border-t border-b border-zinc-100 dark:border-zinc-900 scroll-mt-20"
        >
            {/* iOS 27 Fluid Liquid Glass Background Blobs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-gradient-to-tr from-red-500/10 to-rose-500/[0.02] dark:from-red-500/[0.06] dark:to-transparent rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] blur-[80px] animate-[pulse_8s_infinite_alternate] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-zinc-200/50 to-red-500/[0.03] dark:from-zinc-800/20 dark:to-red-900/[0.04] rounded-[60%_40%_30%_70%_/_50%_30%_70%_50%] blur-[100px] animate-[pulse_10s_infinite_alternate_2s] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-5 lg:px-8 relative z-10">
                
                {/* Header Section */}
                <div className={`text-center mb-14 max-w-xl mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase text-red-500 bg-red-500/[0.06] dark:bg-red-500/10 border border-red-500/20 mb-4 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-none">
                        Live Demo
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
                        See Ladamark in Action
                    </h2>
                    <p className="mt-3 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mx-auto leading-relaxed">
                        Discover how our high-performance ecosystem simplifies your catalog management in less than two minutes.
                    </p>
                </div>

                {/* macOS Premium Screen Container */}
                <div className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98] translate-y-4'}`}>
                    
                    {/* Liquid Glass Apple macOS Window Frame */}
                    <div className="w-full bg-white/40 dark:bg-zinc-900/30 backdrop-blur-2xl rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.12)] dark:shadow-[0_40px_120px_rgba(0,0,0,0.7)] border border-white/60 dark:border-zinc-800/50 p-2 flex flex-col transform hover:-translate-y-1 transition-all duration-500 overflow-hidden group">
                        
                        {/* Genuine macOS Window Top Bar */}
                        <div className="flex items-center justify-between px-3 pb-2.5 pt-1.5 flex-shrink-0 border-b border-zinc-200/30 dark:border-zinc-800/40">
                            {/* Window Controls (Mac Style) */}
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] shadow-sm flex items-center justify-center relative group/btn">
                                    <span className="text-[7px] text-[#4c0002] font-bold opacity-0 group-hover/btn:opacity-100 absolute transition-opacity duration-150 select-none">×</span>
                                </div>
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] shadow-sm flex items-center justify-center relative group/btn">
                                    <span className="text-[9px] text-[#5c3e00] font-bold opacity-0 group-hover/btn:opacity-100 absolute bottom-[0px] transition-opacity duration-150 select-none">-</span>
                                </div>
                                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAA2C] shadow-sm flex items-center justify-center relative group/btn">
                                    <span className="text-[6px] text-[#033600] font-bold opacity-0 group-hover/btn:opacity-100 absolute transition-opacity duration-150 select-none">⤢</span>
                                </div>
                            </div>
                            
                            {/* Liquid Glass URL Address Bar */}
                            <div className="text-[11px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400 bg-zinc-200/30 dark:bg-zinc-950/40 px-8 py-1 rounded-lg border border-white/40 dark:border-zinc-800/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none min-w-[14rem] sm:min-w-[18rem] text-center select-none backdrop-blur-md">
                                ladamark.com/live-walkthrough
                            </div>
                            
                            {/* Window Actions Spacer */}
                            <div className="w-14" />
                        </div>
                        
                        {/* Video Display Core Canvas */}
                        <div className="flex-grow w-full rounded-xl bg-zinc-100 dark:bg-zinc-950 overflow-hidden relative aspect-video mt-2.5 group/video shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] dark:shadow-none">
                            
                            {/* SaaS Premium Dashboard Interface Video loop */}
                            <video 
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                src="https://player.vimeo.com/external/435674703.sd.mp4?s=9fcf273fe91a52b8602b1b369cfbb8c9c6120b22&profile_id=165&oauth2_token_id=57447761"
                            />

                            {/* Ultra Glassmorphic Interactive Overlay */}
                            <div 
                                onClick={togglePlay}
                                className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-all duration-500 ${isPlaying ? 'opacity-0 group-hover/video:opacity-100 bg-zinc-950/5 dark:bg-zinc-950/20 backdrop-blur-[2px]' : 'opacity-100 bg-zinc-950/[0.02] dark:bg-zinc-950/10 backdrop-blur-[4px]'}`}
                            >
                                {/* iOS 27 Style Liquid Glass Play/Pause Trigger Control */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-white/20 dark:bg-white/[0.06] text-zinc-900 dark:text-white backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[0_12px_40px_0_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] transform transition-all duration-500 ease-out group-hover/video:scale-110 group-hover/video:bg-red-500 group-hover/video:text-white group-hover/video:shadow-red-500/30 border border-white/40 dark:border-white/10 group-hover/video:border-red-400">
                                    {isPlaying ? (
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current pl-1 transition-transform" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Premium Signature Theme Match Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-200/50 dark:bg-zinc-900/60 backdrop-blur-sm">
                                <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 w-1/3 shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-300" />
                            </div>
                        </div>
                    </div>

                    {/* Subtle Liquid Shadow Ambient Anchor */}
                    <div className="absolute -bottom-6 left-16 right-16 h-8 bg-gradient-to-r from-red-500/5 via-rose-500/[0.02] to-transparent blur-2xl rounded-full -z-10 opacity-70" />
                </div>
            </div>
        </section>
    );
};

export default DemoVideoShowcase;
