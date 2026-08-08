'use client';

import { Link, usePathname } from '@/libs/I18nNavigation';
import { cn } from '@/utils/Helpers';

export const ActiveLink = (props: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();

  // إزالة اللغة من المسار (تدعم لغات مكونة من حرفين مثل ar, en)
  // مثال: /ar/dashboard → /dashboard
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, '/');
  
  // تحديد ما إذا كان الرابط نشطاً (مطابقة تامة للمسار)
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