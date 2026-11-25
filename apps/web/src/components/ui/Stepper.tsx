import { cn } from '@/lib/utils';

interface Step {
  label: string;
  done: boolean;
  active: boolean;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <nav aria-label="Progresso" className={cn('flex items-center gap-2', className)}>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              aria-current={step.active ? 'step' : undefined}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                step.done
                  ? 'bg-brand-600 text-white'
                  : step.active
                    ? 'border-2 border-brand-600 text-brand-600 bg-white'
                    : 'bg-gray-200 text-gray-500',
              )}
            >
              {step.done ? '✓' : i + 1}
            </div>
            <span className="text-xs mt-1 text-gray-600 max-w-[6rem] text-center">{step.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('h-0.5 w-8 mt-[-1.5rem]', step.done ? 'bg-brand-600' : 'bg-gray-200')} />
          )}
        </div>
      ))}
    </nav>
  );
}
