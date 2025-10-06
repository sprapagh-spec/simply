"use client";

import { formatCurrency } from '@/lib/currency';

interface GiftTooltipProps {
  gift: {
    amountGrossCents: number;
    platformFeeCents: number;
    processingFeeCents: number;
    amountNetCents: number;
    currency: string;
  };
  children: React.ReactNode;
}

export function GiftTooltip({ gift, children }: GiftTooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-ink text-surface text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        <div className="space-y-1">
          <div>Gross: {formatCurrency(gift.amountGrossCents, gift.currency)}</div>
          <div>Platform fee: {formatCurrency(gift.platformFeeCents, gift.currency)}</div>
          <div>Processing fee: {formatCurrency(gift.processingFeeCents, gift.currency)}</div>
          <div className="font-semibold border-t border-surface/20 pt-1">
            Net: {formatCurrency(gift.amountNetCents, gift.currency)}
          </div>
        </div>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-ink"></div>
      </div>
    </div>
  );
}
