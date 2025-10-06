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

interface ComposerSharedProps {
  template: Template;
  subject: string;
  setSubject: (subject: string) => void;
  body: string;
  setBody: (body: string) => void;
  recipients: QueueItem[];
}

export function ComposerShared({ template, subject, setSubject, body, setBody, recipients }: ComposerSharedProps) {
  const [previewRecipient, setPreviewRecipient] = useState<QueueItem | null>(recipients[0] || null);

  const mergeTags = [
    { tag: '{{first_name}}', description: 'First name' },
    { tag: '{{full_name}}', description: 'Full name' },
    { tag: '{{gift_amount}}', description: 'Gift amount' },
    { tag: '{{gift_note}}', description: 'Gift note/memo' },
    { tag: '{{wedding_name}}', description: 'Wedding name' },
    { tag: '{{couple_name}}', description: 'Couple names' },
  ];

  const insertMergeTag = (tag: string) => {
    const textarea = document.getElementById('body-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = body.substring(0, start) + tag + body.substring(end);
      setBody(newText);
      
      // Set cursor position after the inserted tag
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 0);
    }
  };

  const getPreviewHtml = () => {
    if (!previewRecipient) return '';
    
    const variables = getDefaultThankYouVariables(
      previewRecipient.guestName,
      formatCurrency(previewRecipient.giftAmount, previewRecipient.giftCurrency),
      previewRecipient.giftMemo || undefined
    );
    
    return renderThankYouHtml(template.html, variables);
  };

  const handleSend = async () => {
    // TODO: Implement actual sending
    alert(`Sending thank-you notes to ${recipients.length} recipients!`);
  };

  return (
    <div className="space-y-6">
      {/* Subject */}
      <div className="card p-6">
        <label htmlFor="subject" className="block text-sm font-medium text-ink mb-2">
          Subject Line
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-2xl border border-brand-200 bg-surface p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Thank you, {{first_name}}!"
        />
      </div>

      {/* Body */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="body-textarea" className="block text-sm font-medium text-ink">
            Message Body
          </label>
          <div className="text-sm text-muted">
            {mergeTags.length} merge tags available
          </div>
        </div>
        
        <textarea
          id="body-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="w-full rounded-2xl border border-brand-200 bg-surface p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Write your thank-you message here..."
        />
        
        {/* Merge Tags */}
        <div className="mt-4">
          <div className="text-sm font-medium text-ink mb-2">Merge Tags</div>
          <div className="flex flex-wrap gap-2">
            {mergeTags.map(({ tag, description }) => (
              <button
                key={tag}
                onClick={() => insertMergeTag(tag)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-ink hover:bg-brand-200 transition-colors"
                title={description}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-ink">Preview</h3>
          <select
            value={previewRecipient?.guestId || ''}
            onChange={(e) => {
              const recipient = recipients.find(r => r.guestId === e.target.value);
              setPreviewRecipient(recipient || null);
            }}
            className="rounded-lg border border-brand-200 bg-surface p-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {recipients.map((recipient) => (
              <option key={recipient.guestId} value={recipient.guestId}>
                {recipient.guestName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="border border-brand-200 rounded-lg overflow-hidden">
          <div 
            className="max-h-96 overflow-auto"
            dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSend}
          className="btn-primary"
        >
          Send to {recipients.length} Recipient{recipients.length > 1 ? 's' : ''}
        </button>
        <button className="btn-secondary">
          Save as Draft
        </button>
        <button className="btn-ghost">
          Send Test Email
        </button>
      </div>
    </div>
  );
}
