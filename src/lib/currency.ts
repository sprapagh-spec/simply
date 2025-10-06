/**
 * Format currency amount from cents to display string
 */
export function formatCurrency(amountCents: number, currency = "CAD"): string {
  const amount = amountCents / 100;
  
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parse currency string to cents
 */
export function parseCurrency(amount: string): number {
  // Remove currency symbols and parse as float
  const cleanAmount = amount.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleanAmount);
  
  if (isNaN(parsed)) {
    throw new Error('Invalid currency amount');
  }
  
  return Math.round(parsed * 100);
}

/**
 * Get currency symbol for display
 */
export function getCurrencySymbol(currency = "CAD"): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(0).replace(/[0-9\s]/g, '');
}
