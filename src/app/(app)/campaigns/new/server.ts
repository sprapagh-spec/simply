"use server";
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { pushEmail } from '@/lib/dev-inbox';

const createSchema = z.object({ name: z.string().min(1), subject: z.string().min(1), template: z.string().min(1) });
export async function createCampaign(input: z.infer<typeof createSchema>) {
  const data = createSchema.parse(input);
  const c = await prisma.campaign.create({ data });
  return c;
}

export async function sendPreview(campaignId: string) {
  const c = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!c) throw new Error('Campaign not found');
  const sample = await prisma.guest.findMany({ take: 5, where: { email: { not: null } } });
  for (const g of sample) {
    const magic = `http://localhost:3000/portal/${g.id}`;
    const html = c.template
      .replaceAll('{{first_name}}', g.firstName)
      .replaceAll('{{household_name}}', '')
      .replaceAll('{{magic_link}}', magic);
    pushEmail({ to: g.email!, subject: c.subject, html });
  }
  return { sent: sample.length };
}

