import { Customer } from '../types/customer';
import { Campaign, CampaignStatus } from '../types/campaign';
import { initialCustomers } from '../data/mockCustomers';

const CUSTOMERS_KEY = 'marketmind_customers_v1';
const CAMPAIGNS_KEY = 'marketmind_campaigns_v1';

const defaultSeedCampaigns: Campaign[] = [
  {
    id: 'CAMP-101',
    title: 'Q3 High Value VIP Appreciation',
    targetSegment: 'High Value',
    goal: 'Improve retention',
    budgetINR: 150000,
    recommendedChannel: 'Email',
    recommendedOffer: 'Flat ₹2,500 VIP Gift Credit + Free Express Shipping',
    status: 'Active',
    createdAt: '2026-08-15',
    strategySummary: 'Deliver exclusive VIP benefits and private preview access to upcoming high-margin product drops.',
    suggestedMessage: 'As one of our most valued partners, enjoy an exclusive ₹2,500 credit storewide plus dedicated VIP concierge support.',
    callToAction: 'Claim VIP Pass',
    reasons: [
      'High Value customers represent top revenue tier.',
      'Average lifetime spend is above ₹2,500,00 scale.',
      'Active digital engagement across email clicks and site visits.',
    ],
    estimate: {
      estimatedAudience: 18,
      estimatedReach: 17,
      estimatedEngagementPct: 78,
      estimatedConversions: 7,
      estimatedRevenueINR: 185000,
      confidenceNote: 'ESTIMATED projection based on segment historical RFM & engagement baseline.',
    },
    performance: {
      reach: 18,
      conversions: 7,
      revenueINR: 185000,
    },
  },
  {
    id: 'CAMP-102',
    title: 'At-Risk Win-Back Re-engagement',
    targetSegment: 'At Risk',
    goal: 'Re-engage customers',
    budgetINR: 75000,
    recommendedChannel: 'SMS',
    recommendedOffer: '20% OFF Re-activation Discount Code',
    status: 'Active',
    createdAt: '2026-08-20',
    strategySummary: 'Trigger automated SMS with an urgent discount code for customers inactive > 60 days.',
    suggestedMessage: 'We miss you! Take 20% OFF your next order with code COMEBACK20. Valid for the next 48 hours.',
    callToAction: 'Re-activate Account',
    reasons: [
      'At Risk customers have not purchased in over 60 days.',
      'Average recency is elevated across segment.',
      'High historical repeat potential upon re-engagement.',
    ],
    estimate: {
      estimatedAudience: 14,
      estimatedReach: 14,
      estimatedEngagementPct: 42,
      estimatedConversions: 3,
      estimatedRevenueINR: 48000,
      confidenceNote: 'ESTIMATED projection based on segment historical RFM & engagement baseline.',
    },
    performance: {
      reach: 14,
      conversions: 3,
      revenueINR: 48000,
    },
  },
  {
    id: 'CAMP-103',
    title: 'New / Potential Onboarding Nurture',
    targetSegment: 'New / Potential',
    goal: 'Onboarding',
    budgetINR: 45000,
    recommendedChannel: 'WhatsApp',
    recommendedOffer: 'Flat ₹500 OFF Second Order over ₹1,500',
    status: 'Completed',
    createdAt: '2026-07-01',
    strategySummary: 'Educational onboarding sequence followed by a second purchase discount code.',
    suggestedMessage: 'Welcome to Acme Commerce! Here are 3 tips to get the most out of your purchase today.',
    callToAction: 'Claim ₹500 Voucher',
    reasons: [
      'Recently acquired accounts undergoing early trial.',
      'Accelerates conversion from first to second order.',
    ],
    estimate: {
      estimatedAudience: 20,
      estimatedReach: 19,
      estimatedEngagementPct: 65,
      estimatedConversions: 8,
      estimatedRevenueINR: 62000,
      confidenceNote: 'ESTIMATED projection based on segment historical RFM & engagement baseline.',
    },
    performance: {
      reach: 20,
      conversions: 8,
      revenueINR: 62000,
    },
  },
];

export const storageService = {
  getCustomers(): Customer[] {
    try {
      const stored = localStorage.getItem(CUSTOMERS_KEY);
      if (!stored) {
        this.saveCustomers(initialCustomers);
        return initialCustomers;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load customers from localStorage', e);
      return initialCustomers;
    }
  },

  saveCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers to localStorage', e);
    }
  },

  getSavedCampaigns(): Campaign[] {
    try {
      const stored = localStorage.getItem(CAMPAIGNS_KEY);
      if (!stored) {
        this.saveCampaigns(defaultSeedCampaigns);
        return defaultSeedCampaigns;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load campaigns from localStorage', e);
      return defaultSeedCampaigns;
    }
  },

  saveCampaigns(campaigns: Campaign[]): void {
    try {
      localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
    } catch (e) {
      console.error('Failed to save campaigns to localStorage', e);
    }
  },

  saveCampaign(newCampaign: Campaign): Campaign[] {
    const existing = this.getSavedCampaigns();
    const updated = [newCampaign, ...existing.filter((c) => c.id !== newCampaign.id)];
    this.saveCampaigns(updated);
    return updated;
  },

  updateCampaignStatus(campaignId: string, status: CampaignStatus): Campaign[] {
    const existing = this.getSavedCampaigns();
    const updated = existing.map((c) => (c.id === campaignId ? { ...c, status } : c));
    this.saveCampaigns(updated);
    return updated;
  },

  deleteCampaign(campaignId: string): Campaign[] {
    const existing = this.getSavedCampaigns();
    const updated = existing.filter((c) => c.id !== campaignId);
    this.saveCampaigns(updated);
    return updated;
  },

  resetToDefault(): Customer[] {
    this.saveCustomers(initialCustomers);
    this.saveCampaigns(defaultSeedCampaigns);
    return initialCustomers;
  },
};
