
export type Plan = 'free' | 'pro';

export const PLAN_LIMITS: { [key in Plan]: { daily: number, monthly: number } } = {
    free: {
        daily: 5,
        monthly: 150,
    },
    pro: {
        daily: 20,
        monthly: 600,
    }
};

export const QUEUE_LIMITS = {
    free: 5,
    pro: 20,
};

export const CURRENCIES = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'U.S. Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
];

export const PRO_PRICES: { [key: string]: { monthly: string; yearly: string } } = {
    INR: { monthly: '₹99', yearly: '₹990' },
    USD: { monthly: '$1.19', yearly: '$11.90' },
    EUR: { monthly: '€1.10', yearly: '€11.00' },
    JPY: { monthly: '¥160', yearly: '¥1600' },
    GBP: { monthly: '£0.95', yearly: '£9.50' },
    AUD: { monthly: 'A$1.85', yearly: 'A$18.50' },
    CAD: { monthly: 'CA$1.60', yearly: 'CA$16.00' },
    CHF: { monthly: 'CHF 1.10', yearly: 'CHF 11.00' },
    CNY: { monthly: '¥8.80', yearly: '¥88.00' },
    BRL: { monthly: 'R$6.90', yearly: 'R$69.00' },
};


export const PLAN_DETAILS = {
    free: {
        name: 'Free',
        description: 'Get started with core features, perfect for individuals and small tests.',
        features: [
            { text: '5 image labels/day', included: true },
            { text: '150 image labels/month', included: true },
            { text: 'Dashboard, AI Labeling, Catalog, History', included: true },
            { text: 'Export up to 5 images/day (CSV only)', included: true },
            { text: 'Attributes Library', included: false },
            { text: 'SEO Library', included: false },
            { text: 'Pricing Labs', included: false },
            { text: 'Advanced Export Formats (JSON, XLSX, ZIP)', included: false },
        ],
        buttonText: 'Start for Free',
    },
    pro: {
        name: 'Pro',
        description: 'For growing brands that need full access and higher volumes.',
        features: [
            { text: '20 image labels/day', included: true },
            { text: '600 image labels/month', included: true },
            { text: 'Full Library Access (Attributes, SEO, Pricing)', included: true },
            { text: 'Dashboard, AI Labeling, Catalog, History', included: true },
            { text: 'Export up to 20 images/day (CSV, JSON, XLSX, ZIP)', included: true },
            { text: 'Access to insights & advanced filters', included: true },
            { text: 'Priority Email Support', included: true },
        ],
        buttonText: 'Get Started with Pro',
    }
};