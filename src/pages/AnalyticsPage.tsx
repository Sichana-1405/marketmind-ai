import React from 'react';
import { TrendingUp, DollarSign, Target, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';

const revenueGrowthData = [
  { month: 'Mar', revenue: 1450000, customers: 45, conversion: 3.2 },
  { month: 'Apr', revenue: 1820000, customers: 58, conversion: 3.6 },
  { month: 'May', revenue: 2480000, customers: 72, conversion: 4.1 },
  { month: 'Jun', revenue: 3100000, customers: 86, conversion: 4.5 },
  { month: 'Jul', revenue: 3840000, customers: 98, conversion: 4.8 },
  { month: 'Aug', revenue: 4680000, customers: 105, conversion: 5.2 },
];

const segmentPerformanceData = [
  { segment: 'High Value', avgOrder: 24500, ltv: 345000, retention: 92 },
  { segment: 'Loyal', avgOrder: 15200, ltv: 195000, retention: 84 },
  { segment: 'Regular', avgOrder: 11500, ltv: 98000, retention: 68 },
  { segment: 'New / Potential', avgOrder: 13800, ltv: 24500, retention: 55 },
  { segment: 'At Risk', avgOrder: 10200, ltv: 135000, retention: 18 },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Performance Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Historical revenue trajectories, segment unit economics, and campaign conversion rates.
          </p>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Growth Rate"
          value="22.3%"
          change="+4.1% vs Q2"
          changeType="positive"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Avg Order Value"
          value="₹14,850"
          change="+₹1,420"
          changeType="positive"
          icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
        />
        <StatCard
          title="Conversion Rate"
          value="5.2%"
          change="+0.7%"
          changeType="positive"
          icon={<Target className="w-5 h-5 text-brand-500" />}
        />
        <StatCard
          title="Avg Customer LTV"
          value="₹1,62,000"
          change="Top 10% = ₹3.8L"
          changeType="neutral"
          icon={<Activity className="w-5 h-5 text-sky-500" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Trend */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cumulative Revenue Trajectory (₹)</h3>
              <p className="text-xs text-slate-500">Monthly revenue growth across active customer segments</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueGrowthData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Segment LTV & Retention */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Segment LTV (₹) & Retention Rate (%)</h3>
              <p className="text-xs text-slate-500">Comparing customer lifetime value vs 90-day retention</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={segmentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="segment" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                <Bar dataKey="ltv" name="Avg LTV (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retention" name="Retention Rate (%)" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
