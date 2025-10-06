"use server";
import { z } from 'zod';
import { validateRows, type GuestCsvRow, cleanName } from '@/lib/csv';
import { dedupeGuests } from '@/lib/dedupe';
import { inferHouseholds } from '@/lib/households';
import { prisma } from '@/lib/prisma';

const rowSchema = z.object({
  email: z.string().optional(),
  first_name: z.string(),
  last_name: z.string(),
  address: z.string().optional(),
});

const previewSchema = z.object({
  rows: z.array(z.record(z.string(), z.string())),
});

export async function validateAndPreview(input: z.infer<typeof previewSchema>) {
  const { valid, errors } = validateRows(input.rows);
  const cleaned: GuestCsvRow[] = valid.map((r) => ({
    ...r,
    first_name: cleanName(r.first_name),
    last_name: cleanName(r.last_name),
  }));
  const dedupe = dedupeGuests(cleaned);
  const households = inferHouseholds(dedupe.unique);
  return { cleaned: dedupe.unique, duplicates: dedupe.duplicates, households, errors };
}

const commitSchema = z.object({
  rows: z.array(rowSchema),
});

export async function commitImport(input: z.infer<typeof commitSchema>) {
  // Idempotency is not strictly enforced in MVP; could hash rows later
  const result = await prisma.$transaction(async (tx) => {
    for (const r of input.rows) {
      const guest = await tx.guest.create({
        data: {
          email: r.email && r.email.trim() !== '' ? r.email.toLowerCase() : null,
          firstName: r.first_name,
          lastName: r.last_name,
          rsvpStatus: 'NOT_INVITED',
          consentSource: 'implied',
        },
      });

      await tx.auditLog.create({
        data: {
          guestId: guest.id,
          action: 'import_guest',
          details: JSON.stringify({ source: 'csv' }),
        },
      });
    }
    return { created: input.rows.length };
  });

  return result;
}

