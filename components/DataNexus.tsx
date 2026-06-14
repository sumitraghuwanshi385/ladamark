import React, { useState, useEffect, useRef } from 'react';

// Sleek unified stroke icons
const ContentSVG = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const AttributesSVG = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 4H14" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 4H3" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12H12" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12H3" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 20H16" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 20H3" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 2v4" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 10v4" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 18v4" /></svg>;
const PricingSVG = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const SeoTagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>;

const icons: { [key: string]: React.ReactNode } = {
    "AI-Generated Content": <ContentSVG />,
    "Smart Attributes": <AttributesSVG />,
    "Pricing Suggestions": <PricingSVG />,
    "SEO Keywords": <SeoTagIcon />
};

const products = [
    {
        imageSrc: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1024&auto=format&fit=crop",
        alt: "A stylish chronograph watch",
        dataPoints: [
            { title: "AI-Generated Content", data: ["Name: Chronograph Leather Watch", "Desc: Sophisticated multi-function dial..."] },
            { title: "Smart Attributes", data: ["Category: Watches (100%)", "Strap: Genuine Leather (95%)"] },
            { title: "Pricing Suggestions", data: ["Currency: USD Market", "Suggested Range: $100 - $180"] },
            { title: "SEO Keywords", data: ["chronograph watch", "men's luxury timepiece"] }
        ]
    },
    {
        imageSrc: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1024&auto=format&fit=crop",
        alt: "A woman in a vibrant floral summer dress",
        dataPoints: [
            { title: "AI-Generated Content", data: ["Name: Floral Midi Summer Dress", "Desc: Breezy layout with light textures..."] },
            { title: "Smart Attributes", data: ["Category: Dresses (100%)", "Pattern: Floral Accent (99%)"] },
            { title: "Pricing Suggestions", data: ["Currency: USD Market", "Suggested Range: $60 - $95"] },
            { title: "SEO Keywords", data: ["floral dress", "summer midi apparel"] }
        ]
    },
    {
        imageSrc: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1024&auto=format&fit=crop",
        alt: "A bottle of cosmetic oil",
        dataPoints: [
            { title: "AI-Generated Content", data: ["Name: Organic Glow Facial Oil", "Desc: Nourishing blend of natural extracts..."] },
            { title: "Smart Attributes", data: ["Category: Skincare (99%)", "Feature: Certified Vegan (92%)"] },
            { title: "Pricing Suggestions", data: ["Currency: USD Market", "Suggested Range: $45 - $65"] },
            { title: "SEO Keywords", data: ["organic facial oil", "hydrating skin serum"] }
        ]
    }
];

const DataNexus: React.FC<{ onSignUpClick: (e: React.MouseEvent) => void }> = ({ onSignUpClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animationKey, setAnimationKey] = useState(0);
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
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % products.length);
            setAnimationKey(prevKey => prevKey + 1);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const currentProduct = products[currentIndex];

    const dataPointPositions = [
        "top-4 left-4 lg:left-8",
        "top-4 right-4 lg:right-8",
        "bottom-4 left-4 lg:left-8",
        "bottom-4 right-4 lg:right-8"
    ];

    const pathDefinitions = [
        "M 50 50 L 12 12",
        "M 50 50 L 88 12",
        "M 50 50 L 12 88",
        "M 50 50 L 88 88"
    ];

    return (
        <section ref={sectionRef} className="relative py-12 sm:py-20 overflow-hidden bg-gradient-to-b from-white via-zinc-50/40 to-white dark:from-zinc-950 dark:via-zinc-900/20 dark:to-zinc-950 border-t border-b border-zinc-100 dark:border-zinc-900 scroll-mt-20">
            {/* Ambient Background Blur Layer - Pure vibrant red matching the branding */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-5 lg:px-8 relative z-10">
                
                {/* Header Block */}
                <div className={`text-center mb-10 max-w-xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase text-red-500 bg-red-500/5 border border-red-500/10 mb-3">
                        Data Pipeline
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                        From Pixels to Profit Engine
                    </h2>
                    <p className="mt-2 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mx-auto leading-relaxed">
                        Ladamark transforms static assets into rich contextual tags, accelerating your discovery metrics instantly.
                    </p>
                </div>

                {/* Centralized Core Dynamic Canvas */}
                <div key={animationKey} className={`relative max-w-3xl mx-auto h-[28rem] hidden md:block transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-98'}`}>
                    
                    {/* Background Subtle Tech Graphic Identity Badge */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] dark:opacity-[0.02] pointer-events-none select-none z-0">
                        <span className="text-6xl font-black tracking-[0.25em] uppercase font-sans">Ladamark</span>
                    </div>

                    {/* Central Radar Image Target */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="relative w-44 h-44">
                            <img src={currentProduct.imageSrc} alt={currentProduct.alt} className="w-full h-full object-cover rounded-full border border-zinc-200/50 dark:border-zinc-800 shadow-xl" />
                            <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping [animation-duration:3s]" />
                            <div className="absolute inset-[-12px] rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 opacity-60 animate-spin-[20s]" />
                        </div>
                    </div>

                    {/* Interactive Linking Vector Rays */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
                        {pathDefinitions.map((d, index) => (
                            <React.Fragment key={index}>
                                <path
                                    d={d}
                                    stroke="currentColor"
                                    strokeWidth="0.25"
                                    fill="none"
                                    className="text-zinc-200 dark:text-zinc-800"
                                    style={{ vectorEffect: 'non-scaling-stroke' }}
                                />
                                <circle r="0.7" className="fill-red-500">
                                    <animateMotion dur="2.5s" repeatCount="indefinite" path={d} begin={`${index * 0.2}s`} />
                                </circle>
                            </React.Fragment>
                        ))}
                    </svg>

                    {/* High-fidelity Floating Nodes */}
                    {currentProduct.dataPoints.map((point, index) => (
                        <div key={point.title} className={`absolute w-56 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 shadow-md rounded-lg p-3.5 z-30 transition-transform duration-500 hover:-translate-y-0.5 ${dataPointPositions[index]}`}>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-red-500 dark:text-red-400">{icons[point.title]}</span>
                                <h4 className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight">{point.title}</h4>
                            </div>
                            <ul className="space-y-1 border-t border-zinc-50 dark:border-zinc-800/40 pt-1.5">
                                {point.data.map(item => (
                                    <li key={item} className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium truncate list-none">{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Mobile Fallback Grid Flow */}
                <div className={`md:hidden space-y-6 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex justify-center">
                        <div className="relative w-40 h-40">
                            <img src={currentProduct.imageSrc} alt={currentProduct.alt} className="w-full h-full object-cover rounded-full border border-zinc-200 dark:border-zinc-800 shadow-lg" />
                            <div className="absolute inset-0 rounded-full border border-red-500/20 animate-pulse" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {currentProduct.dataPoints.map((point) => (
                            <div key={point.title} className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-lg p-4 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-red-500">{icons[point.title]}</span>
                                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white tracking-tight">{point.title}</h4>
                                </div>
                                <ul className="space-y-1 border-t border-zinc-50 dark:border-zinc-800/50 pt-2">
                                    {point.data.map(item => (
                                        <li key={item} className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium truncate list-none">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compact Action Trigger Footer */}
                <div className={`text-center mt-10 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <a
                        href="#"
                        onClick={onSignUpClick}
                        className="inline-flex items-center justify-center text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-md shadow-sm shadow-red-500/10 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Unlock Your Data
                    </a>
                </div>

            </div>
        </section>
    );
};

export default DataNexus;
