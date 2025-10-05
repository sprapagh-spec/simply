import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pushEmail } from '@/lib/dev-inbox';

export async function POST(request: Request) {
  const { campaignId } = await request.json();
  const c = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!c) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const guests = await prisma.guest.findMany({ where: { email: { not: null } } });
  const emails: { to: string; subject: string; html: string }[] = [];
  for (const g of guests) {
    const token = crypto.randomUUID();
    const email = await prisma.email.create({
      data: {
        campaignId: c.id,
        guestId: g.id,
        toAddress: g.email!,
        subject: c.subject,
        bodyHtml: c.template,
        magicToken: token,
        status: 'sent',
        sentAt: new Date(),
      },
    });
    const pixel = `http://localhost:3000/api/track/open?e=${email.id}`;
    const click = `http://localhost:3000/api/track/click?e=${email.id}&u=${encodeURIComponent('http://localhost:3000/portal/' + g.id)}`;
    const unsub = `http://localhost:3000/api/track/unsubscribe?e=${email.id}`;
    const html = c.template
      .replaceAll('{{first_name}}', g.firstName)
      .replaceAll('{{household_name}}', '')
      .replaceAll('{{magic_link}}', click) + `\n<img src="${pixel}" width="1" height="1" />\n<p style="font-size:12px;color:#666">123 Example St, Toronto, ON • <a href="${unsub}">Unsubscribe</a></p>`;
    emails.push({ to: g.email!, subject: c.subject, html });
  }
  for (const m of emails) pushEmail(m);
  return NextResponse.json({ sent: emails.length });
}

