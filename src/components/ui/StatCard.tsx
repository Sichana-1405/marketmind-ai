import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon,
  description,
  className,
}) => {
  return (
    <Card className={cn('relative overflow-hidden group', className)} hoverEffect>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-brand-600 group-hover:border-brand-200 group-hover:bg-brand-100 transition-colors">
          {icon}
        </div>
      </div>

      {(change || description) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <span
              className={cn(
                'font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full',
                changeType === 'positive' && 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                changeType === 'negative' && 'bg-rose-50 text-rose-700 border border-rose-200',
                changeType === 'neutral' && 'bg-slate-100 text-slate-500 border border-slate-200'
              )}
            >
              {change}
            </span>
          )}
          {description && <span className="text-slate-400 font-normal">{description}</span>}
        </div>
      )}
    </Card>
  );
};
