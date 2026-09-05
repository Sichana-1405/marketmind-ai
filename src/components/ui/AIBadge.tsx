/**
 * AIBadge.tsx
 * Displays a subtle indicator for AI-generated or demo content.
 */
import React from 'react';
import { Sparkles, AlertCircle, WifiOff } from 'lucide-react';

type AIBadgeVariant = 'generated' | 'demo' | 'unavailable' | 'loading';

interface AIBadgeProps {
  variant: AIBadgeVariant;
  className?: string;
}

const CONFIG: Record<
  AIBadgeVariant,
  { label: string; icon: React.ReactNode; classes: string }
> = {
  generated: {
    label: '✨ AI Generated',
    icon: <Sparkles className="w-3 h-3" />,
    classes: 'bg-brand-50 text-brand-600 border-brand-200',
  },
  demo: {
    label: 'Demo Mode',
    icon: <AlertCircle className="w-3 h-3" />,
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  unavailable: {
    label: 'AI Unavailable',
    icon: <WifiOff className="w-3 h-3" />,
    classes: 'bg-slate-50 text-slate-600 border-slate-200',
  },
  loading: {
    label: 'Generating…',
    icon: (
      <svg
        className="w-3 h-3 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
    ),
    classes: 'bg-brand-50 text-brand-600 border-brand-200 animate-pulse',
  },
};

export const AIBadge: React.FC<AIBadgeProps> = ({ variant, className = '' }) => {
  const { label, icon, classes } = CONFIG[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded border ${classes} ${className}`}
    >
      {icon}
      {label}
    </span>
  );
};
