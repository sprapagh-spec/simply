import { NextResponse } from 'next/server';
import { listEmails } from '@/lib/dev-inbox';

export async function GET() {
  return NextResponse.json({ emails: listEmails() });
}

