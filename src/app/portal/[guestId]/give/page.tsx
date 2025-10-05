"use client";
import { useState } from 'react';

export default function GiveGiftPage({ params }: { params: { guestId: string } }) {
  const [amount, setAmount] = useState<number>(50);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createIntent() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-intent', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ guestId: params.guestId, amountCents: Math.round(amount * 100) }),
      });
      const data = await res.json();
      if (data.clientSecret) setClientSecret(data.clientSecret);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold">Give a Gift</h1>
      <p className="mt-2 text-sm text-muted-foreground">Test mode. Click Create Intent to simulate checkout.</p>
      <div className="mt-4 space-y-3">
        <label className="block text-sm">Amount (CAD)
          <input type="number" min={1} step={1} value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 w-full rounded border bg-background p-2" placeholder="50" />
        </label>
        <button onClick={createIntent} disabled={loading}
          className="rounded bg-primary px-3 py-2 text-primary-foreground text-sm">
          {loading ? 'Creating…' : 'Create Intent'}
        </button>
        {clientSecret && (
          <div className="rounded border p-3 text-xs break-all">Client Secret: {clientSecret}</div>
        )}
      </div>
    </main>
  );
}

