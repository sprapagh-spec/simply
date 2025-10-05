"use client";
import { useState } from 'react';
import { createCampaign } from './server';

export default function NewCampaignPage() {
  const [name, setName] = useState('Fall Appeal');
  const [subject, setSubject] = useState('We’d love to see you');
  const [template, setTemplate] = useState('<p>Hello {{first_name}}, join us! {{magic_link}}</p>');
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function onCreate() {
    setCreating(true);
    try {
      const r = await createCampaign({ name, subject, template });
      setResult(r);
      alert('Campaign created. Use Send Preview to push dev emails.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">New Campaign</h1>
      <div className="mt-4 space-y-3">
        <label className="block text-sm">Name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border bg-background p-2" /></label>
        <label className="block text-sm">Subject<input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full rounded border bg-background p-2" /></label>
        <label className="block text-sm">Template<textarea value={template} onChange={(e) => setTemplate(e.target.value)} className="mt-1 w-full rounded border bg-background p-2" rows={6} /></label>
        <button onClick={onCreate} disabled={creating} className="rounded bg-primary px-3 py-2 text-primary-foreground text-sm">{creating ? 'Creating…' : 'Create'}</button>
      </div>
      {result && (
        <div className="mt-6 rounded border p-4">
          <p className="text-sm text-muted-foreground">Campaign ID: {result.id}</p>
        </div>
      )}
    </main>
  );
}

