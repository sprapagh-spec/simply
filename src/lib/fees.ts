export const PLATFORM_FEE_CENTS = 200; // $2.00
export const PROCESSING_RATE = 0.029; // 2.9%
export const PROCESSING_FIXED_CENTS = 30; // $0.30

export type FeeBreakdown = {
  grossCents: number;
  platformFeeCents: number;
  processingFeeCents: number;
  netCents: number;
};

export function calculateFees(grossCents: number): FeeBreakdown {
  if (!Number.isFinite(grossCents) || grossCents < 0) {
    throw new Error('grossCents must be a non-negative finite number');
  }
  const platformFeeCents = PLATFORM_FEE_CENTS;
  const processingFee = Math.round(grossCents * PROCESSING_RATE) + PROCESSING_FIXED_CENTS;
  const net = grossCents - platformFeeCents - processingFee;
  return {
    grossCents: Math.round(grossCents),
    platformFeeCents: platformFeeCents,
    processingFeeCents: processingFee,
    netCents: net,
  };
}

