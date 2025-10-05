import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { pushEmail } from '@/lib/dev-inbox';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        const subject = 'Your magic link to SimplyGift';
        const html = `<p>Click to sign in: <a href="${url}">${url}</a></p>`;
        pushEmail({ to: identifier, subject, html });
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: { strategy: 'jwt' },
});

export { handler as GET, handler as POST };

