import { Customer, SegmentType } from '../types/customer';

/**
 * Calculates days since last purchase assuming baseline reference date 2026-09-01.
 */
export function getDaysSinceLastPurchase(lastPurchaseDate: string): number {
  const refDate = new Date('2026-09-01T00:00:00Z').getTime();
  const pDate = new Date(lastPurchaseDate).getTime();
  const diffTime = Math.max(0, refDate - pDate);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates a comprehensive customer score (0 to 100) combining:
 * - Spend (0-30 pts)
 * - Purchase Frequency (0-25 pts)
 * - Recency (0-25 pts)
 * - Digital Engagement (0-20 pts)
 */
export function calculateCustomerScore(customer: {
  totalSpent: number;
  purchaseCount: number;
  lastPurchaseDate: string;
  websiteVisits: number;
  emailOpens: number;
  emailClicks: number;
}): { score: number; breakdown: Record<string, number> } {
  const daysAgo = getDaysSinceLastPurchase(customer.lastPurchaseDate);

  // 1. Spend score (0 - 30 pts, max at $4,500 spend)
  const spendScore = Math.min(30, (customer.totalSpent / 4500) * 30);

  // 2. Frequency score (0 - 25 pts, max at 10 purchases)
  const freqScore = Math.min(25, (customer.purchaseCount / 10) * 25);

  // 3. Recency score (0 - 25 pts, 25 if today, 0 if >= 90 days ago)
  const recencyScore = Math.max(0, 25 - (daysAgo * (25 / 90)));

  // 4. Digital Engagement score (0 - 20 pts)
  const visitScore = Math.min(8, customer.websiteVisits * 0.25);
  const openScore = Math.min(6, customer.emailOpens * 0.3);
  const clickScore = Math.min(6, customer.emailClicks * 0.6);
  const engagementScore = Math.min(20, visitScore + openScore + clickScore);

  const totalScore = Math.min(100, Math.max(0, Math.round(spendScore + freqScore + recencyScore + engagementScore)));

  return {
    score: totalScore,
    breakdown: {
      spendScore: Math.round(spendScore),
      freqScore: Math.round(freqScore),
      recencyScore: Math.round(recencyScore),
      engagementScore: Math.round(engagementScore),
    },
  };
}

/**
 * Classifies customer based strictly on customer score ranges:
 * 80–100 → High Value
 * 60–79  → Loyal
 * 40–59  → Regular
 * 20–39  → New / Potential
 * 0–19   → At Risk
 */
export function classifyCustomer(customer: Omit<Customer, 'segment' | 'engagementScore' | 'explanation'>): {
  segment: SegmentType;
  engagementScore: number;
  explanation: string[];
} {
  const daysAgo = getDaysSinceLastPurchase(customer.lastPurchaseDate);
  const { score, breakdown } = calculateCustomerScore(customer);

  let segment: SegmentType = 'At Risk';
  const explanation: string[] = [];

  explanation.push(`Overall Customer Score: ${score}/100.`);

  if (score >= 80) {
    segment = 'High Value';
    explanation.push(`Score falls in the 80–100 range (High Value Tier).`);
    explanation.push(`Strong spend points (${breakdown.spendScore}/30) & order frequency (${breakdown.freqScore}/25).`);
  } else if (score >= 60) {
    segment = 'Loyal';
    explanation.push(`Score falls in the 60–79 range (Loyal Customer Tier).`);
    explanation.push(`Consistent order frequency (${breakdown.freqScore}/25) with recent activity (${daysAgo} days ago).`);
  } else if (score >= 40) {
    segment = 'Regular';
    explanation.push(`Score falls in the 40–59 range (Regular Active Tier).`);
    explanation.push(`Balanced spend ($${customer.totalSpent.toLocaleString()}) and engagement metrics.`);
  } else if (score >= 20) {
    segment = 'New / Potential';
    explanation.push(`Score falls in the 20–39 range (New / Potential Segment).`);
    explanation.push(`Early lifecycle phase with ${customer.purchaseCount} order(s) and growth potential.`);
  } else {
    segment = 'At Risk';
    explanation.push(`Score falls in the 0–19 range (At Risk / Churn Segment).`);
    explanation.push(`Extended inactivity (${daysAgo} days since last purchase) & low digital engagement.`);
  }

  return {
    segment,
    engagementScore: score,
    explanation,
  };
}
