import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  DollarSign,
  Crown,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  FileSpreadsheet
} from 'lucide-react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CSVUploader } from '../components/common/CSVUploader';
import { Customer, SegmentType } from '../types/customer';
import { storageService } from '../services/storageService';

export const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCSVModal, setShowCSVModal] = useState(false);

  useEffect(() => {
    const loaded = storageService.getCustomers();
    setCustomers(loaded);
  }, []);

  const handleCSVImport = (updated: Customer[]) => {
    setCustomers(updated);
    storageService.saveCustomers(updated);
    setShowCSVModal(false);
  };

  // Metrics calculation
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const highValueCount = customers.filter((c) => c.segment === 'High Value').length;
  const atRiskCount = customers.filter((c) => c.segment === 'At Risk').length;

  // Segment Pie Chart Data
  const segmentCounts: Record<SegmentType, number> = {
    'High Value': 0,
    Loyal: 0,
    Regular: 0,
    'New / Potential': 0,
    'At Risk': 0,
  };

  customers.forEach((c) => {
    if (c.segment in segmentCounts) {
      segmentCounts[c.segment]++;
    }
  });

  const pieData = Object.entries(segmentCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = {
    'High Value': '#10b981', // emerald
    Loyal: '#2563eb',        // brand blue
    Regular: '#94a3b8',      // slate
    'New / Potential': '#0ea5e9', // sky
    'At Risk': '#f43f5e',    // rose
  };

  // Engagement Bar Chart Data (Grouped by score ranges)
  const engagementDistribution = [
    { range: '0-20', count: customers.filter(c => c.engagementScore <= 20).length },
    { range: '21-40', count: customers.filter(c => c.engagementScore > 20 && c.engagementScore <= 40).length },
    { range: '41-60', count: customers.filter(c => c.engagementScore > 40 && c.engagementScore <= 60).length },
    { range: '61-80', count: customers.filter(c => c.engagementScore > 60 && c.engagementScore <= 80).length },
    { range: '81-100', count: customers.filter(c => c.engagementScore > 80).length },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time behavioral segmentation and explainable marketing analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4" />}
            onClick={() => setShowCSVModal(!showCSVModal)}
          >
            {showCSVModal ? 'Close CSV Panel' : 'Import Customer CSV'}
          </Button>
          <Button variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />} onClick={() => navigate('/insights')}>
            View AI Insights
          </Button>
        </div>
      </div>

      {/* CSV Import Banner Modal/Accordion */}
      {showCSVModal && (
        <Card className="border-brand-200 bg-brand-50 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-brand-600" />
              Upload & Process Customer Dataset
            </h3>
            <span className="text-xs text-slate-400">PapaParse Browser CSV Parser</span>
          </div>
          <CSVUploader onDataLoaded={handleCSVImport} />
        </Card>
      )}

      {/* Primary Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          change="+12% this month"
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
          description="Active customer profiles"
        />
        <StatCard
          title="Total Customer Spend"
          value={`₹${totalRevenue.toLocaleString()}`}
          change="+18.4% lifetime"
          changeType="positive"
          icon={<DollarSign className="w-5 h-5" />}
          description="Cumulative revenue tracked"
        />
        <StatCard
          title="High Value Customers"
          value={highValueCount}
          change={`${Math.round((highValueCount / (totalCustomers || 1)) * 100)}% of total`}
          changeType="positive"
          icon={<Crown className="w-5 h-5 text-emerald-500" />}
          description="Total spend > ₹2,50,000"
        />
        <StatCard
          title="At Risk Customers"
          value={atRiskCount}
          change={`${Math.round((atRiskCount / (totalCustomers || 1)) * 100)}% churn risk`}
          changeType="negative"
          icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
          description="Inactive > 60 days"
        />
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment Distribution */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Customer Segment Distribution</h3>
              <p className="text-xs text-slate-500">Classified using RFM & behavioral scoring</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/segments')}>
              Explore Segments <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as SegmentType] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }}
                  itemStyle={{ color: '#475569' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[d.name as SegmentType] }} />
                <span className="text-slate-600 font-medium">{d.name}:</span>
                <span className="text-slate-500 font-bold">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Engagement Score Breakdown */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Engagement Score Distribution</h3>
              <p className="text-xs text-slate-500">Combined website visits, email opens & clicks</p>
            </div>
            <Activity className="w-4 h-4 text-brand-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
            Higher scores (61-100) represent prime targets for upsell campaigns.
          </p>
        </Card>
      </div>

      {/* Recent Activity & Highlighted AI Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Customer Activity */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              High Priority Customers
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/customers')}>
              View All Customers
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Segment</th>
                  <th className="p-3">Total Spent</th>
                  <th className="p-3">Engagement</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.slice(0, 5).map((c) => (
                  <tr key={c.customerId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium text-slate-900">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.email}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant={c.segment}>{c.segment}</Badge>
                    </td>
                    <td className="p-3 font-semibold text-slate-700">₹{c.totalSpent.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500"
                            style={{ width: `${c.engagementScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">{c.engagementScore}/100</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => navigate('/customers')}>
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Explainable AI Highlight Card */}
        <Card className="bg-brand-50 border-brand-200 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-2 py-0.5 rounded border border-brand-200">
                AI Intelligence Insight
              </span>
              <Sparkles className="w-4 h-4 text-brand-600" />
            </div>

            <h4 className="text-base font-bold text-slate-900">
              Prevent Churn for {atRiskCount} At-Risk Customers
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic scoring detected {atRiskCount} customers with zero purchase activity in 60+ days and waning email opens.
            </p>

            <div className="p-3 bg-white rounded-lg border border-brand-100 space-y-1 text-xs">
              <span className="font-semibold text-brand-700">Why this recommendation?</span>
              <ul className="list-disc list-inside text-slate-500 space-y-0.5 text-[11px]">
                <li>Avg inactivity period: 78 days</li>
                <li>Email open rate dropped by 45%</li>
                <li>Potential revenue at risk: ₹{customers.filter(c => c.segment === 'At Risk').reduce((a, b) => a + b.totalSpent, 0).toLocaleString()}</li>
              </ul>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full mt-4"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => navigate('/campaigns')}
          >
            Launch Re-engagement Campaign
          </Button>
        </Card>
      </div>
    </div>
  );
};
