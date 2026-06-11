import React, { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    quote: "Ladamark saved us 60+ hours/week of manual tagging. What used to be a bottleneck is now a competitive advantage. The ROI was immediate.",
    name: "Aarav Sharma",
    title: "Catalog Director at Zenwear",
  },
  {
    quote: "The accuracy is what blew us away. We've enriched our product data tenfold, leading to better search, better filters, and a clear lift in conversion.",
    name: "Sarah Jenkins",
    title: "Head of E-commerce, Urban Essentials",
  },
  {
    quote: "A must-have tool for any serious marketplace. The level of detail from the AI analysis gives us a significant edge over competitors.",
    name: "Yuki Tanaka",
    title: "Head of Seller Experience, Marketplace Co",
  },
  {
    quote: "We reduced our data enrichment costs by 70% while improving quality. Ladamark is an essential part of our e-commerce stack.",
    name: "Michael Chang",
    title: "Founder, NextGen D2C",
  },
  {
    quote: "Their AI understands nuance in fashion that other services miss. Our conversion rate on recommended products is up 15%.",
    name: "Emily Rodriguez",
    title: "Merchandising Lead at VOGUE Style"
  },
  {
    quote: "The setup was unbelievably fast. We went from a messy spreadsheet to a fully-tagged, searchable catalog in under a day. Phenomenal product.",
    name: "David Vance",
    title: "COO of The Gadget Shop"
  },
  {
    quote: "The interface is so intuitive. Our team was up and running in hours, not days. The time savings are incredible.",
    name: "Priya Patel",
    title: "Operations Director, StyleStream"
  },
  {
    quote: "Ladamark fundamentally changed how we handle product data. It's faster, more accurate, and has freed up our team for more strategic work.",
    name: "Robert Gallagher",
    title: "E-commerce Analyst, The Retail Group"
  },
  {
    quote: "Processing metadata for thousands of global fashion items used to take weeks. Ladamark tags everything instantly with absolute precision.",
    name: "Ananya Iyer",
    title: "VP of Supply Chain, Global Threads"
  },
  {
    quote: "The deep category classification tool adapted seamlessly to our niche inventory setup. It works flawlessly right out of the box.",
    name: "Marcus Brody",
    title: "Technical Product Manager, TechArmor"
  },
  {
    quote: "Scale used to scare our database ops team. With Ladamark, handling ingestion cycles for massive catalogs feels completely effortlessly.",
    name: "Kenji Sato",
    title: "Lead Developer, Tokyo Trade Hub"
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
    if (currentRef) observer.observe(currentRef);
    return () => {
        if (currentRef) observer.unobserve(currentRef);
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
      }, 3000);
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
    <section ref={sectionRef} className="relative py-12 sm:py-20 overflow-hidden bg-gradient-to-b from-white via-zinc-50/30 to-white dark:from-zinc-950 dark:via-zinc-900/10 dark:to-zinc-950 border-t border-b border-zinc-100 dark:border-zinc-900 scroll-mt-20">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-red-500/[0.03] rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-5 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className={`text-center mb-10 max-w-xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase text-red-500 bg-red-500/5 border border-red-500/10 mb-3">
            Reviews
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            Loved by Teams Globally
          </h2>
          <p className="mt-1.5 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-sm mx-auto">
            See how leading e-commerce teams are saving hours with Ladamark.
          </p>
        </div>

        {/* Dynamic Card Layout Stack */}
        <div 
          className={`relative max-w-2xl mx-auto h-[260px] sm:h-[230px] cursor-pointer transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ perspective: '1200px' }}
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
          onClick={handleNavigationClick}
        >
          {testimonials.map((testimonial, index) => {
            let offset = index - activeIndex;
            
            // Handle infinity looping offsets smoothly
            if (offset < -2) offset += testimonials.length;
            if (offset > 2) offset -= testimonials.length;
            
            const isCardRendered = Math.abs(offset) <= 2;
            const transformStr = `rotateY(${offset * 18}deg) translateX(${offset * 22}%) scale(${1 - Math.abs(offset) * 0.12})`;
            const opacityVal = isCardRendered ? (index === activeIndex ? 1 : 0.45 - Math.abs(offset) * 0.15) : 0;
            const zIndexVal = testimonials.length - Math.abs(offset);

            return (
              <div
                key={index}
                className="absolute top-0 left-0 w-full h-full transition-all duration-500 ease-out"
                style={{
                  transform: transformStr,
                  opacity: opacityVal,
                  zIndex: zIndexVal,
                  pointerEvents: index === activeIndex ? 'auto' : 'none',
                }}
              >
                {/* Premium Adaptive Opaqueness Card UI */}
                <div className={`w-full h-full flex flex-col justify-between p-5 sm:p-6 rounded-xl border transition-all duration-500 relative overflow-hidden ${
                  index === activeIndex 
                    ? 'bg-white dark:bg-zinc-900 border-red-500/30 dark:border-red-500/20 shadow-[0_12px_40px_-12px_rgba(239,68,68,0.1)]' 
                    : 'bg-white/90 dark:bg-zinc-900/80 border-zinc-200/60 dark:border-zinc-800/60 shadow-sm'
                }`}
                style={{
                  boxShadow: index === activeIndex ? 'inset 0 1px 0 0 rgba(255,255,255,0.9), 0 12px 40px -12px rgba(239,68,68,0.06)' : 'inset 0 1px 0 0 rgba(255,255,255,0.5)'
                }}>
                  
                  {/* Fixed Overlaid Brand Watermark - Repositioned to Top-Right corner to prevent collapse */}
                  <div className="absolute right-4 top-3 select-none pointer-events-none transition-opacity duration-300">
                    <span className={`text-base sm:text-lg font-black tracking-[0.2em] uppercase font-sans ${
                      index === activeIndex 
                        ? 'text-zinc-200/50 dark:text-zinc-800/30' 
                        : 'text-transparent'
                    }`}>
                      Ladamark
                    </span>
                  </div>

                  <blockquote className="relative z-10 flex-grow pt-3 pr-12">
                    <p className="text-[13px] sm:text-[14px] font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed tracking-tight">
                      "{testimonial.quote}"
                    </p>
                  </blockquote>

                  <figcaption className="relative z-10 mt-4 border-t border-zinc-100 dark:border-zinc-800/40 pt-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white tracking-tight">
                        {testimonial.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                        {testimonial.title}
                      </p>
                    </div>
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
