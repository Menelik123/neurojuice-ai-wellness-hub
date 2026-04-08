// Pricing constants for NeuroJuice products
export const PRICE_PER_JUICE = 8.5;
export const PRICE_WITH_SEA_MOSS = 9.5;
export const PRICE_SEA_MOSS_SHOT = 1.0;
export const MEMBER_PRICE_PER_JUICE = 7.5;
export const VITAL_PASS_PRICE = 5;

// Bundle pricing
export const BUNDLE_3_PRICE = 23;
export const BUNDLE_5_PRICE = 38;
export const BUNDLE_10_PRICE = 70;

// Format price with USD locale
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Standard juice price formatted
export const STANDARD_JUICE_PRICE = formatPrice(PRICE_PER_JUICE);
