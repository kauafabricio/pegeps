import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 focus-visible:outline-brand-700 disabled:bg-brand-200 disabled:text-brand-700 disabled:cursor-not-allowed',
  secondary:
    'bg-white text-brand-700 border-2 border-brand-500 hover:bg-peach disabled:opacity-50 disabled:cursor-not-allowed',
  ghost: 'text-brand-700 hover:bg-peach disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-200',
  outline:
    'bg-white text-brand-700 border-2 border-brand-300 hover:bg-peach disabled:opacity-50',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm min-h-[40px]',
  md: 'px-6 py-3 text-sm min-h-[44px]',
  lg: 'px-8 py-3.5 text-base min-h-[48px]',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', isLoading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
        'focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
});
