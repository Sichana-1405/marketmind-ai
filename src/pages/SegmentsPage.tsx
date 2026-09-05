import React, { useState, useEffect } from 'react';
import { HelpCircle, ArrowRight, ShieldCheck, DollarSign, ShoppingBag, Activity } from 'lucide-react';
import { Customer, SegmentType, SegmentInfo } from '../types/customer';
import { storageService } from '../services/storageService';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const SegmentsPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomers(storageService.getCustomers());
  }, []);

  const total = customers.length || 1;

  const segmentDefinitions: Record<SegmentType, Omit<SegmentInfo, 'name' | 'count' | 'percentage' | 'avgSpent' | 'avgPurchases'>> = {
    'High Value': {
      description: 'Top revenue drivers with overall score between 80 and 100.',
      criteria: 'Overall Customer Score: 80 – 100',
      engagementLevel: 'High',
      recommendedAction: 'VIP Concierge, exclusive preview access, early product drops, private rewards.',
      whyExplanation: [
        'Overall Customer Score strictly in the 80–100 range.',
        'Maximum spend points and purchase frequency.',
        'Active digital engagement across email clicks and site visits.',
      ],
    },
    Loyal: {
      description: 'Frequent repeat purchasers with overall score between 60 and 79.',
      criteria: 'Overall Customer Score: 60 – 79',
      engagementLevel: 'High',
      recommendedAction: 'Loyalty point multipliers, subscription incentives, brand ambassador invitations.',
      whyExplanation: [
        'Overall Customer Score strictly in the 60–79 range.',
        'Consistent order frequency with recent activity.',
      ],
    },
    Regular: {
      description: 'Core active customer base with overall score between 40 and 59.',
      criteria: 'Overall Customer Score: 40 – 59',
      engagementLevel: 'Medium',
      recommendedAction: 'Cross-sell complementary items, seasonal promotional campaigns, product reviews.',
      whyExplanation: [
        'Overall Customer Score strictly in the 40–59 range.',
        'Balanced spend and order frequency metrics.',
      ],
    },
    'New / Potential': {
      description: 'Recently acquired or growing accounts with overall score between 20 and 39.',
      criteria: 'Overall Customer Score: 20 – 39',
      engagementLevel: 'Medium',
      recommendedAction: 'Welcome email series, product setup guides, second purchase discount code.',
      whyExplanation: [
        'Overall Customer Score strictly in the 20–39 range.',
        'Undergoing early onboarding with growth upside.',
      ],
    },
    'At Risk': {
      description: 'Inactive buyers showing signs of churn with overall score between 0 and 19.',
      criteria: 'Overall Customer Score: 0 – 19',
      engagementLevel: 'Low',
      recommendedAction: 'Win-back campaigns, feedback surveys, deep discount win-back incentives.',
      whyExplanation: [
        'Overall Customer Score strictly in the 0–19 range.',
        'Extended inactivity period and low digital interaction.',
      ],
    },
  };

  const segmentsList: SegmentInfo[] = (['High Value', 'Loyal', 'Regular', 'New / Potential', 'At Risk'] as SegmentType[]).map(
    (name) => {
      const segCustomers = customers.filter((c) => c.segment === name);
      const count = segCustomers.length;
      const percentage = Math.round((count / total) * 100);
      const avgSpent = Math.round(
        count > 0 ? segCustomers.reduce((a, b) => a + b.totalSpent, 0) / count : 0
      );
      const avgPurchases = Number(
        (count > 0 ? segCustomers.reduce((a, b) => a + b.purchaseCount, 0) / count : 0).toFixed(1)
      );

      return {
        name,
        count,
        percentage,
        avgSpent,
        avgPurchases,
        ...segmentDefinitions[name],
      };
    }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Segments & Explainability</h1>
          <p className="text-xs text-slate-500 mt-1">
            Understand behavioral clusters, underlying RFM logic, and recommended actions.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Deterministic Algorithm Active</span>
        </div>
      </div>

      {/* Segments Cards */}
      <div className="space-y-6">
        {segmentsList.map((seg) => (
          <Card key={seg.name} className="space-y-4 border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Badge variant={seg.name} size="md">
                  {seg.name}
                </Badge>
                <h3 className="text-lg font-bold text-slate-900">{seg.name} Segment</h3>
                <span className="text-xs text-slate-400 font-mono">
                  ({seg.count} customers • {seg.percentage}% of total)
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1 text-emerald-600">
                  <DollarSign className="w-3.5 h-3.5" /> Avg Spend: <span className="font-bold text-slate-900">₹{seg.avgSpent.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-brand-600">
                  <ShoppingBag className="w-3.5 h-3.5" /> Avg Orders: <span className="font-bold text-slate-900">{seg.avgPurchases}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600">{seg.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recommended Action */}
              <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-brand-600" /> Recommended Action Strategy
                </span>
                <p className="text-xs text-slate-700 font-medium">{seg.recommendedAction}</p>
              </div>

              {/* Criteria */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-slate-400" /> Exact Qualification Rules
                </span>
                <p className="text-xs text-slate-500 font-mono">{seg.criteria}</p>
              </div>
            </div>

            {/* Why This Segment Section */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-brand-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-600" />
                Why this segment? (Transparent Explanation Factors)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {seg.whyExplanation.map((exp, idx) => (
                  <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-600">
                    • {exp}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
