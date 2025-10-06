"use client";

import { EditableGiftAmount } from './EditableGiftAmount';
import { GiftTooltip } from './GiftTooltip';
import { updateGiftAmount, createManualGift } from '@/app/(app)/guests/gift-actions';

interface GiftAmountCellProps {
  guestId: string;
  gift?: {
    id: string;
    amountNetCents: number;
    currency: string;
    amountGrossCents: number;
    platformFeeCents: number;
    processingFeeCents: number;
  };
}

export function GiftAmountCell({ guestId, gift }: GiftAmountCellProps) {
  if (!gift) {
    return (
      <button
        onClick={async () => {
          const amount = prompt('Enter gift amount (e.g., 25.00):');
          if (amount && !isNaN(parseFloat(amount))) {
            await createManualGift(guestId, Math.round(parseFloat(amount) * 100), 'cash');
          }
        }}
        className="text-muted text-[15px] hover:text-primary transition-colors"
      >
        + Add Gift
      </button>
    );
  }

  return (
    <GiftTooltip gift={gift}>
      <EditableGiftAmount
        guestId={guestId}
        giftId={gift.id}
        amountCents={gift.amountNetCents}
        currency={gift.currency}
        onUpdate={async (newAmount) => {
          await updateGiftAmount(gift.id, newAmount);
        }}
      />
    </GiftTooltip>
  );
}
