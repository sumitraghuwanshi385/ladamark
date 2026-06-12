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

// Updated dynamically matching the premium 199 INR scaling
export const PRO_PRICES: { [key: string]: { monthly: string; yearly: string } } = {
    INR: { monthly: '₹199', yearly: '₹1,990' },
    USD: { monthly: '$2.39', yearly: '$23.90' },
    EUR: { monthly: '€2.20', yearly: '€22.00' },
    JPY: { monthly: '¥320', yearly: '¥3,200' },
    GBP: { monthly: '£1.90', yearly: '£19.00' },
    AUD: { monthly: 'A$3.70', yearly: 'A$37.00' },
    CAD: { monthly: 'CA$3.20', yearly: 'CA$32.00' },
    CHF: { monthly: 'CHF 2.20', yearly: 'CHF 22.00' },
    CNY: { monthly: '¥17.60', yearly: '¥176.00' },
    BRL: { monthly: 'R$13.80', yearly: 'R$138.00' },
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
