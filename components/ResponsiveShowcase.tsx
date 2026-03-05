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
        <section ref={sectionRef} className="py-20 sm:py-28 bg-[var(--background-secondary)] overflow-hidden">
            <div className="container mx-auto px-6">
                <div className={`text-center mb-16 max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                        Access Anywhere, On Any Device
                    </h2>
                    <p className="mt-4 text-lg text-[var(--text-secondary)]">
                        Ladamark is built to be fully responsive, providing a seamless experience whether you're on your desktop or on the go with your mobile device.
                    </p>
                </div>
                <div className={`relative h-[30rem] flex items-center justify-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '300ms'}}>
                    {/* Desktop Mockup */}
                    <div className={`w-full max-w-4xl h-80 bg-[var(--background-secondary)] rounded-2xl shadow-2xl shadow-[var(--shadow-primary)] border border-[var(--border-primary)] p-4 flex flex-col transition-all duration-1000 ${isVisible ? 'animate-float-subtle' : ''}`}>
                        <div className="flex items-center gap-1.5 mb-3 flex-shrink-0">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-grow bg-[var(--background-primary)] rounded-lg p-4 flex gap-4">
                            <div className="w-1/4 h-full bg-[var(--background-secondary)] rounded-md"></div>
                            <div className="w-3/4 h-full bg-[var(--background-secondary)] rounded-md flex flex-col gap-2 p-2">
                                <div className="h-1/4 w-full bg-[var(--accent-bg-muted)] rounded-sm"></div>
                                <div className="h-3/4 w-full bg-[var(--background-tertiary)] rounded-sm"></div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Mockup */}
                    <div className={`absolute -bottom-16 right-1/4 sm:right-1/3 md:right-1/4 w-48 h-96 bg-[var(--background-secondary)] rounded-3xl shadow-2xl shadow-[var(--accent-shadow)] border-4 border-black dark:border-gray-700 p-2 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} style={{animationDelay: '500ms'}}>
                         <div className="bg-[var(--background-primary)] w-full h-full rounded-2xl p-2 flex flex-col gap-2">
                            <div className="h-8 w-full bg-[var(--background-tertiary)] rounded-sm"></div>
                            <div className="flex-grow w-full bg-[var(--accent-bg-muted)] rounded-md"></div>
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResponsiveShowcase;
