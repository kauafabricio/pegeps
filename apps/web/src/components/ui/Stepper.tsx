import { cn } from '@/lib/utils';

interface StepperProps {
  steps: string[];
  current: number; // 0-based
  className?: string;
  ariaLabel?: string;
}

export function Stepper({
  steps,
  current,
  className,
  ariaLabel = 'Etapas do processo',
}: StepperProps) {
  return (
    <nav aria-label={ariaLabel} className={cn('w-full', className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, i) => {
          const isCompleted = i < current;
          const isActive = i === current;
          return (
            <li key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold border-2 transition-all flex-shrink-0',
                    isCompleted
                      ? 'bg-transparent border-brand-green text-brand-green'
                      : isActive
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400',
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <span aria-hidden>✓</span>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-semibold whitespace-nowrap hidden sm:block',
                    isActive
                      ? 'text-brand-500 font-bold'
                      : isCompleted
                        ? 'text-brand-text'
                        : 'text-gray-400',
                  )}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className={cn(
                    'flex-1 h-px mx-3 min-w-[16px]',
                    i < current ? 'bg-brand-green' : 'bg-gray-300',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
