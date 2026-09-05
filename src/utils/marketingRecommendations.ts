import { CampaignGoal, CampaignRecommendation, MarketingChannel } from '../types/campaign';
import { Customer, SegmentType } from '../types/customer';
import { getDaysSinceLastPurchase } from './segmentation';

/**
 * Generates dynamic, empirical marketing recommendations based on actual customer segment statistics.
 */
export function generateMarketingRecommendation(
  targetSegment: SegmentType,
  allCustomers: Customer[],
  preferredGoal?: CampaignGoal,
  preferredChannel?: MarketingChannel
): CampaignRecommendation {
  const segmentCustomers = allCustomers.filter((c) => c.segment === targetSegment);
  const totalCount = allCustomers.length || 1;
  const count = segmentCustomers.length;
  const segmentPct = ((count / totalCount) * 100).toFixed(1);

  // Compute empirical segment stats
  const avgSpent = count > 0 ? Math.round(segmentCustomers.reduce((a, b) => a + b.totalSpent, 0) / count) : 0;
  const avgPurchases = count > 0 ? (segmentCustomers.reduce((a, b) => a + b.purchaseCount, 0) / count).toFixed(1) : '0';
  const avgEngagement = count > 0 ? Math.round(segmentCustomers.reduce((a, b) => a + b.engagementScore, 0) / count) : 0;
  const overallAvgEngagement = Math.round(allCustomers.reduce((a, b) => a + b.engagementScore, 0) / totalCount);

  const avgRecencyDays = count > 0
    ? Math.round(segmentCustomers.reduce((a, b) => a + getDaysSinceLastPurchase(b.lastPurchaseDate), 0) / count)
    : 0;

  const inactivePct = count > 0
    ? Math.round((segmentCustomers.filter((c) => getDaysSinceLastPurchase(c.lastPurchaseDate) >= 60).length / count) * 100)
    : 0;

  // Segment specific strategy defaults
  let defaultGoal: CampaignGoal = 'Increase purchases';
  let recommendedChannel: MarketingChannel = 'Email';
  let title = '';
  let description = '';
  let recommendedOffer = '';
  let strategySummary = '';
  let suggestedMessage = '';
  let callToAction = '';
  const reasons: string[] = [];

  switch (targetSegment) {
    case 'High Value':
      defaultGoal = preferredGoal || 'Improve retention';
      recommendedChannel = preferredChannel && preferredChannel !== 'AI Recommended' ? preferredChannel : 'Email';
      title = 'VIP Exclusive Rewards & Priority Access Drive';
      description = `High Value accounts represent ${segmentPct}% of customers with average spend of ₹${avgSpent.toLocaleString()}. Preserve zero churn and maximize lifetime value.`;
      recommendedOffer = 'Flat ₹2,500 VIP Gift Credit + Free Express Shipping';
      strategySummary = 'Deliver personalized appreciation benefits and private preview access to high-margin product drops.';
      suggestedMessage = `Exclusive VIP Invitation: As one of our top partners, enjoy ₹2,500 credit on your next order plus dedicated concierge support.`;
      callToAction = 'Claim VIP Pass';
      reasons.push(`High Value customers represent ${segmentPct}% of your total audience.`);
      reasons.push(`Average lifetime spend is ₹${avgSpent.toLocaleString()} (top revenue tier).`);
      reasons.push(`Average purchase frequency is ${avgPurchases} completed orders.`);
      reasons.push(`Strong digital engagement score averaging ${avgEngagement}/100.`);
      break;

    case 'Loyal':
      defaultGoal = preferredGoal || 'Increase purchases';
      recommendedChannel = preferredChannel && preferredChannel !== 'AI Recommended' ? preferredChannel : 'WhatsApp';
      title = 'Loyalty Rewards Multiplier & VIP Upgrade';
      description = `Loyal customers have an average order count of ${avgPurchases}. Drive repeat purchase frequency with double points.`;
      recommendedOffer = '2X Loyalty Points + Free Premium Upgrade';
      strategySummary = 'Reward consistent repeat purchases with milestone bonus points and subscription incentives.';
      suggestedMessage = `Thank you for being a loyal customer! Earn 2X reward points on all purchases this week.`;
      callToAction = 'Shop & Earn 2X Points';
      reasons.push(`Segment consists of ${count} loyal repeat buyers (${segmentPct}% of customer base).`);
      reasons.push(`Average order frequency is ${avgPurchases} orders per account.`);
      reasons.push(`Average recency is ${avgRecencyDays} days since last purchase.`);
      break;

    case 'Regular':
      defaultGoal = preferredGoal || 'Increase engagement';
      recommendedChannel = preferredChannel && preferredChannel !== 'AI Recommended' ? preferredChannel : 'Email';
      title = 'Cross-Sell & Product Bundle Upsell';
      description = `Regular active accounts average spend of ₹${avgSpent.toLocaleString()}. Cross-sell complementary categories to elevate AOV.`;
      recommendedOffer = '15% OFF Curated Product Bundles';
      strategySummary = 'Present tailored product recommendations based on previous order history to increase basket size.';
      suggestedMessage = `Complete your setup! Enjoy 15% OFF recommended accessories paired with your recent order.`;
      callToAction = 'Explore Bundles';
      reasons.push(`Core customer base of ${count} active accounts (${segmentPct}% of total).`);
      reasons.push(`Average lifetime spend is ₹${avgSpent.toLocaleString()}.`);
      reasons.push(`Average engagement score is ${avgEngagement}/100 (prime for cross-sell growth).`);
      break;

    case 'New / Potential':
      defaultGoal = preferredGoal || 'Onboarding';
      recommendedChannel = preferredChannel && preferredChannel !== 'AI Recommended' ? preferredChannel : 'WhatsApp';
      title = 'New Customer Onboarding & Second Order Nurture';
      description = `Recently acquired customers with potential. Accelerate time to second order with welcome perks.`;
      recommendedOffer = 'Flat ₹500 OFF Second Order over ₹1,500';
      strategySummary = 'Deliver educational onboarding sequence followed by a limited-time second purchase incentive.';
      suggestedMessage = `Welcome to the community! Enjoy ₹500 OFF your second purchase when you complete your profile today.`;
      callToAction = 'Claim ₹500 Voucher';
      reasons.push(`${count} newly acquired / potential accounts currently in onboarding phase.`);
      reasons.push(`Average order history is currently ${avgPurchases} purchase(s).`);
      reasons.push(`Recent acquisition within average ${avgRecencyDays} days.`);
      break;

    case 'At Risk':
    default:
      defaultGoal = preferredGoal || 'Re-engage customers';
      recommendedChannel = preferredChannel && preferredChannel !== 'AI Recommended' ? preferredChannel : 'SMS';
      title = 'At-Risk Win-Back & Reactivation Campaign';
      description = `${inactivePct}% of this segment has not purchased in over 60 days. Re-engage before complete churn.`;
      recommendedOffer = '20% OFF Re-activation Discount Code';
      strategySummary = 'Send high-impact direct SMS/WhatsApp reminder with an urgent 48-hour discount code.';
      suggestedMessage = `We miss you! Take 20% OFF your next order with code COMEBACK20. Valid for the next 48 hours.`;
      callToAction = 'Re-activate Account';
      reasons.push(`At Risk customers represent ${segmentPct}% of your total customer base.`);
      reasons.push(`Average recency is ${avgRecencyDays} days without an active purchase.`);
      reasons.push(`${inactivePct}% of accounts have had zero purchase activity in 60+ days.`);
      reasons.push(`Average engagement is ${avgEngagement}/100 (${overallAvgEngagement - avgEngagement}% below overall store average).`);
      break;
  }

  const finalGoal = preferredGoal || defaultGoal;
  const finalChannel = preferredChannel && preferredChannel !== 'AI Recommended' ? preferredChannel : recommendedChannel;

  return {
    id: `REC-${targetSegment.toUpperCase().replace(/\s+/g, '')}-${Date.now()}`,
    title,
    description,
    targetSegment,
    goal: finalGoal,
    priority: targetSegment === 'At Risk' || targetSegment === 'High Value' ? 'High' : 'Medium',
    recommendedChannel: finalChannel,
    recommendedOffer,
    reasons,
    strategySummary,
    suggestedMessage,
    callToAction,
    estimatedAudience: count,
  };
}
