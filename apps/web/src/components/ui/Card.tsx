import { cn } from '@/lib/utils';
import { type ElementType, type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  selected?: boolean;
  tabIndex?: number;
  role?: string;
  'aria-pressed'?: boolean;
  'aria-checked'?: boolean;
  'aria-label'?: string;
}

export function Card({ children, className, as: Tag = 'div', selected, onClick, ...rest }: CardProps) {
  return (
    <Tag
      className={cn(
        'bg-white rounded-3xl border border-transparent p-6 transition-colors duration-200',
        selected && 'border-brand-500 ring-2 ring-brand-500 bg-peach',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Tag>
  );
}
