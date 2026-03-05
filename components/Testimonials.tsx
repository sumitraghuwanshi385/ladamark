
import React, { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    quote: "Ladamark saved us 60+ hours/week of manual tagging. What used to be a bottleneck is now a competitive advantage. The ROI was immediate.",
    name: "Sonal M.",
    title: "Catalog Manager at Zenwear",
  },
  {
    quote: "The accuracy is what blew us away. We've enriched our product data tenfold, leading to better search, better filters, and a clear lift in conversion.",
    name: "James K.",
    title: "Head of E-commerce, Urban Essentials",
  },
  {
    quote: "A must-have tool for any serious marketplace. The level of detail from the AI analysis gives us a significant edge over competitors.",
    name: "Maria Garcia",
    title: "Head of Seller Experience, Marketplace Co",
  },
  {
    quote: "We reduced our data enrichment costs by 70% while improving quality. Ladamark is an essential part of our e-commerce stack.",
    name: "David Lee",
    title: "Founder, NextGen D2C",
  },
  {
    quote: "Their AI understands nuance in fashion that other services miss. Our conversion rate on recommended products is up 15%.",
    name: "Chloe R.",
    title: "Merchandising Lead at VOGUE Style"
  },
  {
    quote: "The setup was unbelievably fast. We went from a messy spreadsheet to a fully-tagged, searchable catalog in under a day. Phenomenal product.",
    name: "Ben Carter",
    title: "COO of The Gadget Shop"
  },
  {
    quote: "The interface is so intuitive. Our team was up and running in hours, not days. The time savings are incredible.",
    name: "Emily White",
    title: "Operations Director, StyleStream"
  },
  {
    quote: "Ladamark fundamentally changed how we handle product data. It's faster, more accurate, and has freed up our team for more strategic work.",
    name: "Michael Brown",
    title: "E-commerce Analyst, The Retail Group"
  }
];

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayRef = useRef<number | null>(null);
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

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const startAutoplay = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = window.setInterval(() => {
          nextSlide();
      }, 2500);
  };
  
  const stopAutoplay = () => {
      if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
          autoplayRef.current = null;
      }
  };
  
  const handleNavigationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const midpoint = rect.width / 2;

    if (clickX < midpoint) {
        prevSlide();
    } else {
        nextSlide();
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 bg-[var(--background-secondary)] overflow-hidden">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-16 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">Loved by Teams That Demand Quality</h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">See how leading e-commerce teams are saving time and improving data with Ladamark.</p>
        </div>

        <div 
          className={`relative max-w-4xl mx-auto h-[350px] cursor-pointer ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
          style={{ perspective: '1000px', animationDelay: '300ms' }}
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
          onClick={handleNavigationClick}
        >
          {testimonials.map((testimonial, index) => {
            const offset = index - activeIndex;
            const isVisible = Math.abs(offset) <= 2; // Only render active and a couple on each side
            const transform = `rotateY(${offset * 25}deg) translateX(${offset * 30}%) scale(${1 - Math.abs(offset) * 0.2})`;
            const opacity = isVisible ? 1 - Math.abs(offset) * 0.4 : 0;
            const zIndex = testimonials.length - Math.abs(offset);

            return (
              <div
                key={index}
                className="absolute top-0 left-0 w-full h-full transition-all duration-300 ease-out"
                style={{
                  transform: transform,
                  opacity: opacity,
                  zIndex: zIndex,
                  pointerEvents: 'none',
                }}
              >
                <div className={`w-full h-full flex flex-col justify-between p-8 md:p-10 rounded-2xl bg-[var(--background-primary)] border border-[var(--border-primary)] shadow-2xl shadow-[var(--shadow-primary)] transition-all duration-300 ${activeIndex === index ? 'border-[var(--border-accent-translucent)] shadow-[var(--accent-shadow)]' : 'opacity-70'}`}>
                    <svg className="absolute top-6 left-6 w-16 h-16 text-[var(--background-tertiary)] opacity-80" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.984 20.016q0 2.016-1.248 3.864t-3.6 1.848q-2.4 0-3.816-1.848t-1.416-3.864q0-2.016 1.152-4.416t3.648-6.144q2.496-3.744 4.080-8.208h4.416q-2.592 6.336-4.224 9.696t-1.632 5.088zM22.032 20.016q0 2.016-1.248 3.864t-3.6 1.848q-2.4 0-3.816-1.848t-1.416-3.864q0-2.016 1.152-4.416t3.648-6.144q2.496-3.744 4.080-8.208h4.416q-2.592 6.336-4.224 9.696t-1.632 5.088z"></path>
                    </svg>
                    <blockquote className="relative z-10 flex-grow">
                        <p className="text-lg md:text-xl font-medium text-[var(--text-primary)] leading-relaxed" style={{ textWrap: 'balance' }}>
                          {testimonial.quote}
                        </p>
                    </blockquote>
                    <figcaption className="relative z-10 mt-6 border-t border-[var(--border-secondary)] pt-4">
                        <p className="font-bold text-base text-[var(--text-primary)]">{testimonial.name}</p>
                        <p className="text-sm text-[var(--text-muted)]">{testimonial.title}</p>
                    </figcaption>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
