"use client";

interface ThankYouNote {
  id: string;
  subject: string;
  status: string;
  sentAt: Date | null;
  createdAt: Date;
  guest: {
    firstName: string;
    lastName: string;
    email: string | null;
  };
  template: {
    name: string;
  };
}

interface ThankYouHistoryProps {
  historyItems: ThankYouNote[];
}

export function ThankYouHistory({ historyItems }: ThankYouHistoryProps) {
  if (historyItems.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="font-semibold text-xl text-ink mb-2">No thank-you notes yet</h3>
        <p className="text-muted mb-6">Your sent thank-you notes will appear here</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-brand-50 border-b border-brand-100 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Recipient</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Subject</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Template</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-ink">Sent Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {historyItems.map((note) => (
              <tr key={note.id} className="hover:bg-brand-50 transition-all odd:bg-brand-50/30">
                <td className="px-6 py-4">
                  <div className="font-medium text-ink text-[15px]">
                    {note.guest.firstName} {note.guest.lastName}
                  </div>
                  <div className="text-sm text-muted">{note.guest.email}</div>
                </td>
                <td className="px-6 py-4 text-muted text-[15px]">
                  {note.subject}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-ink">
                    {note.template.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    note.status === 'sent' ? 'bg-success/10 text-success' :
                    note.status === 'failed' ? 'bg-danger/10 text-danger' :
                    note.status === 'draft' ? 'bg-warning/10 text-warning' :
                    'bg-muted/10 text-muted'
                  }`}>
                    {note.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted text-[15px]">
                  {note.sentAt ? note.sentAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
