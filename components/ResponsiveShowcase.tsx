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
                    // Automatically play video when sections comes into view (optional)
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
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
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
            className="relative py-20 sm:py-28 overflow-hidden bg-zinc-950 text-white border-b border-zinc-900 scroll-mt-20"
        >
            {/* Ultra-Premium Ambient Glow Background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/[0.08] dark:bg-indigo-500/[0.12] rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-violet-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
                
                {/* Header Section */}
                <div className={`text-center mb-14 max-w-2xl mx-auto transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 mb-4 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" /> Product Walkthrough
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-400">
                        See Ladamark in Action
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-zinc-400 font-normal max-w-lg mx-auto leading-relaxed">
                        Discover how our high-performance catalog ecosystem simplifies your operations in under two minutes. 
                    </p>
                </div>

                {/* Premium Cinematic Video Player Container */}
                <div className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.97] translate-y-12'}`}>
                    
                    {/* Futuristic Glass & Border Beam Wrapper */}
                    <div className="relative group rounded-2xl bg-zinc-900/40 backdrop-blur-xl p-2 border border-zinc-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 hover:border-zinc-700/60 hover:shadow-indigo-500/[0.03]">
                        
                        {/* Browser Styling Header */}
                        <div className="flex items-center justify-between px-3 pb-3 pt-1 border-b border-zinc-800/50">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-zinc-800 group-hover:bg-red-500/40 transition-colors duration-300" />
                                <span className="w-3 h-3 rounded-full bg-zinc-800 group-hover:bg-yellow-500/40 transition-colors duration-300" />
                                <span className="w-3 h-3 rounded-full bg-zinc-800 group-hover:bg-green-500/40 transition-colors duration-300" />
                            </div>
                            <div className="text-[10px] text-zinc-600 font-mono select-none bg-zinc-950/40 px-4 py-0.5 rounded-md border border-zinc-800/30">
                                ladamark.com/demo_walkthrough
                            </div>
                            <div className="w-12" /> {/* Balancing spacer */}
                        </div>

                        {/* Video Canvas Section */}
                        <div className="relative aspect-video w-full rounded-xl bg-zinc-950 overflow-hidden mt-2 group/video">
                            
                            {/* Replace this dummy video source with your real SaaS dashboard video file */}
                            <video 
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-a-lappy-42261-large.mp4" 
                            />

                            {/* Overlays: Darken on hover if paused, or show controls */}
                            <div 
                                onClick={togglePlay}
                                className={`absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent flex items-center justify-center cursor-pointer transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover/video:opacity-100 bg-zinc-950/20' : 'opacity-100'}`}
                            >
                                {/* Premium Play/Pause Glass Trigger Button */}
                                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl transform transition-all duration-300 group-hover/video:scale-110 group-hover/video:bg-indigo-600 group-hover/video:border-indigo-400">
                                    {isPlaying ? (
                                        // Pause Icon
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current" viewBox="0 0 24 24">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                        </svg>
                                    ) : (
                                        // Play Icon (Aligned perfectly with padding-left hack for visuals)
                                        <svg className="w-6 h-6 sm:w-8 sm:h-8 fill-current pl-1" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Video Progress Bar (Visual Mockup or connected to video duration) */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/80">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 w-1/3 animate-[pulse_3s_infinite]" />
                            </div>

                        </div>
                    </div>

                    {/* Subtle Shadow Decorator beneath the video laptop layout */}
                    <div className="absolute -bottom-6 left-10 right-10 h-6 bg-indigo-500/10 blur-xl rounded-full -z-10 opacity-60" />
                </div>
            </div>
        </section>
    );
};

export default DemoVideoShowcase;
