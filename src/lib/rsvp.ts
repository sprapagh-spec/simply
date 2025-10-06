export enum RsvpStatus {
  NOT_INVITED = 'NOT_INVITED',
  INVITED = 'INVITED',
  OPENED = 'OPENED',
  ATTENDING = 'ATTENDING',
  NOT_ATTENDING = 'NOT_ATTENDING',
  MAYBE = 'MAYBE',
  UNDELIVERABLE = 'UNDELIVERABLE',
}

export const RSVP_STATUS_LABELS = {
  [RsvpStatus.NOT_INVITED]: 'Not Invited',
  [RsvpStatus.INVITED]: 'Invited',
  [RsvpStatus.OPENED]: 'Opened',
  [RsvpStatus.ATTENDING]: 'Attending',
  [RsvpStatus.NOT_ATTENDING]: 'Not Attending',
  [RsvpStatus.MAYBE]: 'Maybe',
  [RsvpStatus.UNDELIVERABLE]: 'Undeliverable',
} as const;

export const RSVP_STATUS_COLORS = {
  [RsvpStatus.ATTENDING]: 'bg-success/10 text-success',
  [RsvpStatus.MAYBE]: 'bg-warning/10 text-warning',
  [RsvpStatus.INVITED]: 'bg-primary/10 text-primary',
  [RsvpStatus.OPENED]: 'bg-blue-100 text-blue-800',
  [RsvpStatus.NOT_ATTENDING]: 'bg-rose-100 text-rose-800',
  [RsvpStatus.NOT_INVITED]: 'bg-slate-100 text-slate-800',
  [RsvpStatus.UNDELIVERABLE]: 'bg-gray-100 text-gray-800',
} as const;
