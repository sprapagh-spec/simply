import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const emailId = searchParams.get('e');
  if (emailId) {
    await prisma.emailEvent.create({ data: { emailId, type: 'open' } });
    await prisma.email.update({ where: { id: emailId }, data: { status: 'opened' } }).catch(() => {});
  }
  // 1px gif
  const gif = Buffer.from(
    'R0lGODlhAQABAIAAAP///////ywAAAAAAQABAAACAUwAOw==',
    'base64'
  );
  return new Response(gif, { headers: { 'content-type': 'image/gif' } });
}

