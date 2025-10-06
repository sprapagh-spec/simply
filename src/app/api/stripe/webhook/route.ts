import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { calculateFees } from '@/lib/fees';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (request.headers.get('stripe-signature') || '').toString();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secret || !secretKey) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    const guestId = pi.metadata?.guestId;
    const amount = pi.amount_received ?? pi.amount;
    if (guestId && amount) {
      const fees = calculateFees(amount);
      await prisma.gift.upsert({
        where: { stripePaymentIntentId: pi.id },
        update: {
          status: 'succeeded',
          amountGrossCents: fees.grossCents,
          platformFeeCents: fees.platformFeeCents,
          processingFeeCents: fees.processingFeeCents,
          amountNetCents: fees.netCents,
        },
        create: {
          guestId,
          stripePaymentIntentId: pi.id,
          amountGrossCents: fees.grossCents,
          platformFeeCents: fees.platformFeeCents,
          processingFeeCents: fees.processingFeeCents,
          amountNetCents: fees.netCents,
          status: 'cleared',
          memo: 'Stripe payment',
        },
      });
    }
  } else if (event.type === 'payment_intent.canceled') {
    const pi = event.data.object as Stripe.PaymentIntent;
    await prisma.gift.updateMany({ where: { stripePaymentIntentId: pi.id }, data: { status: 'refunded' } });
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } } as any;

