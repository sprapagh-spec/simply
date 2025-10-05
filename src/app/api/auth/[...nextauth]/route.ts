import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { pushEmail } from '@/lib/dev-inbox';

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        const subject = 'Your magic link to SimplyGift';
        const html = `<p>Click to sign in: <a href="${url}">${url}</a></p>`;
        pushEmail({ to: identifier, subject, html });
      },
      from: process.env.EMAIL_FROM || 'noreply@example.com',
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/signin',
  },
});

export { handler as GET, handler as POST };

