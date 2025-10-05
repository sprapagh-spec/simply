import { describe, it, expect } from 'vitest';
import { calculateFees } from '../fees';

describe('calculateFees', () => {
  it('computes fees for $100.00', () => {
    const cents = 10000;
    const r = calculateFees(cents);
    expect(r.grossCents).toBe(10000);
    expect(r.platformFeeCents).toBe(200);
    // 2.9% of 10000 = 290 + 30 = 320
    expect(r.processingFeeCents).toBe(320);
    expect(r.netCents).toBe(10000 - 200 - 320);
  });

  it('handles zero', () => {
    const r = calculateFees(0);
    expect(r.netCents).toBe(0 - 200 - 30);
  });

  it('throws on negative', () => {
    expect(() => calculateFees(-1)).toThrow();
  });
});

