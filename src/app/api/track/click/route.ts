import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const emailId = searchParams.get('e');
  const url = searchParams.get('u');
  if (emailId) {
    await prisma.emailEvent.create({ data: { emailId, type: 'click' } });
    await prisma.email.update({ where: { id: emailId }, data: { status: 'clicked' } }).catch(() => {});
  }
  if (!url) return NextResponse.redirect('http://localhost:3000');
  return NextResponse.redirect(url);
}

