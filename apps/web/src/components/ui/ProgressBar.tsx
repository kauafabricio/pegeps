import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  segmented?: boolean;
  segments?: number;
  className?: string;
  'aria-label'?: string;
}

export function ProgressBar({
  value,
  label,
  segmented,
  segments = 3,
  className,
  'aria-label': ariaLabel,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const accessibleLabel = ariaLabel ?? label ?? 'Progresso';

  if (segmented) {
    const filled = Math.round((clamped / 100) * segments);
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {label && <p className="text-xs font-medium text-gray-600">{label}</p>}
        <div
          className="flex gap-1.5"
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={accessibleLabel}
        >
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 flex-1 rounded-full transition-all duration-300',
                i < filled ? 'bg-brand-700' : 'bg-gray-200',
              )}
              aria-hidden
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <p className="text-xs font-medium text-gray-600">{label}</p>}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-peach border border-brand-100"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleLabel}
      >
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
