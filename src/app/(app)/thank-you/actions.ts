"use server";

import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/currency';

export async function getThankYouQueue() {
  try {
    // Get all guests with their most recent gift
    const guests = await prisma.guest.findMany({
      include: {
        gifts: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Filter to only guests with unthanked gifts
    const queueItems = guests
      .filter(guest => {
        const lastGift = guest.gifts[0];
        return lastGift && 
               ['cleared', 'succeeded'].includes(lastGift.status) && 
               !lastGift.thankedAt;
      })
      .map(guest => {
        const lastGift = guest.gifts[0];
        return {
          guestId: guest.id,
          guestName: `${guest.firstName} ${guest.lastName}`,
          guestEmail: guest.email,
          giftId: lastGift.id,
          giftAmount: lastGift.amountNetCents,
          giftCurrency: lastGift.currency,
          giftDate: lastGift.createdAt,
          giftMethod: lastGift.method,
          giftMemo: lastGift.memo,
        };
      })
      .sort((a, b) => b.giftDate.getTime() - a.giftDate.getTime());

    return queueItems;
  } catch (error) {
    console.error('Error fetching thank-you queue:', error);
    return [];
  }
}

export async function getThankYouHistory() {
  try {
    const notes = await prisma.thankYouNote.findMany({
      include: {
        guest: true,
        template: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return notes;
  } catch (error) {
    console.error('Error fetching thank-you history:', error);
    return [];
  }
}

export async function getThankYouTemplates() {
  try {
    const templates = await prisma.thankYouTemplate.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return templates;
  } catch (error) {
    console.error('Error fetching thank-you templates:', error);
    return [];
  }
}

export async function markGiftAsThanked(giftId: string) {
  try {
    await prisma.gift.update({
      where: { id: giftId },
      data: { thankedAt: new Date() },
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking gift as thanked:', error);
    return { success: false, error: 'Failed to mark gift as thanked' };
  }
}

export async function createThankYouNote(data: {
  guestId: string;
  giftId?: string;
  templateId: string;
  subject: string;
  bodyHtml: string;
  status?: string;
}) {
  try {
    const note = await prisma.thankYouNote.create({
      data: {
        ...data,
        status: data.status || 'draft',
      },
    });

    return { success: true, note };
  } catch (error) {
    console.error('Error creating thank-you note:', error);
    return { success: false, error: 'Failed to create thank-you note' };
  }
}

export async function sendThankYouNote(noteId: string) {
  try {
    const note = await prisma.thankYouNote.findUnique({
      where: { id: noteId },
      include: { guest: true, template: true },
    });

    if (!note) {
      return { success: false, error: 'Note not found' };
    }

    // TODO: Implement actual email sending
    // For now, just mark as sent and update gift
    await prisma.$transaction(async (tx) => {
      await tx.thankYouNote.update({
        where: { id: noteId },
        data: { 
          status: 'sent',
          sentAt: new Date(),
        },
      });

      if (note.giftId) {
        await tx.gift.update({
          where: { id: note.giftId },
          data: { thankedAt: new Date() },
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending thank-you note:', error);
    return { success: false, error: 'Failed to send thank-you note' };
  }
}
