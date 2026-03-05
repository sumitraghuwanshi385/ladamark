

import React from 'react';
import { type View } from './MainApplication';
import { type Plan, PLAN_DETAILS, PRO_PRICES } from './plans';

// Icons
const CreditCardIcon = ({className="w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" /></svg>;
const DownloadIcon = ({ className = "w-4 h-4" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const ArrowLeftIcon = ({className="w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const CheckIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);
const CrossIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 ${className}`}>
        {children}
    </div>
);

interface PaymentDetailsPageProps {
    setView: (view: View) => void;
    plan: Plan;
    quota: {
        daily: { used: number; limit: number };
        monthly: { used: number; limit: number };
    };
    currency: string;
}

const PaymentDetailsPage: React.FC<PaymentDetailsPageProps> = ({ setView, plan, quota, currency }) => {
    
    const currentPlanDetails = PLAN_DETAILS[plan];

    const paymentHistory = [
        { id: 'inv_1', date: 'Sep 25, 2024', amount: '12.00', plan: 'Pro Monthly' },
        { id: 'inv_2', date: 'Aug 25, 2024', amount: '12.00', plan: 'Pro Monthly' },
        { id: 'inv_3', date: 'Jul 25, 2024', amount: '12.00', plan: 'Pro Monthly' },
    ];

    return (
        <section className="space-y-4 max-w-4xl mx-auto">
            <div>
                <button onClick={() => setView('controls')} className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-hover)] hover:shadow-md border border-transparent hover:border-[var(--border-secondary)] transform hover:-translate-y-px">
                    <ArrowLeftIcon />
                    Back to Settings
                </button>
                <div className="flex items-center gap-3">
                    <CreditCardIcon className="w-6 h-6 text-[var(--accent-primary)]" />
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        Payment Details
                    </h2>
                </div>
                <p className="text-md text-[var(--text-secondary)] mt-1">Manage your billing information, plan, and view invoices.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-2 flex flex-col gap-6">
                    <Card>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Current Plan</h3>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[var(--background-primary)] p-4 rounded-lg border border-[var(--border-secondary)]">
                            <div>
                                <p className="font-bold text-2xl text-[var(--accent-primary)] capitalize">{currentPlanDetails.name} Plan</p>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">
                                    {plan === 'pro' ? (
                                        <><span className="font-semibold text-[var(--text-primary)]">{PRO_PRICES[currency]?.monthly || PRO_PRICES['USD'].monthly}/month</span> - Next renewal on Oct 25, 2024.</>
                                    ) : (
                                        <span className="font-semibold text-[var(--text-primary)]">Free forever.</span>
                                    )}
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex-shrink-0">
                                {plan === 'free' ? (
                                    <button className="px-4 py-2 text-sm font-bold rounded-lg transition-colors bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]">Upgrade to Pro</button>
                                ): (
                                    <button className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background-hover)]">Manage Subscription</button>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-base font-semibold mb-3 text-[var(--text-primary)]">Features included in your plan:</h4>
                            <ul className="space-y-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                {currentPlanDetails.features.map(feature => (
                                     <li key={feature.text} className="flex items-start gap-3">
                                        {feature.included ? <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> : <CrossIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />}
                                        <span className={`${feature.included ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)] line-through'}`}>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </div>
                
                <Card>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Payment History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs text-[var(--text-muted)] uppercase">
                                <tr>
                                    <th className="p-2">Date</th>
                                    <th className="p-2 text-right">Amount</th>
                                    <th className="p-2 text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plan === 'pro' && paymentHistory.map(p => (
                                    <tr key={p.id} className="border-t border-[var(--border-primary)]">
                                        <td className="p-2 text-[var(--text-secondary)]">{p.date}</td>
                                        <td className="p-2 text-right text-[var(--text-primary)] font-semibold">$ {p.amount}</td>
                                        <td className="p-2 text-right">
                                            <button className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-bg-muted)] transition-colors">
                                                <DownloadIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {plan === 'free' && <p className="text-center text-xs py-4 text-[var(--text-muted)]">No payment history for the free plan.</p>}
                    </div>
                </Card>

            </div>
        </section>
    );
};

export default PaymentDetailsPage;