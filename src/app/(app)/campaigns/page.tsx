import Link from 'next/link';

export default function CampaignsPage() {
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Campaigns</h1>
        <Link href="/campaigns/new" className="rounded bg-primary px-3 py-2 text-primary-foreground text-sm">New Campaign</Link>
      </div>
    </main>
  );
}

