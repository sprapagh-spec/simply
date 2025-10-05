import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const emailId = searchParams.get('e');
  if (emailId) {
    const email = await prisma.email.findUnique({ where: { id: emailId } });
    if (email) {
      await prisma.emailEvent.create({ data: { emailId, type: 'unsubscribe' } });
      await prisma.guest.update({ where: { id: email.guestId }, data: { status: 'unsubscribed' } });
      await prisma.email.update({ where: { id: emailId }, data: { status: 'unsubscribed' } });
    }
  }
  return NextResponse.redirect('http://localhost:3000');
}

