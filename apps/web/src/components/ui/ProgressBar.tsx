import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function ProgressBar({ value, label, size = 'md', className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between mb-1 text-xs text-gray-600">
          <span>{label}</span>
          <span aria-hidden>{clamped}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `${clamped}%`}
        className={cn('w-full bg-gray-200 rounded-full overflow-hidden', height)}
      >
        <div
          className="h-full bg-brand-600 rounded-full transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
