import { getThankYouTemplates } from '@/app/(app)/thank-you/actions';
import { getThankYouQueue } from '@/app/(app)/thank-you/actions';
import Link from 'next/link';
import { ThankYouComposer } from '@/components/thankyou/ThankYouComposer';

interface ComposePageProps {
  searchParams: {
    guests?: string;
  };
}

export default async function ComposePage({ searchParams }: ComposePageProps) {
  const [templates, queueItems] = await Promise.all([
    getThankYouTemplates(),
    getThankYouQueue(),
  ]);

  // Parse selected guests from URL params
  const selectedGuestIds = searchParams.guests?.split(',') || [];
  const selectedGuests = queueItems.filter(item => 
    selectedGuestIds.includes(item.guestId)
  );

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-surface">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-ink">SimplyGift</h1>
          <p className="text-sm text-muted mt-1">Guest Invite Management</p>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          <Link href="/" className="rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-brand-50 transition-all">Guests</Link>
          <Link href="/gifts" className="rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-brand-50 transition-all">Gifts</Link>
          <Link href="/thank-you" className="rounded-xl px-4 py-3 text-sm font-medium bg-primary text-primary-foreground">Thank-You Notes</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/thank-you" className="text-primary hover:text-primary-hover transition-colors mb-4 inline-block">
              ← Back to Thank-You Queue
            </Link>
            <h1 className="display text-3xl md:text-4xl text-ink">Compose Thank-You Notes</h1>
            <p className="text-muted mt-2">
              {selectedGuests.length > 0 
                ? `Creating notes for ${selectedGuests.length} recipient${selectedGuests.length > 1 ? 's' : ''}`
                : 'Select recipients and create beautiful thank-you notes'
              }
            </p>
          </div>

          <ThankYouComposer 
            templates={templates}
            selectedGuests={selectedGuests}
            allQueueItems={queueItems}
          />
        </div>
      </main>
    </div>
  );
}
