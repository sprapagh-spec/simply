import { z } from 'zod';

export const guestCsvSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  household: z.string().optional(),
  address: z.string().optional(),
});

export type GuestCsvRow = z.infer<typeof guestCsvSchema>;

export function cleanName(input: string): string {
  const trimmed = input.trim();
  if (trimmed.length === 0) return trimmed;
  return trimmed
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function mapHeaders(row: Record<string, string>): GuestCsvRow {
  return {
    email: row['email'] ?? row['Email'] ?? '',
    first_name: cleanName(row['first_name'] ?? row['First Name'] ?? row['firstName'] ?? ''),
    last_name: cleanName(row['last_name'] ?? row['Last Name'] ?? row['lastName'] ?? ''),
    household: row['Household'] ?? row['household'] ?? undefined,
    address: row['Address'] ?? row['address'] ?? undefined,
  };
}

export function validateRows(rows: Record<string, string>[]) {
  const mapped = rows.map(mapHeaders);
  const parsed = mapped.map((r) => guestCsvSchema.safeParse(r));
  const valid: GuestCsvRow[] = [];
  const errors: { index: number; issues: string[] }[] = [];
  parsed.forEach((res, idx) => {
    if (res.success) valid.push(res.data);
    else errors.push({ index: idx, issues: res.error.issues.map((i) => i.message) });
  });
  return { valid, errors };
}

