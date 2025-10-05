import type { GuestCsvRow } from './csv';

export type HouseholdGroup = { key: string; members: number[] };

function extractDomain(email?: string | null): string | null {
  if (!email) return null;
  const at = email.indexOf('@');
  if (at === -1) return null;
  return email.slice(at + 1).toLowerCase();
}

export function inferHouseholds(rows: GuestCsvRow[]): HouseholdGroup[] {
  const groups = new Map<string, number[]>();
  rows.forEach((r, idx) => {
    const key = r.household?.trim() && r.household?.trim() !== ''
      ? `name:${r.household?.trim()?.toLowerCase()}`
      : extractDomain(r.email) ? `domain:${extractDomain(r.email)}` : null;
    if (!key) return;
    const arr = groups.get(key) ?? [];
    arr.push(idx);
    groups.set(key, arr);
  });
  return Array.from(groups.entries()).map(([key, members]) => ({ key, members }));
}

