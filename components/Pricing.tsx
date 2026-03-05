







import React, { useState, useEffect, useRef } from 'react';
import { PLAN_DETAILS, CURRENCIES, PRO_PRICES } from './plans';

const CheckIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Pricing: React.FC<{ onSignUpClick: (e: React.MouseEvent) => void }> = ({ onSignUpClick }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const proCardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedCurrency, setSelectedCurrency] = useState('INR');

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
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!proCardRef.current) return;
            const rect = proCardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            proCardRef.current.style.setProperty('--mouse-x', `${x}px`);
            proCardRef.current.style.setProperty('--mouse-y', `${y}px`);
        };

        const currentProCardRef = proCardRef.current;
        currentProCardRef?.addEventListener('mousemove', handleMouseMove);
        return () => {
            currentProCardRef?.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const plans = PLAN_DETAILS;
    const proPrice = PRO_PRICES[selectedCurrency][billingCycle];
    const currencySymbol = CURRENCIES.find(c => c.code === selectedCurrency)?.symbol || '$';

    return (
        <section id="pricing" ref={sectionRef} className="py-20 sm:py-28 bg-[var(--background-primary)] relative overflow-hidden scroll-mt-28">
             <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[var(--background-secondary)] to-[var(--background-primary)] z-0"></div>
             <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className={`text-center mb-12 max-w-2xl mx-auto ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">Pricing Plans</h2>
                    <p className="mt-4 text-base text-[var(--text-secondary)]">Choose the plan that's right for you. Start for free and scale as you grow.</p>
                </div>
                
                 <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '100ms'}}>
                    <label htmlFor="currency-select" className="sr-only">Select Currency</label>
                    <select
                        id="currency-select"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="bg-[var(--background-tertiary)] border border-[var(--border-secondary)] rounded-lg py-2.5 px-3 text-[var(--text-primary)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-colors"
                    >
                        {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
                    </select>
                </div>


                <div className={`flex justify-center items-center gap-4 mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '200ms'}}>
                    <span className={`font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>Monthly</span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className={`relative inline-flex items-center h-7 rounded-full w-12 transition-colors duration-300 focus:outline-none ${billingCycle === 'yearly' ? 'bg-[var(--accent-primary)]' : 'bg-[var(--background-hover)]'}`}
                    >
                        <span className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className={`font-semibold transition-colors ${billingCycle === 'yearly' ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}>
                        Yearly
                        <span className="ml-2 text-xs font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Save 17%</span>
                    </span>
                </div>
                
                <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-8 items-stretch">
                    {Object.values(plans).map((plan, index) => (
                        <div key={plan.name} ref={plan.name === 'Pro' ? proCardRef : null} className={`h-full ${plan.name === 'Pro' ? 'pro-card-spotlight' : ''} ${isVisible ? 'animate-pop-in' : 'opacity-0'}`} style={{ animationDelay: `${200 * (index + 2)}ms` }}>
                             <div className={`relative z-10 p-8 rounded-2xl h-full flex flex-col border transition-all duration-300 transform hover:-translate-y-2 ${plan.name === 'Pro' ? 'bg-[var(--background-secondary)] border-[var(--accent-primary)]/50' : 'bg-[var(--background-primary)] border-[var(--border-primary)] hover:border-[var(--border-accent-translucent)] hover:shadow-xl hover:shadow-[var(--shadow-primary)]'}`}>
                                {plan.name === 'Pro' && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-[var(--accent-primary)] text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                                    </div>
                                )}
                                <h3 className="text-lg font-semibold text-[var(--accent-text-primary)] uppercase tracking-wider">{plan.name}</h3>
                                <p className="mt-4 text-sm text-[var(--text-secondary)] min-h-[40px]">{plan.description}</p>

                                <div className="mt-6 flex items-baseline gap-1">
                                    <span key={billingCycle + selectedCurrency} className="text-4xl font-bold tracking-tight text-[var(--text-primary)] animate-price-change">
                                        {plan.name === 'Pro' ? proPrice : `${currencySymbol}0`}
                                    </span>
                                    {plan.name === 'Pro' && <span className="text-lg font-medium text-[var(--text-secondary)]">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>}
                                </div>
                                
                                <ul className="mt-8 space-y-4 text-sm flex-grow">
                                    {plan.features.map((feature, featIndex) => (
                                        <li key={feature.text} className={`flex items-start gap-3 ${isVisible ? 'animate-stagger-in' : ''}`} style={{animationDelay: `${(200 * (index + 2)) + (featIndex * 50)}ms`}}>
                                            {feature.included ? <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> : <CrossIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                                            <span className={`${feature.included ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] line-through'}`}>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a href="#" onClick={onSignUpClick} className={`mt-10 block w-full text-center py-3.5 px-6 rounded-lg font-semibold transition-all duration-300 ${plan.name === 'Pro' ? 'bg-[var(--accent-secondary)] hover:bg-[var(--accent-secondary-hover)] text-white' : 'bg-[var(--accent-bg-muted)] hover:bg-[var(--accent-bg-subtle)] text-[var(--accent-text-primary)]'}`}>
                                    {plan.buttonText}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className={`text-center mt-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '800ms'}}>
                    <p className="text-lg text-[var(--text-secondary)]">Need a custom solution? <a href="#" className="font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]">Contact us for Enterprise pricing.</a></p>
                </div>
            </div>
        </section>
    );
};

export default Pricing;