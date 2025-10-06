"use client";

import { useState } from 'react';
import { RsvpStatus, RSVP_STATUS_LABELS, RSVP_STATUS_COLORS } from '@/lib/rsvp';
import { updateRsvpStatus } from '@/app/(app)/guests/actions';

interface RsvpStatusPillProps {
  guestId: string;
  status: RsvpStatus;
  onUpdate?: () => void;
}

export function RsvpStatusPill({ guestId, status, onUpdate }: RsvpStatusPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: RsvpStatus) => {
    setIsUpdating(true);
    try {
      const result = await updateRsvpStatus(guestId, newStatus);
      if (result.success) {
        onUpdate?.();
      }
    } catch (error) {
      console.error('Failed to update RSVP status:', error);
    } finally {
      setIsUpdating(false);
      setIsOpen(false);
    }
  };

  const label = RSVP_STATUS_LABELS[status];
  const colorClass = RSVP_STATUS_COLORS[status];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80 focus:ring-2 focus:ring-primary focus:ring-offset-1 ${colorClass} ${
          isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {isUpdating ? 'Updating...' : label}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 bg-surface border border-brand-200 rounded-lg shadow-lg z-20 min-w-[140px]">
            {Object.entries(RSVP_STATUS_LABELS).map(([statusValue, label]) => (
              <button
                key={statusValue}
                onClick={() => handleStatusChange(statusValue as RsvpStatus)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-brand-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                  status === statusValue ? 'bg-brand-50' : ''
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
