import React, { useState, useEffect, useRef } from 'react';
import { Bot, Check, X, ChevronDown, Globe } from 'lucide-react';
import { PLAN_DETAILS, CURRENCIES, PRO_PRICES } from './plans';

const CheckIcon = ({ className = "w-4 h-4" }) => <Check className={`${className} text-emerald-500`} strokeWidth={3} />;
const CrossIcon = ({ className = "w-4 h-4" }) => <X className={`${className} text-zinc-400`} strokeWidth={2.5} />;

const Pricing: React.FC<{ onSignUpClick: (e: React.MouseEvent) => void }> = ({ onSignUpClick }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const proCardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedCurrency, setSelectedCurrency] = useState('INR');
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Close custom dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsCurrencyDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const plans = PLAN_DETAILS;
    const proPrice = PRO_PRICES[selectedCurrency][billingCycle];
    const activeCurrency = CURRENCIES.find(c => c.code === selectedCurrency) || { symbol: '₹', code: 'INR' };

    return (
        <section id="pricing" ref={sectionRef} className="relative py-12 sm:py-20 overflow-hidden bg-gradient-to-b from-white via-zinc-50/50 to-white dark:from-zinc-950 dark:via-zinc-900/30 dark:to-zinc-950 border-t border-b border-zinc-100 dark:border-zinc-900 scroll-mt-20">
            {/* Subtle Premium Glow background */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-5 lg:px-8 relative z-10">
                
                {/* Header Section */}
                <div className={`text-center mb-10 max-w-xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase text-red-500 bg-red-500/5 border border-red-500/10 mb-3.5">
                        Plans
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                        Pricing Plans
                    </h2>
                    <p className="mt-2 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-md mx-auto">
                        Choose the plan that's right for you. Start for free and scale as you grow.
                    </p>
                </div>

                {/* Filters Row: Custom Currency & Billing Toggle */}
                <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    
                    {/* 1. Custom Premium Currency Dropdown Selector */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                            className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                        >
                            <Globe size={14} className="text-zinc-400" />
                            <span>{activeCurrency.symbol} {activeCurrency.code}</span>
                            <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCurrencyDropdownOpen && (
                            <div className="absolute left-0 mt-1 w-36 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-xl z-50 py-1 overflow-hidden">
                                {CURRENCIES.map(c => (
                                    <button
                                        key={c.code}
                                        onClick={() => {
                                            setSelectedCurrency(c.code);
                                            setIsCurrencyDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${selectedCurrency === c.code ? 'text-red-500 bg-red-50/50 dark:bg-red-500/5 font-semibold' : 'text-zinc-700 dark:text-zinc-300'}`}
                                    >
                                        {c.symbol} {c.code}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2. Billing Cycle Slide Switch Toggle */}
                    <div className="flex items-center gap-3 bg-zinc-100/80 dark:bg-zinc-900/50 p-1 rounded-md border border-zinc-200/40 dark:border-zinc-800/40">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-3 py-1 text-xs font-semibold rounded-sm transition-all ${billingCycle === 'monthly' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-sm transition-all ${billingCycle === 'yearly' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
                        >
                            <span>Yearly</span>
                            <span className="text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded-sm">
                                Save 17%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Cards Layout Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto">
                    {Object.values(plans).map((plan, index) => {
                        const isPro = plan.name === 'Pro';
                        return (
                            <div 
                                key={plan.name} 
                                ref={isPro ? proCardRef : null} 
                                className={`relative group h-full bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md p-6 sm:p-7 rounded-md border transition-all duration-500 flex flex-col ${
                                    isPro 
                                        ? 'border-red-500/60 dark:border-red-500/50 bg-gradient-to-b from-white to-red-500/[0.01]' 
                                        : 'border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:scale-[1.005]'
                                }`}
                                style={{ 
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                    transitionDelay: `${index * 100}ms`,
                                    boxShadow: isPro 
                                        ? '0 10px 30px -15px rgba(239, 68, 68, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)'
                                        : '0 4px 20px -2px rgba(120, 120, 120, 0.02), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)'
                                }}
                            >
                                {/* Fixed Most Popular Floating Badge (No overlapping clash) */}
                                {isPro && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                                        <span className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-md shadow-md shadow-red-500/10">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Card Header */}
                                <div className="mb-4">
                                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                                        {plan.name}
                                    </h3>
                                    <p className="mt-1 text-[12.5px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed min-h-[36px]">
                                        {plan.description}
                                    </p>
                                </div>

                                {/* Price block */}
                                <div className="my-2 flex items-baseline gap-1 border-b border-zinc-100 dark:border-zinc-800/60 pb-5">
                                    <span className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                                        {isPro ? proPrice : `${activeCurrency.symbol}0`}
                                    </span>
                                    {isPro && (
                                        <span className="text-xs font-medium text-zinc-400">
                                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Features Checklist Content */}
                                <ul className="mt-4 space-y-3 text-[13px] font-medium flex-grow">
                                    {plan.features.map((feature) => (
                                        <li key={feature.text} className="flex items-start gap-2.5">
                                            <div className="mt-0.5 flex-shrink-0">
                                                {feature.included ? <CheckIcon /> : <CrossIcon />}
                                            </div>
                                            <span className={`${feature.included ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 line-through'}`}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Compact Custom CTA Action Button */}
                                <div className="mt-6">
                                    <button 
                                        onClick={onSignUpClick} 
                                        className={`w-full text-center py-2 px-4 rounded-md text-xs font-bold tracking-wide transition-all duration-300 ${
                                            isPro 
                                                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-red-500/10 hover:opacity-95 active:scale-[0.985]' 
                                                : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 active:scale-[0.985]'
                                        }`}
                                    >
                                        {plan.buttonText}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Custom Quote Text Link */}
                <div className={`text-center mt-10 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Need a custom solution?{' '}
                        <a href="#" className="font-bold text-red-500 hover:text-red-600 underline underline-offset-4 decoration-red-500/30">
                            Contact us for Enterprise pricing.
                        </a>
                    </p>
                </div>

            </div>
        </section>
    );
};

export default Pricing;
