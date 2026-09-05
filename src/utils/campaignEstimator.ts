import { CampaignEstimate, CampaignGoal, MarketingChannel } from '../types/campaign';
import { Customer, SegmentType } from '../types/customer';

/**
 * Deterministic campaign impact estimator.
 * Calculates transparent estimates based on segment audience size, average engagement, channel efficiency, and budget.
 */
export function estimateCampaignImpact(
  targetSegment: SegmentType,
  allCustomers: Customer[],
  goal: CampaignGoal,
  channel: MarketingChannel,
  budgetINR: number
): CampaignEstimate {
  const segmentCustomers = allCustomers.filter((c) => c.segment === targetSegment);
  const audienceSize = segmentCustomers.length || 1;

  // Calculate average metrics for this segment
  const avgEngagement =
    segmentCustomers.reduce((acc, c) => acc + c.engagementScore, 0) / audienceSize;
  const avgSpend =
    segmentCustomers.reduce((acc, c) => acc + c.totalSpent, 0) / (audienceSize || 1);
  const avgAOV = Math.max(1200, Math.round(avgSpend / 4)); // Estimated average order value in INR

  // Channel reach efficiency multipliers
  const channelMultipliers: Record<MarketingChannel, { reach: number; convBonus: number }> = {
    Email: { reach: 0.92, convBonus: 1.0 },
    SMS: { reach: 0.98, convBonus: 1.25 },
    WhatsApp: { reach: 0.95, convBonus: 1.35 },
    'Social Media': { reach: 0.85, convBonus: 0.9 },
    'AI Recommended': { reach: 0.96, convBonus: 1.3 },
  };

  const channelConfig = channelMultipliers[channel] || channelMultipliers['Email'];

  // Goal multiplier for conversions
  const goalMultipliers: Record<CampaignGoal, number> = {
    'Increase purchases': 1.2,
    'Improve retention': 1.1,
    'Increase engagement': 1.0,
    'Re-engage customers': 0.85,
    'Promote new products': 1.15,
    'Onboarding': 1.1,
  };

  const goalMult = goalMultipliers[goal] || 1.0;

  // Reach estimation
  const reachCount = Math.min(audienceSize, Math.ceil(audienceSize * channelConfig.reach));

  // Engagement percentage estimation based on segment score
  const estimatedEngagementPct = Math.min(
    95,
    Math.max(15, Math.round((avgEngagement * 0.7) + (budgetINR > 5000 ? 12 : 5)))
  );

  // Conversion rate calculation
  const baseConvRate = (avgEngagement / 100) * 0.28 * channelConfig.convBonus * goalMult;
  const estimatedConversions = Math.max(
    1,
    Math.min(reachCount, Math.round(reachCount * baseConvRate))
  );

  // Estimated Revenue generated in INR (₹)
  const estimatedRevenueINR = Math.round(estimatedConversions * avgAOV * 1.1);

  return {
    estimatedAudience: audienceSize,
    estimatedReach: reachCount,
    estimatedEngagementPct,
    estimatedConversions,
    estimatedRevenueINR,
    confidenceNote: 'ESTIMATED projection based on segment historical RFM & engagement baseline.',
  };
}
