import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SimplyGift Guests',
  description: 'Manage guests, campaigns, and gifts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

