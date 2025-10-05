import { similar } from './fuzzy';
import type { GuestCsvRow } from './csv';

export type DedupeResult = {
  unique: GuestCsvRow[];
  duplicates: { indices: number[]; reason: string }[];
};

export function dedupeGuests(rows: GuestCsvRow[]): DedupeResult {
  const emailIndex = new Map<string, number>();
  const used = new Set<number>();
  const duplicates: { indices: number[]; reason: string }[] = [];
  const unique: GuestCsvRow[] = [];

  rows.forEach((row, idx) => {
    const email = row.email?.toLowerCase().trim() || '';
    if (email.length > 0) {
      if (emailIndex.has(email)) {
        const first = emailIndex.get(email)!;
        used.add(idx);
        duplicates.push({ indices: [first, idx], reason: 'same email' });
        return;
      }
      emailIndex.set(email, idx);
    }
    unique.push(row);
  });

  // Fuzzy duplicate detection by first + last name
  // Simple O(n^2) pass for MVP scale
  const threshold = 0.85;
  const dupSet = new Set<number>();
  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const a = unique[i];
      const b = unique[j];
      const firstScore = similar(a.first_name, b.first_name);
      const lastScore = similar(a.last_name, b.last_name);
      if ((firstScore + lastScore) / 2 >= threshold) {
        dupSet.add(j);
        duplicates.push({ indices: [i, j], reason: 'fuzzy name match' });
      }
    }
  }

  const uniqueFiltered = unique.filter((_, idx) => !dupSet.has(idx));
  return { unique: uniqueFiltered, duplicates };
}

