"use server";

import { prisma } from '@/lib/prisma';
import { RsvpStatus } from '@/lib/rsvp';

export async function updateRsvpStatus(guestId: string, rsvpStatus: RsvpStatus) {
  try {
    const guest = await prisma.guest.update({
      where: { id: guestId },
      data: {
        rsvpStatus,
        rsvpUpdatedAt: new Date(),
      },
    });

    // Log the change
    await prisma.auditLog.create({
      data: {
        guestId,
        action: 'rsvp_status_updated',
        details: `RSVP status changed to ${rsvpStatus}`,
      },
    });

    return { success: true, guest };
  } catch (error) {
    console.error('Error updating RSVP status:', error);
    return { success: false, error: 'Failed to update RSVP status' };
  }
}

export async function getGuestsWithLastGift() {
  try {
    const guests = await prisma.guest.findMany({
      orderBy: { firstName: 'asc' },
    });

    // Get last gift for each guest separately to avoid complex joins
    const guestsWithGifts = await Promise.all(
      guests.map(async (guest) => {
        const lastGift = await prisma.gift.findFirst({
          where: { guestId: guest.id },
          orderBy: { createdAt: 'desc' },
        });
        
        return {
          ...guest,
          lastGift,
        };
      })
    );

    return guestsWithGifts;
  } catch (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
}
