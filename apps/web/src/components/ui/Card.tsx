import { cn } from '@/lib/utils';
import { type ElementType, type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag className={cn('bg-white rounded-2xl shadow-sm border border-gray-100 p-6', className)}>
      {children}
    </Tag>
  );
}
