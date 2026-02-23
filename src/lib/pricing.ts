// Pricing constants for NeuroJuice products
export const PRICE_PER_JUICE = 6;

// Format price with USD locale
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Standard juice price formatted
export const STANDARD_JUICE_PRICE = formatPrice(PRICE_PER_JUICE);