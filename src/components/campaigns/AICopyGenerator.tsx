/**
 * AICopyGenerator.tsx
 *
 * Channel-specific AI marketing copy generation panel.
 * Used inside CampaignCreatorModal Step 7 (Preview & Save).
 *
 * IMPORTANT:
 * This component generates COPY ONLY (subject lines, message body, captions).
 * All numerical campaign metrics (audience, reach, conversions, revenue) come
 * exclusively from campaignEstimator.ts and are displayed unchanged.
 *
 * If Gemini is unavailable, falls back to deterministic suggestedMessage
 * clearly labeled as "Deterministic Fallback".
 */
import React, { useState, useCallback } from 'react';
import { Mail, MessageSquare, Share2, RefreshCw, AlertCircle } from 'lucide-react';
import { AIBadge } from '../ui/AIBadge';
import { Button } from '../ui/Button';
import {
  generateMarketingCopy,
  CopyContext,
  ChannelCopy,
  getAIStatus,
} from '../../services/aiService';
import { CampaignGoal, MarketingChannel } from '../../types/campaign';
import { SegmentType } from '../../types/customer';

interface AICopyGeneratorProps {
  targetSegment: SegmentType;
  audienceCount: number;
  goal: CampaignGoal;
  channel: MarketingChannel;
  offerText: string;
  callToAction: string;
  deterministicMessage: string; // Fallback from marketingRecommendations.ts
}

type CopyState =
  | { status: 'idle' }
  | { status: 'loading'; channel: string }
  | { status: 'success'; result: ChannelCopy }
  | { status: 'error'; message: string }
  | { status: 'unconfigured' };

const CHANNEL_TABS = [
  { id: 'Email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
  { id: 'WhatsApp', label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'Social Media', label: 'Social', icon: <Share2 className="w-3.5 h-3.5" /> },
] as const;

type CopyChannel = typeof CHANNEL_TABS[number]['id'];

export const AICopyGenerator: React.FC<AICopyGeneratorProps> = ({
  targetSegment,
  audienceCount,
  goal,
  channel,
  offerText,
  callToAction,
  deterministicMessage,
}) => {
  // Default to the campaign's chosen channel where possible
  const defaultTab: CopyChannel =
    channel === 'Email' || channel === 'WhatsApp' || channel === 'Social Media'
      ? channel
      : 'Email';

  const [activeTab, setActiveTab] = useState<CopyChannel>(defaultTab);
  const [copyStates, setCopyStates] = useState<Record<CopyChannel, CopyState>>({
    Email: getAIStatus() === 'unconfigured' ? { status: 'unconfigured' } : { status: 'idle' },
    WhatsApp: getAIStatus() === 'unconfigured' ? { status: 'unconfigured' } : { status: 'idle' },
    'Social Media': getAIStatus() === 'unconfigured' ? { status: 'unconfigured' } : { status: 'idle' },
  });

  const handleGenerate = useCallback(
    async (ch: CopyChannel) => {
      setCopyStates((prev) => ({ ...prev, [ch]: { status: 'loading', channel: ch } }));

      const ctx: CopyContext = {
        targetSegment,
        audienceCount,
        goal,
        channel: ch,
        offerText,
        callToAction,
        brandName: 'MarketMind Brand',
      };

      const result = await generateMarketingCopy(ctx);

      if (result) {
        setCopyStates((prev) => ({ ...prev, [ch]: { status: 'success', result } }));
      } else {
        const aiStatus = getAIStatus();
        if (aiStatus === 'unconfigured') {
          setCopyStates((prev) => ({ ...prev, [ch]: { status: 'unconfigured' } }));
        } else {
          setCopyStates((prev) => ({
            ...prev,
            [ch]: {
              status: 'error',
              message: 'AI generation is temporarily unavailable. Your deterministic campaign recommendation is still available below.',
            },
          }));
        }
      }
    },
    [targetSegment, audienceCount, goal, offerText, callToAction]
  );

  const currentState = copyStates[activeTab];

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-300">
          ✨ AI Marketing Copy Generator
        </span>
        {currentState.status === 'success' && <AIBadge variant="generated" />}
        {currentState.status === 'loading' && <AIBadge variant="loading" />}
        {currentState.status === 'unconfigured' && <AIBadge variant="demo" />}
        {(currentState.status === 'idle' || currentState.status === 'error') && (
          <AIBadge variant="unavailable" />
        )}
      </div>

      {/* Channel Tabs */}
      <div className="flex gap-1 p-1 bg-slate-50 rounded-lg border border-slate-200">
        {CHANNEL_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Copy Content Area */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 min-h-[140px]">
        {currentState.status === 'idle' && (
          <div className="flex flex-col items-center justify-center h-24 gap-3">
            <p className="text-xs text-slate-400 text-center">
              Generate AI-written {activeTab} copy for this campaign
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleGenerate(activeTab)}
            >
              ✨ Write {activeTab} Copy with Gemini
            </Button>
          </div>
        )}

        {currentState.status === 'loading' && (
          <div className="animate-pulse space-y-2.5">
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-4/5" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
            <p className="text-[11px] text-brand-600 text-center pt-1">
              Writing {activeTab} copy with Gemini AI…
            </p>
          </div>
        )}

        {currentState.status === 'success' && currentState.result.channel === 'Email' && (
          <EmailCopyDisplay copy={currentState.result.copy} onRegenerate={() => handleGenerate('Email')} />
        )}
        {currentState.status === 'success' && currentState.result.channel === 'WhatsApp' && (
          <WhatsAppCopyDisplay copy={currentState.result.copy} onRegenerate={() => handleGenerate('WhatsApp')} />
        )}
        {currentState.status === 'success' && currentState.result.channel === 'Social Media' && (
          <SocialCopyDisplay copy={currentState.result.copy} onRegenerate={() => handleGenerate('Social Media')} />
        )}

        {currentState.status === 'error' && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-700">AI generation failed</p>
                  <p className="text-[11px] text-slate-600">{currentState.message}</p>
                </div>
              </div>
            <DeterministicFallback message={deterministicMessage} cta={callToAction} />
            <Button variant="outline" size="sm" onClick={() => handleGenerate(activeTab)}>
              Try again
            </Button>
          </div>
        )}

        {currentState.status === 'unconfigured' && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-700">Gemini AI not configured</p>
                <p className="text-[11px] text-slate-600">
                  Add <code className="text-brand-600 bg-brand-50 px-1 rounded">VITE_GEMINI_API_KEY</code> to your <code className="text-slate-600">.env</code> file to enable AI copy generation.
                </p>
              </div>
            </div>
            <DeterministicFallback message={deterministicMessage} cta={callToAction} />
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Channel-specific display components
// ---------------------------------------------------------------------------

interface EmailCopyDisplayProps {
  copy: { subject: string; previewText: string; body: string; cta: string };
  onRegenerate: () => void;
}

const EmailCopyDisplay: React.FC<EmailCopyDisplayProps> = ({ copy, onRegenerate }) => (
  <div className="space-y-2.5">
    <CopyField label="Subject" value={copy.subject} mono />
    {copy.previewText && <CopyField label="Preview Text" value={copy.previewText} />}
    <div className="space-y-1">
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Body</span>
      <p className="text-xs text-slate-900 leading-relaxed whitespace-pre-line border-l-2 border-brand-500 pl-3 py-1 bg-slate-50 rounded-r-lg">
        {copy.body}
      </p>
    </div>
    <CopyField label="CTA" value={copy.cta} highlight />
    <div className="flex justify-end pt-1">
      <Button variant="outline" size="sm" icon={<RefreshCw className="w-3 h-3" />} onClick={onRegenerate}>
        ✨ Regenerate
      </Button>
    </div>
  </div>
);

interface WhatsAppCopyDisplayProps {
  copy: { message: string; cta: string };
  onRegenerate: () => void;
}

const WhatsAppCopyDisplay: React.FC<WhatsAppCopyDisplayProps> = ({ copy, onRegenerate }) => (
  <div className="space-y-2.5">
    <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Message</span>
        <p className="text-xs text-slate-900 leading-relaxed whitespace-pre-line border-l-2 border-emerald-500 pl-3 py-1 bg-slate-50 rounded-r-lg">
          {copy.message}
        </p>
      </div>
    <CopyField label="CTA" value={copy.cta} highlight />
    <div className="flex justify-end pt-1">
      <Button variant="outline" size="sm" icon={<RefreshCw className="w-3 h-3" />} onClick={onRegenerate}>
        ✨ Regenerate
      </Button>
    </div>
  </div>
);

interface SocialCopyDisplayProps {
  copy: { caption: string; cta: string };
  onRegenerate: () => void;
}

const SocialCopyDisplay: React.FC<SocialCopyDisplayProps> = ({ copy, onRegenerate }) => (
  <div className="space-y-2.5">
    <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Caption</span>
        <p className="text-xs text-slate-900 leading-relaxed whitespace-pre-line border-l-2 border-brand-500 pl-3 py-1 bg-slate-50 rounded-r-lg">
          {copy.caption}
        </p>
      </div>
    <CopyField label="CTA" value={copy.cta} highlight />
    <div className="flex justify-end pt-1">
      <Button variant="outline" size="sm" icon={<RefreshCw className="w-3 h-3" />} onClick={onRegenerate}>
        ✨ Regenerate
      </Button>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Helper: Deterministic fallback message (clearly labeled, never AI)
// ---------------------------------------------------------------------------

const DeterministicFallback: React.FC<{ message: string; cta: string }> = ({ message, cta }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
        Deterministic Fallback Message
      </span>
      <span className="text-[10px] text-slate-500">(not AI generated)</span>
    </div>
    <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-3 py-1 bg-slate-50 rounded-r-lg italic">
      "{message}"
    </p>
    <p className="text-[10px] text-slate-500">CTA: {cta}</p>
  </div>
);

// ---------------------------------------------------------------------------
// Helper: Generic copy field
// ---------------------------------------------------------------------------

interface CopyFieldProps {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}

const CopyField: React.FC<CopyFieldProps> = ({ label, value, mono, highlight }) => (
  <div className="space-y-0.5">
    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">{label}</span>
    <p
      className={`text-xs rounded px-2 py-1 ${
        highlight
          ? 'bg-brand-50 text-brand-600 border border-brand-200 font-semibold'
          : 'bg-slate-50 text-slate-900 border border-slate-200'
      } ${mono ? 'font-mono' : ''}`}
    >
      {value}
    </p>
  </div>
);
