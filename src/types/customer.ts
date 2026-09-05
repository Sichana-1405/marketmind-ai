export type SegmentType = 'High Value' | 'Loyal' | 'Regular' | 'New / Potential' | 'At Risk';

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  age: number;
  location: string;
  totalSpent: number; // in INR (₹)
  purchaseCount: number;
  lastPurchaseDate: string; // YYYY-MM-DD
  websiteVisits: number;
  emailOpens: number;
  emailClicks: number;
  engagementScore: number; // 0 - 100
  segment: SegmentType;
  explanation?: string[];
}

export interface SegmentInfo {
  name: SegmentType;
  description: string;
  criteria: string;
  count: number;
  percentage: number;
  avgSpent: number;
  avgPurchases: number;
  engagementLevel: 'High' | 'Medium' | 'Low';
  recommendedAction: string;
  whyExplanation: string[];
}

export interface DashboardStats {
  totalCustomers: number;
  totalRevenue: number;
  avgOrderValue: number;
  highValueCount: number;
  atRiskCount: number;
  segmentCounts: Record<SegmentType, number>;
}
