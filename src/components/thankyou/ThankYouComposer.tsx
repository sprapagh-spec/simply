"use client";

import { useState } from 'react';
import { TemplateCarousel } from './TemplateCarousel';
import { ComposerShared } from './ComposerShared';
import { PerRecipientEditor } from './PerRecipientEditor';
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

interface ThankYouComposerProps {
  templates: Template[];
  selectedGuests: QueueItem[];
  allQueueItems: QueueItem[];
}

type ComposerMode = 'same' | 'customize';

export function ThankYouComposer({ templates, selectedGuests, allQueueItems }: ThankYouComposerProps) {
  const [step, setStep] = useState<'template' | 'compose'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [mode, setMode] = useState<ComposerMode>('same');
  const [subject, setSubject] = useState('Thank you, {{first_name}}!');
  const [body, setBody] = useState('{{first_name}}, thank you so much for the {{gift_amount}} gift! Your generosity means the world to us. — {{couple_name}}');

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setStep('compose');
  };

  const handleBackToTemplates = () => {
    setStep('template');
    setSelectedTemplate(null);
  };

  if (step === 'template') {
    return (
      <TemplateCarousel
        templates={templates}
        onSelectTemplate={handleTemplateSelect}
      />
    );
  }

  if (!selectedTemplate) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            1
          </div>
          <span className="text-sm font-medium text-ink">Template</span>
        </div>
        <div className="w-8 h-px bg-brand-200"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            2
          </div>
          <span className="text-sm font-medium text-ink">Compose</span>
        </div>
      </div>

      {/* Selected Template Info */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-ink">Selected Template</h3>
            <p className="text-muted">{selectedTemplate.name}</p>
          </div>
          <button
            onClick={handleBackToTemplates}
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            Change Template
          </button>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg text-ink mb-4">Compose Mode</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode('same')}
            className={`p-4 rounded-2xl border-2 transition-all text-left ${
              mode === 'same'
                ? 'border-primary bg-primary/5'
                : 'border-brand-200 hover:border-brand-300'
            }`}
          >
            <div className="font-medium text-ink mb-1">Same message to everyone</div>
            <div className="text-sm text-muted">Send the same thank-you note to all selected recipients</div>
          </button>
          <button
            onClick={() => setMode('customize')}
            className={`p-4 rounded-2xl border-2 transition-all text-left ${
              mode === 'customize'
                ? 'border-primary bg-primary/5'
                : 'border-brand-200 hover:border-brand-300'
            }`}
          >
            <div className="font-medium text-ink mb-1">Customize per person</div>
            <div className="text-sm text-muted">Personalize each thank-you note individually</div>
          </button>
        </div>
      </div>

      {/* Recipients Summary */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg text-ink mb-4">Recipients ({selectedGuests.length})</h3>
        <div className="space-y-2">
          {selectedGuests.map((guest) => (
            <div key={guest.guestId} className="flex items-center justify-between py-2 px-3 bg-brand-50 rounded-lg">
              <div>
                <div className="font-medium text-ink">{guest.guestName}</div>
                <div className="text-sm text-muted">{guest.guestEmail}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-ink">{formatCurrency(guest.giftAmount, guest.giftCurrency)}</div>
                <div className="text-sm text-muted">{guest.giftMethod}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composer Content */}
      {mode === 'same' ? (
        <ComposerShared
          template={selectedTemplate}
          subject={subject}
          setSubject={setSubject}
          body={body}
          setBody={setBody}
          recipients={selectedGuests}
        />
      ) : (
        <PerRecipientEditor
          template={selectedTemplate}
          recipients={selectedGuests}
        />
      )}
    </div>
  );
}
