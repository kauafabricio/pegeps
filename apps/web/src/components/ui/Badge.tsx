import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'info' | 'warning' | 'orange';

const styles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-emerald-50 text-brand-green border border-emerald-200',
  info: 'bg-peach text-brand-700 border border-brand-200',
  warning: 'bg-amber-50 text-brand-700 border border-amber-200',
  orange: 'bg-peach text-brand-700 border border-brand-200',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
