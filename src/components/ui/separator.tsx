import { cn } from '@/utils/Helpers';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * مكون فاصل بسيط ونظيف (بدون حزم خارجية)
 * يعمل بشكل مثالي في العربية والإنجليزية
 */
export function Separator({ orientation = 'horizontal', className }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' && 'h-px w-full',
        orientation === 'vertical' && 'h-full w-px',
        className
      )}
    />
  );
}