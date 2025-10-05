import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const guestId: string | undefined = body.guestId;
  const amountCents: number | undefined = body.amountCents;
  if (!guestId || !Number.isFinite(amountCents) || amountCents! < 100) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

  const guest = await prisma.guest.findUnique({ where: { id: guestId } });
  if (!guest) return NextResponse.json({ error: 'Guest not found' }, { status: 404 });

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amountCents!),
    currency: 'cad',
    metadata: { guestId },
    automatic_payment_methods: { enabled: true },
  });

  return NextResponse.json({ clientSecret: intent.client_secret });
}

