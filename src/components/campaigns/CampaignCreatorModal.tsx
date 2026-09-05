import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  Target,
  DollarSign,
  Sparkles,
  HelpCircle,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  MessageSquare,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AIBadge } from '../ui/AIBadge';
import { Customer, SegmentType } from '../../types/customer';
import { Campaign, CampaignGoal, MarketingChannel } from '../../types/campaign';
import { generateMarketingRecommendation } from '../../utils/marketingRecommendations';
import { estimateCampaignImpact } from '../../utils/campaignEstimator';
import { CampaignPreviewCard } from './CampaignPreviewCard';
import { AICopyGenerator } from './AICopyGenerator';
import {
  generateCampaignStrategy,
  AICampaignStrategy,
  CampaignContext,
  getAIStatus,
} from '../../services/aiService';
import { getDaysSinceLastPurchase } from '../../utils/segmentation';

interface CampaignCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  onSaveCampaign: (campaign: Campaign) => void;
}

const STEPS = [
  '1. Audience',
  '2. Goal',
  '3. Budget & Channel',
  '4. Recommendation',
  '5. Strategy & Why?',
  '6. Estimated Impact',
  '7. Preview & Save',
];

export const CampaignCreatorModal: React.FC<CampaignCreatorModalProps> = ({
  isOpen,
  onClose,
  customers,
  onSaveCampaign,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [targetSegment, setTargetSegment] = useState<SegmentType>('High Value');
  const [goal, setGoal] = useState<CampaignGoal>('Improve retention');
  const [budgetINR, setBudgetINR] = useState(75000);
  const [channel, setChannel] = useState<MarketingChannel>('AI Recommended');
  const [isSaved, setIsSaved] = useState(false);

  // AI Strategy State — tracks Gemini-generated strategy; null = not yet generated or failed
  type AIStrategyState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: AICampaignStrategy }
    | { status: 'error' }
    | { status: 'unconfigured' };

  const [aiStrategy, setAiStrategy] = useState<AIStrategyState>(() =>
    getAIStatus() === 'unconfigured' ? { status: 'unconfigured' } : { status: 'idle' }
  );

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSaved(false);
      setAiStrategy(
        getAIStatus() === 'unconfigured' ? { status: 'unconfigured' } : { status: 'idle' }
      );
    }
  }, [isOpen]);

  // Reset AI strategy when key parameters change so stale output is not shown
  useEffect(() => {
    setAiStrategy(
      getAIStatus() === 'unconfigured' ? { status: 'unconfigured' } : { status: 'idle' }
    );
  }, [targetSegment, goal, budgetINR, channel]);

  // Real-time dynamic recommendation computation (declared BEFORE handleGenerateAIStrategy)
  const recommendation = useMemo(() => {
    return generateMarketingRecommendation(targetSegment, customers, goal, channel);
  }, [targetSegment, customers, goal, channel]);

  // Real-time dynamic estimate computation
  const estimate = useMemo(() => {
    const activeChannel = channel === 'AI Recommended' ? recommendation.recommendedChannel : channel;
    return estimateCampaignImpact(targetSegment, customers, goal, activeChannel, budgetINR);
  }, [targetSegment, customers, goal, channel, recommendation, budgetINR]);

  // Gemini AI Strategy generation — uses recommendation.reasons as primary evidence
  const handleGenerateAIStrategy = useCallback(async () => {
    setAiStrategy({ status: 'loading' });
    const segmentCustomers = customers.filter((c) => c.segment === targetSegment);
    const count = segmentCustomers.length || 1;
    const avgRecencyDays =
      count > 0
        ? Math.round(
            segmentCustomers.reduce((a, b) => a + getDaysSinceLastPurchase(b.lastPurchaseDate), 0) / count
          )
        : 0;
    const avgEngagement =
      count > 0
        ? Math.round(segmentCustomers.reduce((a, b) => a + b.engagementScore, 0) / count)
        : 0;
    const avgSpendINR =
      count > 0
        ? Math.round(segmentCustomers.reduce((a, b) => a + b.totalSpent, 0) / count)
        : 0;

    const ctx: CampaignContext = {
      targetSegment,
      audienceCount: count,
      avgRecencyDays,
      avgEngagement,
      avgSpendINR,
      goal,
      budgetINR,
      channel: channel === 'AI Recommended'
        ? (recommendation.recommendedChannel as string)
        : (channel as string),
      primaryEvidence: recommendation.reasons,
    };

    const result = await generateCampaignStrategy(ctx);
    if (result) {
      setAiStrategy({ status: 'success', data: result });
    } else {
      const s = getAIStatus();
      setAiStrategy(s === 'unconfigured' ? { status: 'unconfigured' } : { status: 'error' });
    }
  }, [targetSegment, goal, budgetINR, channel, customers, recommendation]);

  // Constructed Campaign object
  const generatedCampaign: Campaign = useMemo(() => {
    const activeChannel = channel === 'AI Recommended' ? recommendation.recommendedChannel : channel;
    return {
      id: `CAMP-${Date.now().toString().slice(-4)}`,
      title: recommendation.title,
      targetSegment,
      goal,
      budgetINR,
      recommendedChannel: activeChannel,
      recommendedOffer: recommendation.recommendedOffer,
      status: 'Ready',
      createdAt: new Date().toISOString().split('T')[0],
      strategySummary: recommendation.strategySummary,
      suggestedMessage: recommendation.suggestedMessage,
      callToAction: recommendation.callToAction,
      reasons: recommendation.reasons,
      estimate,
    };
  }, [recommendation, targetSegment, goal, budgetINR, channel, estimate]);

  const handleSave = () => {
    onSaveCampaign(generatedCampaign);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interactive Campaign Creator & Intelligence Wizard"
      subtitle="Generate explainable, segment-targeted marketing campaigns in 7 steps."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Step Progress Indicator Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-brand-700 font-bold">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]}
            </span>
            <span className="text-slate-400">
              {Math.round((currentStep / STEPS.length) * 100)}% Completed
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-brand-600 transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Choose Audience */}
        {currentStep === 1 && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Users className="w-4 h-4 text-brand-400" />
              Step 1: Choose Target Customer Segment
            </div>
            <p className="text-slate-400">Select the customer audience segment you want to target for this campaign.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['High Value', 'Loyal', 'Regular', 'New / Potential', 'At Risk'] as SegmentType[]).map((seg) => {
                const count = customers.filter((c) => c.segment === seg).length;
                const isSelected = targetSegment === seg;

                return (
                  <div
                    key={seg}
                    onClick={() => setTargetSegment(seg)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-brand-50 border-brand-400 ring-1 ring-brand-200 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={seg}>{seg}</Badge>
                      <span className="text-xs font-mono font-bold text-slate-500">{count} accounts</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Target segment categorized by deterministic scoring.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Define Goal */}
        {currentStep === 2 && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Target className="w-4 h-4 text-brand-400" />
              Step 2: Define Campaign Objective Goal
            </div>
            <p className="text-slate-400">Select the primary business outcome goal for this campaign.</p>

            <div className="space-y-2">
              {[
                { name: 'Increase purchases', desc: 'Boost order frequency and average basket size.' },
                { name: 'Improve retention', desc: 'Protect high-value accounts and prevent long-term churn.' },
                { name: 'Increase engagement', desc: 'Drive website visits, email open rates, and clickthroughs.' },
                { name: 'Re-engage customers', desc: 'Win back inactive buyers showing 60+ days of inactivity.' },
                { name: 'Promote new products', desc: 'Launch new catalog lines to interested buyer segments.' },
              ].map((g) => {
                const isSelected = goal === g.name;
                return (
                  <div
                    key={g.name}
                    onClick={() => setGoal(g.name as CampaignGoal)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-50 border-brand-400 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs">{g.name}</h4>
                      <p className="text-[11px] text-slate-400">{g.desc}</p>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Set Budget & Channel */}
        {currentStep === 3 && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Step 3: Set Campaign Budget (₹) & Preferred Channel
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Allocated Budget in INR (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    step={5000}
                    min={10000}
                    max={500000}
                    value={budgetINR}
                    onChange={(e) => setBudgetINR(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Preferred Channel</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['AI Recommended', 'Email', 'SMS', 'WhatsApp', 'Social Media'] as MarketingChannel[]).map((ch) => (
                    <button
                      type="button"
                      key={ch}
                      onClick={() => setChannel(ch)}
                      className={`p-2.5 rounded-lg font-medium text-xs border text-left transition-colors ${
                        channel === ch
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {ch === 'AI Recommended' ? '✨ AI Recommended' : ch}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Generate Recommendation */}
        {currentStep === 4 && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Step 4: Campaign Strategy
              </div>
              {aiStrategy.status === 'success' && <AIBadge variant="generated" />}
              {aiStrategy.status === 'loading' && <AIBadge variant="loading" />}
              {(aiStrategy.status === 'idle' || aiStrategy.status === 'unconfigured') && <AIBadge variant="demo" />}
              {aiStrategy.status === 'error' && <AIBadge variant="unavailable" />}
            </div>

            {/* Deterministic base — always visible */}
            <div className="p-4 bg-slate-50 rounded-xl border border-brand-200 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={targetSegment}>{targetSegment}</Badge>
                <span className="text-[10px] text-slate-500 font-mono">
                  Channel: <strong className="text-brand-600">{generatedCampaign.recommendedChannel}</strong>
                </span>
              </div>

              <h3 className="text-base font-bold text-white">
                {aiStrategy.status === 'success' && aiStrategy.data.campaignName
                  ? aiStrategy.data.campaignName
                  : generatedCampaign.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">{recommendation.description}</p>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-brand-700">
                  {aiStrategy.status === 'success' ? '✨ AI Strategy Narrative:' : 'Deterministic Strategy:'}
                </span>
                <p className="text-xs text-slate-700">
                  {aiStrategy.status === 'success'
                    ? aiStrategy.data.strategyNarrative
                    : generatedCampaign.strategySummary}
                </p>
                {aiStrategy.status === 'success' && aiStrategy.data.audienceDescription && (
                  <p className="text-[11px] text-slate-400 italic mt-1">{aiStrategy.data.audienceDescription}</p>
                )}
              </div>

              {/* Messaging Angle if AI generated */}
              {aiStrategy.status === 'success' && aiStrategy.data.messagingAngle && (
                <div className="p-2 bg-sky-50 rounded-lg border border-sky-200">
                  <span className="text-[10px] font-bold uppercase text-sky-700">✨ Messaging Angle:</span>
                  <p className="text-xs text-slate-700 mt-0.5">{aiStrategy.data.messagingAngle}</p>
                </div>
              )}
            </div>

            {/* AI Generate / Loading / Error controls */}
            {aiStrategy.status === 'idle' && (
              <Button variant="primary" size="sm" onClick={handleGenerateAIStrategy}>
                ✨ Enhance with Gemini AI Strategy
              </Button>
            )}
            {aiStrategy.status === 'loading' && (
              <div className="flex items-center gap-2 text-xs text-brand-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Generating campaign strategy with Gemini AI…
              </div>
            )}
            {aiStrategy.status === 'error' && (
              <div className="flex items-center justify-between gap-3 p-3 bg-amber-950/30 rounded-lg border border-amber-800/50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-xs text-amber-300">
                    AI generation failed. Deterministic strategy is shown above.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleGenerateAIStrategy}>Retry</Button>
              </div>
            )}
            {aiStrategy.status === 'success' && (
              <Button variant="outline" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={handleGenerateAIStrategy}>
                ✨ Regenerate AI Strategy
              </Button>
            )}
            {aiStrategy.status === 'unconfigured' && (
              <p className="text-[11px] text-slate-500">
                Add <code className="text-brand-300 bg-brand-950 px-1 rounded">VITE_GEMINI_API_KEY</code> to enable AI strategy generation.
              </p>
            )}
          </div>
        )}

        {/* Step 5: Review Strategy & "Why?" */}
        {currentStep === 5 && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <HelpCircle className="w-4 h-4 text-brand-400" />
              Step 5: Explainability — "Why this recommendation?"
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-brand-200 space-y-3">
              <h4 className="text-xs font-bold uppercase text-brand-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                Empirical Evidence from {targetSegment} Dataset
              </h4>

              <ul className="space-y-2">
                {generatedCampaign.reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700">
                    <span className="text-brand-600 font-bold text-sm leading-none">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Step 6: Review Estimated Impact */}
        {currentStep === 6 && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              Step 6: Review Estimated Impact Metrics
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  ESTIMATED Projection
                </span>
                <span className="text-[10px] text-slate-400">Budget: ₹{budgetINR.toLocaleString()}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <p className="text-slate-400">Estimated Audience</p>
                  <p className="text-base font-bold text-slate-900 mt-1">{estimate.estimatedAudience} accounts</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <p className="text-slate-400">Estimated Reach</p>
                  <p className="text-base font-bold text-slate-900 mt-1">{estimate.estimatedReach} reached</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <p className="text-slate-400">Estimated Engagement</p>
                  <p className="text-base font-bold text-brand-600 mt-1">{estimate.estimatedEngagementPct}%</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <p className="text-slate-400">Estimated Conversions</p>
                  <p className="text-base font-bold text-emerald-600 mt-1">{estimate.estimatedConversions} sales</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 sm:col-span-2">
                  <p className="text-slate-400">Estimated Revenue Output</p>
                  <p className="text-lg font-bold text-emerald-600 mt-1">₹{estimate.estimatedRevenueINR.toLocaleString()}</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic pt-1">{estimate.confidenceNote}</p>
            </div>
          </div>
        )}

        {/* Step 7: Preview & Save */}
        {currentStep === 7 && (
          <div className="space-y-4 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <MessageSquare className="w-4 h-4 text-brand-400" />
              Step 7: Campaign Preview & Final Save
            </div>

            <CampaignPreviewCard
              campaign={generatedCampaign}
              onRegenerate={() => setCurrentStep(4)}
              onEdit={() => setCurrentStep(1)}
              onSave={handleSave}
              isSaved={isSaved}
            />

            {/* AI Marketing Copy Generator — purely copy, never overwrites metrics */}
            <AICopyGenerator
              targetSegment={targetSegment}
              audienceCount={recommendation.estimatedAudience}
              goal={goal}
              channel={generatedCampaign.recommendedChannel}
              offerText={generatedCampaign.recommendedOffer}
              callToAction={generatedCampaign.callToAction}
              deterministicMessage={generatedCampaign.suggestedMessage}
            />
          </div>
        )}

        {/* Modal Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <Button
            variant="outline"
            size="sm"
            disabled={currentStep === 1}
            icon={<ChevronLeft className="w-4 h-4" />}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          >
            Back
          </Button>

          {currentStep < 7 ? (
            <Button
              variant="primary"
              size="sm"
              icon={<ChevronRight className="w-4 h-4" />}
              onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
            >
              Next: {STEPS[currentStep]}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={isSaved}
              icon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              {isSaved ? 'Campaign Saved!' : 'Save & Deploy Campaign'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
