"use client";

import { useState } from 'react';
import { formatCurrency } from '@/lib/currency';

interface EditableGiftAmountProps {
  guestId: string;
  giftId?: string;
  amountCents: number;
  currency: string;
  onUpdate: (amountCents: number) => Promise<void>;
}

export function EditableGiftAmount({ 
  guestId, 
  giftId, 
  amountCents, 
  currency, 
  onUpdate 
}: EditableGiftAmountProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState((amountCents / 100).toFixed(2));
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const newAmountCents = Math.round(parseFloat(editValue) * 100);
    if (newAmountCents === amountCents) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(newAmountCents);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update gift amount:', error);
      // Reset to original value on error
      setEditValue((amountCents / 100).toFixed(2));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditValue((amountCents / 100).toFixed(2));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted">$</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="w-20 px-2 py-1 text-sm border border-brand-200 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
          autoFocus
          disabled={isUpdating}
        />
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="text-xs text-success hover:text-success/80 disabled:opacity-50"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="text-xs text-danger hover:text-danger/80 disabled:opacity-50"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="font-medium text-ink text-[15px] hover:text-primary transition-colors cursor-pointer"
      disabled={isUpdating}
    >
      {formatCurrency(amountCents, currency)}
    </button>
  );
}
