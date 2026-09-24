'use client';

import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/prompts', label: 'Prompts' },
  { href: '/dashboard/generator', label: 'Generator' },
  { href: '/dashboard/user-profile', label: 'Profile' },
];

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-e bg-white p-4 dark:bg-slate-900">
      <nav className="flex flex-col gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}