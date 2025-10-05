export type DevEmail = {
  to: string;
  subject: string;
  html: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __DEV_INBOX__: DevEmail[] | undefined;
}

const inbox = (global.__DEV_INBOX__ = global.__DEV_INBOX__ ?? []);

export function pushEmail(msg: DevEmail) {
  inbox.unshift(msg);
  if (inbox.length > 200) inbox.pop();
}

export function listEmails(): DevEmail[] {
  return inbox;
}

