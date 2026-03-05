
import React, { useState, useEffect, useRef } from 'react';

// SVG icons for data points, consistent with the application UI
const ContentSVG = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const AttributesSVG = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 4H14" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 4H3" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12H12" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12H3" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 20H16" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 20H3" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 2v4" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 10v4" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 18v4" /></svg>;
const PricingSVG = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const SeoTagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>;

const icons: { [key: string]: React.ReactNode } = {
    "AI-Generated Content": <ContentSVG />,
    "Smart Attributes": <AttributesSVG />,
    "Pricing Suggestions": <PricingSVG />,
    "SEO Keywords": <SeoTagIcon />
};

// Data for the component to cycle through
const products = [
    {
        imageSrc: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1024&auto=format&fit=crop",
        alt: "A stylish chronograph watch",
        dataPoints: [
            { title: "AI-Generated Content", data: ["Product Name: Chronograph Dial Leather Watch", "Description: A sophisticated timepiece with a multi-function dial..."] },
            { title: "Smart Attributes", data: ["Category: Watches (100%)", "Dial Color: Black (98%)", "Strap: Leather (95%)", "Style: Formal (90%)"] },
            { title: "Pricing Suggestions", data: ["Currency: USD", "Suggested Min: $100", "Suggested Max: $180"] },
            { title: "SEO Keywords", data: ["chronograph watch", "men's leather watch", "formal timepiece", "multi-function watch"] }
        ]
    },
    {
        imageSrc: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1024&auto=format&fit=crop",
        alt: "A woman in a vibrant floral summer dress",
        dataPoints: [
            { title: "AI-Generated Content", data: ["Product Name: Floral Print Midi Summer Dress", "Description: Embrace the sunshine with this breezy floral midi dress..."] },
            { title: "Smart Attributes", data: ["Category: Dresses (100%)", "Pattern: Floral (99%)", "Sleeve Style: Sleeveless (96%)", "Length: Midi (94%)"] },
            { title: "Pricing Suggestions", data: ["Currency: USD", "Suggested Min: $60", "Suggested Max: $95"] },
            { title: "SEO Keywords", data: ["floral dress", "summer midi dress", "sleeveless dress", "women's casual dress"] }
        ]
    },
    {
        imageSrc: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1024&auto=format&fit=crop",
        alt: "A bottle of cosmetic oil",
        dataPoints: [
            { title: "AI-Generated Content", data: ["Product Name: Organic Glow Facial Oil", "Description: Revitalize your skin with this nourishing blend of natural oils..."] },
            { title: "Smart Attributes", data: ["Category: Skincare (99%)", "Type: Facial Oil (97%)", "Container: Glass Dropper (95%)", "Feature: Vegan (92%)"] },
            { title: "Pricing Suggestions", data: ["Currency: USD", "Suggested Min: $45", "Suggested Max: $65"] },
            { title: "SEO Keywords", data: ["organic facial oil", "hydrating serum", "natural skincare", "glow drops"] }
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
        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            if(currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const currentProduct = products[currentIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % products.length);
            setAnimationKey(prevKey => prevKey + 1); // Reset animation state by changing key
        }, 8000); // Cycle every 8 seconds

        return () => clearInterval(interval);
    }, []);
    
    // Positions for the data point cards on a circle
    const dataPointPositions = [
        "top-0 left-0", // Top-left
        "top-0 right-0", // Top-right
        "bottom-0 left-0", // Bottom-left
        "bottom-0 right-0" // Bottom-right
    ];
    
    // SVG Path `d` attributes from center to corners
    const pathDefinitions = [
        "M 50 50 L 5 5",
        "M 50 50 L 95 5",
        "M 50 50 L 5 95",
        "M 50 50 L 95 95"
    ];

    return (
        <section ref={sectionRef} className="relative data-nexus-bg py-20 sm:py-32 bg-[var(--background-primary)] overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className={`text-center mb-16 max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">From Pixels to Profit Engine</h2>
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">Ladamark transforms static images into a dynamic nexus of actionable data, fueling everything from search to personalization.</p>
                </div>

                <div key={animationKey} className={`relative max-w-4xl mx-auto h-[40rem] hidden md:block ${isVisible ? 'animate-pop-in' : 'opacity-0'}`} style={{animationDelay: '200ms'}}>
                    {/* Central Image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-72 h-72">
                             <img src={currentProduct.imageSrc} alt={currentProduct.alt} className="w-full h-full object-cover rounded-full shadow-2xl shadow-[var(--accent-shadow)]" />
                             <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-primary)]/50 pulse-glow"></div>
                             <div className="absolute inset-[-20px] rounded-full border border-[var(--border-secondary)] opacity-50 animate-spin-slow"></div>
                             <div className="absolute inset-[-40px] rounded-full border border-[var(--border-secondary)] opacity-30 animate-spin-slow-reverse"></div>
                        </div>
                    </div>
                    
                    {/* SVG Lines */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        {pathDefinitions.map((d, index) => (
                           <React.Fragment key={index}>
                                <path
                                    d={d}
                                    stroke="url(#line-gradient)"
                                    strokeWidth="0.5"
                                    fill="none"
                                    className="data-stream-path"
                                    style={{ animationDelay: `${index * 0.2 + 0.5}s`, vectorEffect: 'non-scaling-stroke' }}
                                />
                                <circle r="1" fill="var(--accent-primary)" className="opacity-75">
                                    <animateMotion
                                        dur="3s"
                                        repeatCount="indefinite"
                                        path={d}
                                        begin={`${index * 0.4 + 1.2}s`}
                                    />
                                </circle>
                           </React.Fragment>
                        ))}
                        <defs>
                            <linearGradient id="line-gradient" gradientTransform="rotate(45)">
                                <stop offset="0%" stopColor="var(--accent-secondary)" />
                                <stop offset="100%" stopColor="var(--accent-primary)" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Data Points */}
                    {currentProduct.dataPoints.map((point, index) => (
                        <div key={point.title} className={`absolute w-64 ${dataPointPositions[index].replace('left-0', 'lg:left-0 -left-8').replace('right-0', 'lg:right-0 -right-8')}`} style={{ animationDelay: `${index * 0.2 + 1}s`}}>
                            <div
                                className="data-nexus-card rounded-2xl p-4"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[var(--accent-primary)]">{icons[point.title]}</span>
                                    <h4 className="font-semibold text-[var(--text-primary)]">{point.title}</h4>
                                </div>
                                <ul className="space-y-1">
                                    {point.data.map(item => (
                                        <li key={item} className="text-sm text-[var(--text-secondary)] truncate">{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Mobile Fallback View */}
                <div className={`md:hidden space-y-8 ${isVisible ? 'animate-pop-in' : 'opacity-0'}`} style={{animationDelay: '200ms'}}>
                    <div className="flex justify-center">
                        <img src={currentProduct.imageSrc} alt={currentProduct.alt} className="w-64 h-64 object-cover rounded-2xl shadow-2xl shadow-[var(--accent-shadow)]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {currentProduct.dataPoints.map((point) => (
                        <div key={point.title} className="data-nexus-card rounded-2xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[var(--accent-primary)]">{icons[point.title]}</span>
                                <h4 className="font-semibold text-[var(--text-primary)]">{point.title}</h4>
                            </div>
                            <ul className="space-y-1">
                                {point.data.map(item => (
                                    <li key={item} className="text-sm text-[var(--text-secondary)] truncate">{item}</li>
                                ))}
                            </ul>
                        </div>
                       ))}
                    </div>
                </div>

                <div className={`text-center mt-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '500ms'}}>
                    <a 
                        href="#" 
                        onClick={onSignUpClick} 
                        className="inline-block text-lg font-semibold text-white bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-shadow)]"
                    >
                        Unlock Your Data
                    </a>
                </div>
            </div>
        </section>
    );
};

export default DataNexus;
