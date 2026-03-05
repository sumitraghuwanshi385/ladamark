
import React, { useState, useEffect, useRef } from 'react';

const StepIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-center w-12 h-12 mb-6 bg-[var(--accent-bg-muted)] text-[var(--accent-text-primary)] rounded-lg border border-[var(--border-accent-translucent)]">
    {children}
  </div>
);

const steps = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
    title: "1. Upload Your Images",
    description: "Effortlessly upload your entire product catalog. Our secure, high-speed system processes thousands of images in minutes, getting you ready for analysis without delay.",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    title: "2. Let AI Suggest Tags",
    description: "Our vision AI analyzes each image for context, color, material, and style, suggesting a rich set of tags with industry-leading accuracy to build your taxonomy.",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    title: "3. Approve & Export Data",
    description: "Quickly review and approve the AI's suggestions in our intuitive editor. Once perfected, export your complete, structured data as a clean CSV or JSON file.",
  },
];

const HowItWorks: React.FC = () => {
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
    <section ref={sectionRef} className="py-20 sm:py-28 bg-[var(--background-secondary)]">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">Get started in 3 simple steps</h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">Labeling your entire product catalog has never been easier.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`bg-[var(--background-primary)] p-8 rounded-xl border border-[var(--border-primary)] shadow-lg shadow-[var(--shadow-primary)] transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--accent-shadow)] hover:-translate-y-2 ${isVisible ? 'animate-pop-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms`}}
            >
              <StepIcon>{step.icon}</StepIcon>
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">{step.title}</h3>
              <p className="text-[var(--text-secondary)]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
