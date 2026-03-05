
import React, { useRef, useEffect, useState } from 'react';

const IntegrationIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-[var(--accent-text-primary)]`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.596a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);


const audienceData = [
  {
    name: "Marketplaces",
    description: "Solve inconsistent seller data. Standardize product information from thousands of vendors to improve search, discovery, and the shopping experience.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--accent-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  },
  {
    name: "D2C Brands",
    description: "Go beyond basic tags. Enrich your product listings with detailed attributes that power faceted search, drive SEO, and create a premium shopping experience.",
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--accent-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  },
  {
    name: "Catalog Teams",
    description: "Eliminate tedious data entry. Drastically reduce manual work and maintenance time, freeing your team to focus on strategic catalog curation and optimization.",
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--accent-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <polygon strokeLinecap="round" strokeLinejoin="round" points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline strokeLinecap="round" strokeLinejoin="round" points="2 17 12 22 22 17"></polyline>
            <polyline strokeLinecap="round" strokeLinejoin="round" points="2 12 12 17 22 12"></polyline>
        </svg>
    ),
  },
   {
    name: "Platform Integrations",
    description: "Connect Ladamark seamlessly with your existing tools. Push rich product data directly to Shopify, Magento, BigCommerce, and more.",
    icon: <IntegrationIcon />,
  },
];

const Audience: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
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
        const currentRef = containerRef.current;
        if (currentRef) {
          observer.observe(currentRef);
        }
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
      }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            containerRef.current.style.setProperty('--mouse-x', `${x}px`);
            containerRef.current.style.setProperty('--mouse-y', `${y}px`);
        };

        const currentRef = containerRef.current;
        currentRef?.addEventListener('mousemove', handleMouseMove);

        return () => {
            currentRef?.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

  return (
    <section ref={containerRef} className="py-20 sm:py-32 audience-spotlight-bg">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Built for Ambitious E-commerce Teams
            <span className="ml-3 align-middle text-xs font-semibold uppercase tracking-wider bg-yellow-400/20 text-yellow-400 px-2.5 py-1 rounded-full">
              Coming Soon
            </span>
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] animation-delay-200">Whether you're a growing brand or a massive marketplace, Ladamark scales with you.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {audienceData.map((item, index) => (
            <div 
                key={item.name} 
                className={`audience-card ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 200 + 300}ms`}}
            >
              <div className="audience-card-content relative z-10 rounded-2xl p-8 h-full flex flex-col items-center text-center">
                <div className="flex-shrink-0 w-16 h-16 mb-6 flex items-center justify-center rounded-xl bg-[var(--accent-bg-muted)] border border-[var(--border-accent-translucent)] transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">{item.name}</h3>
                <p className="text-[var(--text-secondary)] flex-grow">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
