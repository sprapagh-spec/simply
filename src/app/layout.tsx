import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'SimplyGift - Guest Invite Management',
  description: 'Beautiful guest invitation and gift management system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.variable} font-sans min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased`}>
        {children}
      </body>
    </html>
  );
}

