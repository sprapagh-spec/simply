"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const items = [
  { href: '/', label: 'Guests' },
  { href: '/gifts', label: 'Gifts' },
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
              'rounded px-3 py-2 text-sm hover:bg-gray-100',
              pathname === i.href && 'bg-blue-100 text-blue-900'
            )}
          >
            {i.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

