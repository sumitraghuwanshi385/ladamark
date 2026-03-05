


// Exchange rates relative to USD. In a real app, this would come from an API.
// This is no longer used for landing page pricing, which is now predefined.
// Kept for potential future use in other parts of the app.
export const exchangeRatesToUSD: { [key: string]: number } = {
    USD: 1,
    EUR: 1.08,
    JPY: 0.0064,
    GBP: 1.26,
    AUD: 0.66,
    CAD: 0.73,
    CHF: 1.10,
    CNY: 0.14,
    INR: 0.012,
    BRL: 0.20,
};

/**
 * Converts a price from one currency to another.
 * @param amount The amount to convert.
 * @param fromCurrency The currency to convert from.
 * @param toCurrency The currency to convert to.
 * @returns The converted amount.
 */
export const convertPrice = (amount: number, fromCurrency: string, toCurrency: string): number => {
    const fromRate = exchangeRatesToUSD[fromCurrency] || 1;
    const toRate = exchangeRatesToUSD[toCurrency] || 1;
    const amountInUSD = amount * fromRate;
    return amountInUSD / toRate;
};

/**
 * Formats a number as a currency string.
 * @param amount The amount to format.
 * @param currency The currency code (e.g., 'USD', 'EUR').
 * @returns A formatted currency string.
 */
export const formatCurrency = (amount: number, currency: string): string => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (e) {
        // Fallback for unsupported currency codes
        return `${currency} ${amount.toFixed(2)}`;
    }
};