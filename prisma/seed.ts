import { PrismaClient } from '@prisma/client';
import { calculateFees } from '@/lib/fees';

const prisma = new PrismaClient();

async function main() {
  await prisma.gift.deleteMany();
  await prisma.emailEvent.deleteMany();
  await prisma.email.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.guestTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.household.deleteMany();

  const smith = await prisma.household.create({ data: { name: 'The Smiths', emailDomain: 'smith.com' } });
  const doe = await prisma.household.create({ data: { name: 'Doe Household', emailDomain: 'doe.org' } });

  const guests = await prisma.$transaction([
    prisma.guest.create({ data: { email: 'alice@smith.com', firstName: 'Alice', lastName: 'Smith', householdId: smith.id } }),
    prisma.guest.create({ data: { email: 'bob@smith.com', firstName: 'Bob', lastName: 'Smith', householdId: smith.id } }),
    prisma.guest.create({ data: { email: 'carol@doe.org', firstName: 'Carol', lastName: 'Doe', householdId: doe.id } }),
    prisma.guest.create({ data: { email: 'dave@doe.org', firstName: 'Dave', lastName: 'Doe', householdId: doe.id } }),
    prisma.guest.create({ data: { email: 'eve@example.com', firstName: 'Eve', lastName: 'Adams' } }),
    prisma.guest.create({ data: { email: 'frank@example.com', firstName: 'Frank', lastName: 'Baker' } }),
    prisma.guest.create({ data: { email: 'grace@example.com', firstName: 'Grace', lastName: 'Carter' } }),
    prisma.guest.create({ data: { email: 'heidi@example.com', firstName: 'Heidi', lastName: 'Foster' } }),
    prisma.guest.create({ data: { email: 'ivan@example.com', firstName: 'Ivan', lastName: 'Grant' } }),
    prisma.guest.create({ data: { email: 'judy@example.com', firstName: 'Judy', lastName: 'Hill' } }),
    prisma.guest.create({ data: { email: 'kate@example.com', firstName: 'Kate', lastName: 'Irwin' } }),
    prisma.guest.create({ data: { email: 'leo@example.com', firstName: 'Leo', lastName: 'Jones' } }),
  ]);

  const amounts = [2500, 5000, 10000, 2000, 7500, 3000];
  for (let i = 0; i < 6; i++) {
    const g = guests[i];
    const amt = amounts[i % amounts.length];
    const fees = calculateFees(amt);
    await prisma.gift.create({
      data: {
        guestId: (g as any).id,
        method: 'card',
        amountGrossCents: fees.grossCents,
        platformFeeCents: fees.platformFeeCents,
        processingFeeCents: fees.processingFeeCents,
        amountNetCents: fees.netCents,
        status: 'cleared',
        memo: 'Sample gift',
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

