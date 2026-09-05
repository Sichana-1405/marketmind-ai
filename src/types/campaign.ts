import { SegmentType } from './customer';

export type CampaignGoal =
  | 'Increase purchases'
  | 'Improve retention'
  | 'Increase engagement'
  | 'Re-engage customers'
  | 'Promote new products'
  | 'Onboarding';

export type MarketingChannel =
  | 'Email'
  | 'SMS'
  | 'WhatsApp'
  | 'Social Media'
  | 'AI Recommended';

export type CampaignStatus = 'Draft' | 'Ready' | 'Active' | 'Completed';

export interface CampaignEstimate {
  estimatedAudience: number;
  estimatedReach: number;
  estimatedEngagementPct: number;
  estimatedConversions: number;
  estimatedRevenueINR: number;
  confidenceNote: string;
}

export interface CampaignRecommendation {
  id: string;
  title: string;
  description: string;
  targetSegment: SegmentType;
  goal: CampaignGoal;
  priority: 'High' | 'Medium' | 'Low';
  recommendedChannel: MarketingChannel;
  recommendedOffer: string;
  reasons: string[];
  strategySummary: string;
  suggestedMessage: string;
  callToAction: string;
  estimatedAudience: number;
}

export interface Campaign {
  id: string;
  title: string;
  targetSegment: SegmentType;
  goal: CampaignGoal;
  budgetINR: number;
  recommendedChannel: MarketingChannel;
  recommendedOffer: string;
  status: CampaignStatus;
  createdAt: string;
  strategySummary: string;
  suggestedMessage: string;
  callToAction: string;
  reasons: string[];
  estimate: CampaignEstimate;
  performance?: {
    reach: number;
    conversions: number;
    revenueINR: number;
  };
}

export interface CampaignInsight {
  id: string;
  title: string;
  type: 'opportunity' | 'alert' | 'trend' | 'campaign';
  description: string;
  evidence: string[];
  recommendation: string;
  targetSegment: SegmentType;
  priority: 'High' | 'Medium' | 'Low';
}

// ---------------------------------------------------------------------------
// AI-generated content types
// These are produced by aiService.ts and are NEVER used to override numbers.
// ---------------------------------------------------------------------------

export interface AIEmailCopy {
  subject: string;
  previewText: string;
  body: string;
  cta: string;
}

export interface AIWhatsAppCopy {
  message: string;
  cta: string;
}

export interface AISocialCopy {
  caption: string;
  cta: string;
}

export interface AICampaignOutput {
  /** True if content was produced by Gemini AI; false = deterministic fallback */
  isAiGenerated: boolean;
  campaignName?: string;
  strategyNarrative?: string;
  audienceDescription?: string;
  messagingAngle?: string;
  offerSuggestion?: string;
  emailCopy?: AIEmailCopy;
  whatsappCopy?: AIWhatsAppCopy;
  socialCopy?: AISocialCopy;
}
