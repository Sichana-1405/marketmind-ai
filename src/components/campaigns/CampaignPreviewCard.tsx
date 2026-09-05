import React from 'react';
import { Send, Sparkles, Check, RefreshCw, Edit3, Save } from 'lucide-react';
import { Campaign } from '../../types/campaign';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface CampaignPreviewCardProps {
  campaign: Campaign;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export const CampaignPreviewCard: React.FC<CampaignPreviewCardProps> = ({
  campaign,
  onRegenerate,
  onEdit,
  onSave,
  isSaved = false,
}) => {
  return (
    <Card className="border-brand-200 bg-white space-y-4 relative overflow-hidden">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Badge variant={campaign.targetSegment}>{campaign.targetSegment}</Badge>
          <span className="text-[10px] font-mono text-slate-400">
            Channel: <strong className="text-brand-300">{campaign.recommendedChannel}</strong>
          </span>
        </div>
          <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-600" />
            Preview
          </div>
      </div>

      {/* Offer Highlight */}
      <div className="p-3 bg-brand-50 rounded-xl border border-brand-200 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">Campaign Offer</span>
          <p className="text-sm font-bold text-slate-900 mt-0.5">{campaign.recommendedOffer}</p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-mono font-bold border border-brand-200">
          Budget: ₹{campaign.budgetINR.toLocaleString()}
        </div>
      </div>

      {/* Message Copy Box (Formatted Mockup) */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
          <span>Outbound Message Preview</span>
          <span>Target: {campaign.goal}</span>
        </div>
        <p className="text-sm text-slate-900 font-sans leading-relaxed whitespace-pre-line border-l-2 border-brand-500 pl-3 py-1 bg-slate-50 rounded-r-lg">
          "{campaign.suggestedMessage}"
        </p>

        <div className="pt-2 flex justify-start">
          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-2 pointer-events-none">
            {campaign.callToAction} <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Estimated Impact Bar */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ESTIMATED Impact Metrics
          </span>
          <span className="text-[10px] text-slate-500">Deterministic Model</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <p className="text-[10px] text-slate-600">Audience</p>
            <p className="font-bold text-slate-900 mt-0.5">{campaign.estimate.estimatedAudience}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <p className="text-[10px] text-slate-600">Est. Reach</p>
            <p className="font-bold text-slate-900 mt-0.5">{campaign.estimate.estimatedReach}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <p className="text-[10px] text-slate-600">Est. Conversions</p>
            <p className="font-bold text-emerald-600 mt-0.5">{campaign.estimate.estimatedConversions}</p>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <p className="text-[10px] text-slate-600">Est. Revenue</p>
            <p className="font-bold text-brand-600 mt-0.5">₹{campaign.estimate.estimatedRevenueINR.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200">
        {onRegenerate && (
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={onRegenerate}>
            Regenerate
          </Button>
        )}
        {onEdit && (
          <Button variant="secondary" size="sm" icon={<Edit3 className="w-3.5 h-3.5" />} onClick={onEdit}>
            Edit Parameters
          </Button>
        )}
        {onSave && (
          <Button
            variant="primary"
            size="sm"
            disabled={isSaved}
            icon={isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            onClick={onSave}
          >
            {isSaved ? 'Saved to Campaigns' : 'Save Campaign'}
          </Button>
        )}
      </div>
    </Card>
  );
};
