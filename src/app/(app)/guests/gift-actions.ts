"use server";

import { prisma } from '@/lib/prisma';
import { calculateFees } from '@/lib/fees';
import { revalidatePath } from 'next/cache';

export async function updateGiftAmount(giftId: string, newAmountCents: number) {
  try {
    const fees = calculateFees(newAmountCents);
    
    const updatedGift = await prisma.gift.update({
      where: { id: giftId },
      data: {
        amountGrossCents: fees.grossCents,
        platformFeeCents: fees.platformFeeCents,
        processingFeeCents: fees.processingFeeCents,
        amountNetCents: fees.netCents,
      },
    });

    revalidatePath('/');
    revalidatePath('/gifts');
    
    return { success: true, gift: updatedGift };
  } catch (error) {
    console.error('Error updating gift amount:', error);
    return { success: false, error: 'Failed to update gift amount' };
  }
}

export async function createManualGift(guestId: string, amountCents: number, method: string = 'cash', memo?: string) {
  try {
    const fees = calculateFees(amountCents);
    
    const gift = await prisma.gift.create({
      data: {
        guestId,
        method,
        amountGrossCents: fees.grossCents,
        platformFeeCents: fees.platformFeeCents,
        processingFeeCents: fees.processingFeeCents,
        amountNetCents: fees.netCents,
        status: 'cleared',
        memo: memo || 'Manual entry',
      },
    });

    revalidatePath('/');
    revalidatePath('/gifts');
    
    return { success: true, gift };
  } catch (error) {
    console.error('Error creating manual gift:', error);
    return { success: false, error: 'Failed to create gift' };
  }
}
