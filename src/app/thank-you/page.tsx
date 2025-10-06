import { getThankYouQueue, getThankYouHistory } from '@/app/(app)/thank-you/actions';
import { seedThankYouTemplates } from '@/lib/seed-thank-you';
import Link from 'next/link';
import { ThankYouQueue } from '@/components/thankyou/ThankYouQueue';
import { ThankYouHistory } from '@/components/thankyou/ThankYouHistory';

export default async function ThankYouPage() {
  // Ensure templates exist
  await seedThankYouTemplates();
  
  const [queueItems, historyItems] = await Promise.all([
    getThankYouQueue(),
    getThankYouHistory(),
  ]);

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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="display text-3xl md:text-4xl text-ink">Thank-You Notes</h1>
            <p className="text-muted mt-2">Send beautiful notes to your guests in minutes</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-brand-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button className="border-b-2 border-primary text-primary py-2 px-1 text-sm font-medium">
                Queue ({queueItems.length})
              </button>
              <button className="border-b-2 border-transparent text-muted hover:text-ink hover:border-brand-300 py-2 px-1 text-sm font-medium">
                History ({historyItems.length})
              </button>
              <Link 
                href="/thank-you/templates" 
                className="border-b-2 border-transparent text-muted hover:text-ink hover:border-brand-300 py-2 px-1 text-sm font-medium"
              >
                Templates
              </Link>
            </nav>
          </div>

          {/* Queue Tab Content */}
          <ThankYouQueue queueItems={queueItems} />
        </div>
      </main>
    </div>
  );
}
