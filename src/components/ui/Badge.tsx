import React from 'react';
import { cn } from '../../utils/cn';
import { SegmentType } from '../../types/customer';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | SegmentType;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const styles: Record<string, string> = {
    default: 'bg-slate-100 text-slate-600 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',

    // Customer Segments — semantic colors on white/light bg
    'High Value': 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200',
    'Loyal': 'bg-brand-50 text-brand-700 border-brand-200 ring-1 ring-brand-200',
    'Regular': 'bg-slate-100 text-slate-600 border-slate-200',
    'New / Potential': 'bg-sky-50 text-sky-700 border-sky-200',
    'At Risk': 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border shadow-none transition-colors',
        styles[variant] || styles.default,
        sizes[size],
        className
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0" />
      {children || variant}
    </span>
  );
};
