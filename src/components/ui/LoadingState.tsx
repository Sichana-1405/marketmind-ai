import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading intelligence data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-brand-500/10 blur-sm" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 animate-pulse">{message}</p>
    </div>
  );
};
