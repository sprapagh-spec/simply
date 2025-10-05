"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const items = [
  { href: '/', label: 'Dashboard' },
  { href: '/guests', label: 'Guests' },
  { href: '/households', label: 'Households' },
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/gifts', label: 'Gifts' },
  { href: '/settings', label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 border-r bg-card">
      <div className="p-4 text-lg font-semibold">SimplyGift</div>
      <nav className="flex flex-col gap-1 p-2">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={clsx(
              'rounded px-3 py-2 text-sm hover:bg-accent',
              pathname === i.href && 'bg-accent'
            )}
          >
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

