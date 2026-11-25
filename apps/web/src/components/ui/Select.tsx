'use client';

import { cn } from '@/lib/utils';
import { useId } from 'react';
import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, className, id: propId, ...rest },
  ref,
) {
  const autoId = useId();
  const id = propId ?? autoId;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-brand-accent">
        {label}
        {rest.required && <span className="ml-1 text-brand-500" aria-hidden>*</span>}
      </label>
      <select
        ref={ref}
        id={id}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full appearance-none rounded-2xl border-2 bg-white px-4 py-3 text-sm text-brand-text',
          'transition-colors duration-200',
          'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
          error ? 'border-red-400' : 'border-gray-200 hover:border-gray-300',
          className,
        )}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600 flex items-center gap-1">
          <span aria-hidden>⚠</span> {error}
        </p>
      )}
    </div>
  );
});
