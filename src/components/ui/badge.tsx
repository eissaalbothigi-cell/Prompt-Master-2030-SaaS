import type { VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps as CvaVariantProps } from 'class-variance-authority';
import { cn } from '@/utils/Helpers';

// تعريف الـ badgeVariants داخل الملف نفسه (بدلاً من استيراده)
const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        success:
          'border-transparent bg-green-600 text-white shadow hover:bg-green-600/80',
        warning:
          'border-transparent bg-yellow-500 text-black shadow hover:bg-yellow-500/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type BadgeVariantProps = CvaVariantProps<typeof badgeVariants>;

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  BadgeVariantProps & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };