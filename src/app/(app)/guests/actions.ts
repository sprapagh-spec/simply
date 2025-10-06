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
      include: {
        gifts: {
          orderBy: { receivedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { firstName: 'asc' },
    });

    return guests.map(guest => ({
      ...guest,
      lastGift: guest.gifts[0] || null,
    }));
  } catch (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
}
