"use client";

import { useState } from 'react';
import { formatCurrency } from '@/lib/currency';
import Link from 'next/link';

interface QueueItem {
  guestId: string;
  guestName: string;
  guestEmail: string | null;
  giftId: string;
  giftAmount: number;
  giftCurrency: string;
  giftDate: Date;
  giftMethod: string;
  giftMemo: string | null;
}

interface ThankYouQueueProps {
  queueItems: QueueItem[];
}

export function ThankYouQueue({ queueItems }: ThankYouQueueProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleSelection = (guestId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(guestId)) {
      newSelection.delete(guestId);
    } else {
      newSelection.add(guestId);
    }
    setSelectedItems(newSelection);
  };

  const selectAll = () => {
    if (selectedItems.size === queueItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(queueItems.map(item => item.guestId)));
    }
  };

  const handleCreateNotes = () => {
    const selectedGuests = queueItems.filter(item => selectedItems.has(item.guestId));
    const guestIds = selectedGuests.map(item => item.guestId);
    const queryParams = new URLSearchParams({ guests: guestIds.join(',') });
    window.location.href = `/thank-you/compose?${queryParams.toString()}`;
  };

  if (queueItems.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">💌</div>
        <h3 className="font-semibold text-xl text-ink mb-2">All caught up!</h3>
        <p className="text-muted mb-6">No unthanked gifts in your queue</p>
        <Link href="/gifts" className="btn-primary">View All Gifts</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={selectAll}
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            {selectedItems.size === queueItems.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-muted">
            {selectedItems.size} of {queueItems.length} selected
          </span>
        </div>
        <div className="flex gap-3">
          {selectedItems.size > 0 && (
            <button
              onClick={handleCreateNotes}
              className="btn-primary"
            >
              Create Notes ({selectedItems.size})
            </button>
          )}
        </div>
      </div>

      {/* Queue Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-brand-50 border-b border-brand-100 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === queueItems.length && queueItems.length > 0}
                    onChange={selectAll}
                    className="rounded border-brand-200 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Gift Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Gifted Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {queueItems.map((item) => (
                <tr key={item.guestId} className="hover:bg-brand-50 transition-all odd:bg-brand-50/30">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.guestId)}
                      onChange={() => toggleSelection(item.guestId)}
                      className="rounded border-brand-200 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-ink text-[15px]">
                      {item.guestName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted text-[15px]">
                    {item.guestEmail ?? '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-ink text-[15px]">
                      {formatCurrency(item.giftAmount, item.giftCurrency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted text-[15px]">
                    {item.giftDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {item.giftMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/thank-you/compose?guests=${item.guestId}`}
                        className="text-xs text-primary hover:text-primary-hover transition-colors"
                      >
                        Send Thank-You
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
