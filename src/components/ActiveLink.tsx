'use client';

import { Link, usePathname } from '@/libs/I18nNavigation';
import { cn } from '@/utils/Helpers';

export const ActiveLink = (props: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();

  // حذف اللغة من المسار للمقارنة (مثلاً /ar/dashboard → /dashboard)
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  const isActive = pathWithoutLocale === props.href;

  return (
    <Link
      href={props.href}
      className={cn(
        'px-3 py-2 rounded-md transition-colors',
        isActive && 'bg-primary text-primary-foreground',
        !isActive && 'hover:bg-muted/50'
      )}
    >
      {props.children}
    </Link>
  );
};