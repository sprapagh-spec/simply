"use client";

import { useState } from 'react';
import { renderThankYouHtml, getDefaultThankYouVariables } from '@/lib/email/renderThankYou';
import { formatCurrency } from '@/lib/currency';

interface Template {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  html: string;
}

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

interface PerRecipientEditorProps {
  template: Template;
  recipients: QueueItem[];
}

interface RecipientNote {
  guestId: string;
  subject: string;
  body: string;
  status: 'draft' | 'ready';
}

export function PerRecipientEditor({ template, recipients }: PerRecipientEditorProps) {
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(recipients[0]?.guestId || '');
  const [recipientNotes, setRecipientNotes] = useState<Map<string, RecipientNote>>(() => {
    const initialNotes = new Map();
    recipients.forEach(recipient => {
      const defaultSubject = `Thank you, ${recipient.guestName.split(' ')[0]}!`;
      const defaultBody = `${recipient.guestName.split(' ')[0]}, thank you so much for the ${formatCurrency(recipient.giftAmount, recipient.giftCurrency)} gift! Your generosity means the world to us.${recipient.giftMemo ? ` Your note, "${recipient.giftMemo}", brought us so much joy.` : ''} — Sarah & Michael`;
      
      initialNotes.set(recipient.guestId, {
        guestId: recipient.guestId,
        subject: defaultSubject,
        body: defaultBody,
        status: 'draft' as const,
      });
    });
    return initialNotes;
  });

  const selectedRecipient = recipients.find(r => r.guestId === selectedRecipientId);
  const selectedNote = recipientNotes.get(selectedRecipientId);

  const updateRecipientNote = (guestId: string, updates: Partial<RecipientNote>) => {
    setRecipientNotes(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(guestId) || { guestId, subject: '', body: '', status: 'draft' as const };
      newMap.set(guestId, { ...existing, ...updates });
      return newMap;
    });
  };

  const applyToAll = () => {
    if (!selectedNote) return;
    
    recipients.forEach(recipient => {
      if (recipient.guestId !== selectedRecipientId) {
        const personalizedSubject = selectedNote.subject.replace(
          selectedRecipient?.guestName.split(' ')[0] || '',
          recipient.guestName.split(' ')[0]
        );
        const personalizedBody = selectedNote.body.replace(
          selectedRecipient?.guestName.split(' ')[0] || '',
          recipient.guestName.split(' ')[0]
        );
        
        updateRecipientNote(recipient.guestId, {
          subject: personalizedSubject,
          body: personalizedBody,
          status: 'ready',
        });
      }
    });
  };

  const getPreviewHtml = (recipient: QueueItem, note: RecipientNote) => {
    const variables = getDefaultThankYouVariables(
      recipient.guestName,
      formatCurrency(recipient.giftAmount, recipient.giftCurrency),
      recipient.giftMemo || undefined
    );
    
    return renderThankYouHtml(template.html, variables);
  };

  const handleSendAll = async () => {
    const readyNotes = Array.from(recipientNotes.values()).filter(note => note.status === 'ready');
    alert(`Sending ${readyNotes.length} personalized thank-you notes!`);
  };

  if (!selectedRecipient || !selectedNote) {
    return <div>No recipients selected</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Recipients List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-ink">Recipients</h3>
        <div className="space-y-2">
          {recipients.map((recipient) => {
            const note = recipientNotes.get(recipient.guestId);
            return (
              <button
                key={recipient.guestId}
                onClick={() => setSelectedRecipientId(recipient.guestId)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedRecipientId === recipient.guestId
                    ? 'border-primary bg-primary/5'
                    : 'border-brand-200 hover:border-brand-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-ink">{recipient.guestName}</div>
                    <div className="text-sm text-muted">{formatCurrency(recipient.giftAmount, recipient.giftCurrency)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      note?.status === 'ready' ? 'bg-success' : 'bg-warning'
                    }`} />
                    <span className="text-xs text-muted">{note?.status}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="pt-4 border-t border-brand-200">
          <button
            onClick={applyToAll}
            className="w-full btn-secondary"
          >
            Apply Current Text to All
          </button>
        </div>
      </div>

      {/* Right: Editor */}
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg text-ink mb-2">
            Editing: {selectedRecipient.guestName}
          </h3>
          <p className="text-sm text-muted">
            {formatCurrency(selectedRecipient.giftAmount, selectedRecipient.giftCurrency)} • {selectedRecipient.giftMethod}
          </p>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-ink mb-2">
            Subject Line
          </label>
          <input
            id="subject"
            type="text"
            value={selectedNote.subject}
            onChange={(e) => updateRecipientNote(selectedRecipientId, { subject: e.target.value })}
            className="w-full rounded-2xl border border-brand-200 bg-surface p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-ink mb-2">
            Message Body
          </label>
          <textarea
            id="body"
            value={selectedNote.body}
            onChange={(e) => updateRecipientNote(selectedRecipientId, { body: e.target.value })}
            rows={6}
            className="w-full rounded-2xl border border-brand-200 bg-surface p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Preview */}
        <div>
          <h4 className="font-medium text-ink mb-2">Preview</h4>
          <div className="border border-brand-200 rounded-lg overflow-hidden">
            <div 
              className="max-h-64 overflow-auto"
              dangerouslySetInnerHTML={{ 
                __html: getPreviewHtml(selectedRecipient, selectedNote) 
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => updateRecipientNote(selectedRecipientId, { status: 'ready' })}
            className="btn-primary"
          >
            Mark as Ready
          </button>
          <button
            onClick={handleSendAll}
            className="btn-secondary"
          >
            Send All Ready ({Array.from(recipientNotes.values()).filter(n => n.status === 'ready').length})
          </button>
        </div>
      </div>
    </div>
  );
}
