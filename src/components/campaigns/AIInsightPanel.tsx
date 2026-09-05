/**
 * AIInsightPanel.tsx
 *
 * Displays an AI-generated executive business insight card on the Insights page.
 *
 * IMPORTANT:
 * All numbers passed in are pre-computed by the deterministic engine.
 * This component calls aiService.generateBusinessInsight() which passes those
 * verified facts to Gemini and returns only natural-language interpretation.
 * Gemini NEVER calculates or overrides any numerical value.
 *
 * If Gemini is unavailable, the panel shows a clearly-labeled fallback state.
 */
import React, { useState, useCallback } from 'react';
import { BrainCircuit, RefreshCw, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AIBadge } from '../ui/AIBadge';
import {
  generateBusinessInsight,
  BusinessInsightResult,
  InsightContext,
  getAIStatus,
} from '../../services/aiService';

interface AIInsightPanelProps {
  context: InsightContext;
}

type PanelState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: BusinessInsightResult }
  | { status: 'error'; message: string }
  | { status: 'unconfigured' };

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ context }) => {
  const [state, setState] = useState<PanelState>(() =>
    getAIStatus() === 'unconfigured'
      ? { status: 'unconfigured' }
      : { status: 'idle' }
  );

  const handleGenerate = useCallback(async () => {
    setState({ status: 'loading' });
    const result = await generateBusinessInsight(context);
    if (result) {
      setState({ status: 'success', result });
    } else {
      const aiStatus = getAIStatus();
      if (aiStatus === 'unconfigured') {
        setState({ status: 'unconfigured' });
      } else {
        setState({
          status: 'error',
          message:
            'AI generation is temporarily unavailable. Your deterministic insights below are still fully accurate.',
        });
      }
    }
  }, [context]);

  return (
    <Card className="bg-white border border-slate-200 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-50 rounded-xl border border-brand-200 text-brand-600 shrink-0">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900">
                ✨ AI Executive Business Analysis
              </h3>
              {state.status === 'success' && <AIBadge variant="generated" />}
              {state.status === 'loading' && <AIBadge variant="loading" />}
              {(state.status === 'unconfigured' || state.status === 'idle') && (
                <AIBadge variant="demo" />
              )}
              {state.status === 'error' && <AIBadge variant="unavailable" />}
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Powered by Google Gemini AI · Interprets verified customer metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {state.status === 'success' && (
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleGenerate}
            >
              Regenerate
            </Button>
          )}
          {(state.status === 'idle' || state.status === 'error') && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerate}
            >
              ✨ Generate AI Insight
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      {state.status === 'idle' && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
          <p className="text-xs text-slate-600">
            Click <strong className="text-brand-600">✨ Generate AI Insight</strong> to receive a Gemini AI executive analysis of your customer data.
          </p>
          <p className="text-[11px] text-slate-600">
            All numerical metrics are computed by the deterministic engine — Gemini interprets and narrates them.
          </p>
        </div>
      )}

      {state.status === 'loading' && (
        <div className="space-y-3 animate-pulse">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="h-3 bg-slate-200 rounded w-2/3" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-5/6" />
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-4/5" />
            <div className="h-3 bg-slate-200 rounded w-full" />
          </div>
          <p className="text-[11px] text-brand-600 text-center">
            Gemini AI is analyzing your customer intelligence data…
          </p>
        </div>
      )}

      {state.status === 'success' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InsightBlock
            label="🔍 Key Finding"
            text={state.result.keyFinding}
            color="brand"
          />
          <InsightBlock
            label="📈 Business Implication"
            text={state.result.businessImplication}
            color="brand"
          />
          <InsightBlock
            label="🎯 Recommended Action"
            text={state.result.recommendedAction}
            color="emerald"
          />
        </div>
      )}

      {state.status === 'error' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-700">
              AI generation is temporarily unavailable
            </p>
            <p className="text-[11px] text-slate-600">{state.message}</p>
            <button
              className="text-[11px] text-brand-600 underline underline-offset-2 hover:text-brand-500 transition-colors"
              onClick={handleGenerate}
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {state.status === 'unconfigured' && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-700">
                Gemini AI not configured
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Add your <code className="text-brand-600 bg-brand-50 px-1 rounded">VITE_GEMINI_API_KEY</code> to a{' '}
                <code className="text-brand-600 bg-brand-50 px-1 rounded">.env</code> file to enable AI analysis.
                See <code className="text-slate-600">.env.example</code> for setup instructions.
              </p>
            </div>
          </div>
          {/* Demo fallback content clearly labeled */}
          <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 mb-1">
              <AIBadge variant="demo" />
              <span className="text-[10px] text-slate-600">
                Demo content — not Gemini generated
              </span>
            </div>
            <InsightBlock
              label="🔍 Key Finding (Demo)"
              text={`Your customer base of ${context.totalCustomers} shows a concentration of ${context.highValueCount} high-value accounts that drive disproportionate revenue.`}
              color="brand"
            />
            <InsightBlock
              label="📈 Business Implication (Demo)"
              text={`With ${context.atRiskCount} at-risk customers averaging ${context.atRiskAvgRecencyDays} days of inactivity, targeted re-engagement campaigns can recover significant lifetime value.`}
              color="brand"
            />
            <InsightBlock
              label="🎯 Recommended Action (Demo)"
              text="Launch a segmented win-back campaign for at-risk customers while simultaneously reinforcing loyalty perks for high-value accounts."
              color="emerald"
            />
          </div>
        </div>
      )}
    </Card>
  );
};

// ---------------------------------------------------------------------------
// Internal sub-component
// ---------------------------------------------------------------------------

interface InsightBlockProps {
  label: string;
  text: string;
  color: 'brand' | 'indigo' | 'emerald';
}

const COLOR_MAP: Record<InsightBlockProps['color'], { label: string; border: string; bg: string }> = {
  brand: {
    label: 'text-brand-600',
    border: 'border-brand-200',
    bg: 'bg-white',
  },
  indigo: {
    // Use brand blue for the 'business implication' accent to remove purple/indigo
    label: 'text-brand-600',
    border: 'border-brand-200',
    bg: 'bg-white',
  },
  emerald: {
    label: 'text-emerald-600',
    border: 'border-emerald-200',
    bg: 'bg-white',
  },
};

const InsightBlock: React.FC<InsightBlockProps> = ({ label, text, color }) => {
  const c = COLOR_MAP[color];
  return (
    <div className={`p-3 rounded-xl ${c.bg} border ${c.border} space-y-1.5`}>
      <span className={`text-[10px] font-bold uppercase tracking-wide ${c.label}`}>
        {label}
      </span>
      <p className="text-xs text-slate-900 leading-relaxed">{text}</p>
    </div>
  );
};
