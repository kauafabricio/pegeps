import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, success, className, id: propId, ...rest },
  ref,
) {
  const autoId = useId();
  const id = propId ?? autoId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-brand-accent">
        {label}
        {rest.required && <span className="ml-1 text-brand-500" aria-hidden>*</span>}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          className={cn(
            'w-full rounded-2xl border-2 bg-white px-4 py-3 text-sm text-brand-text placeholder:text-gray-400',
            'transition-colors duration-200',
            'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : success
                ? 'border-brand-green'
                : 'border-gray-200 hover:border-gray-300',
            className,
          )}
          {...rest}
        />
        {success && !error && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-green"
            aria-hidden
          >
            ✓
          </span>
        )}
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
    </div>
  );
});
