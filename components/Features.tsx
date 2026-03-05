
import React, { useState, useEffect, useRef } from 'react';

// --- ICONS ---
const VisualRecognitionIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const DescriptionGenIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125l-8.932 8.931" /></svg>;
const DollarIcon = ({className="h-6 w-6"}: {className?: string}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22"></path>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);
const AutoAttributesIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.75h18M3 12h18M3 19.25h18M8.25 2.75v4M15.75 10v4M12 17.25v4" /></svg>;
const SeoTaggingIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>;
const QuickApproveIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const FeatureCard: React.FC<{icon: React.ReactElement<{ className?: string }>; title: string; description: string;}> = ({ icon, title, description }) => (
    <div className="feature-card-glow h-full">
        <div className="relative z-10 bg-[var(--background-primary)] p-6 rounded-lg border border-[var(--border-primary)] transition-all duration-300 h-full flex flex-col text-left transform hover:-translate-y-1">
            <div className="flex-shrink-0 w-12 h-12 mb-5 flex items-center justify-center rounded-xl bg-[var(--accent-bg-muted)] text-[var(--accent-text-primary)] border border-[var(--border-accent-translucent)]">
                {React.cloneElement(icon, { className: "h-7 w-7" })}
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)] flex-grow">{description}</p>
        </div>
    </div>
);

const features = [
  {
    icon: <VisualRecognitionIcon />,
    name: "Visual Recognition",
    description: "Uploads are instantly scanned to understand product type, brand, category, and style.",
  },
  {
    icon: <DescriptionGenIcon />,
    name: "Product Name & Description Generation",
    description: "Get compelling, detailed product titles and descriptions using AI — optimized for eCommerce.",
  },
  {
    icon: <DollarIcon />,
    name: "Price Recommendation",
    description: "Ladamark suggests price ranges using real-time product intelligence.",
  },
   {
    icon: <AutoAttributesIcon />,
    name: "Auto Attributes",
    description: "AI detects and fills in critical attributes like color, material, type, gender, style, etc.",
  },
   {
    icon: <SeoTaggingIcon />,
    name: "Smart SEO Tagging",
    description: "AI suggests high-intent, keyword-rich SEO tags to improve search visibility.",
  },
   {
    icon: <QuickApproveIcon />,
    name: "Quick Edit & Approve",
    description: "Review, edit, or approve results with one click — and send to your catalog instantly."
  }
];

const Features: React.FC<{ onSignUpClick: (e: React.MouseEvent) => void }> = ({ onSignUpClick }) => {
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
        if (currentRef) {
            observer.unobserve(currentRef);
        }
    };
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-20 sm:py-28 bg-[var(--background-secondary)] scroll-mt-28">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 max-w-3xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">What Ladamark AI does for you:</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.name} className={`${isVisible ? 'animate-pop-in' : 'opacity-0'}`} style={{ animationDelay: `${index * 100}ms`}}>
                <FeatureCard 
                    icon={feature.icon}
                    title={feature.name}
                    description={feature.description}
                />
            </div>
          ))}
        </div>
        <div className={`text-center mt-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <a 
                href="#"
                onClick={onSignUpClick}
                className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full transition-all duration-300 overflow-hidden transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-shadow)]"
            >
                <span className="relative z-10">Start Smart Tagging for Free</span>
                <svg className="relative z-10 w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
