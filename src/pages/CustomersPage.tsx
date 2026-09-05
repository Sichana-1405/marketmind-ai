import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, ChevronRight, UserCheck, Activity } from 'lucide-react';
import { Customer, SegmentType } from '../types/customer';
import { storageService } from '../services/storageService';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<SegmentType | 'All'>('All');
  const [sortField, setSortField] = useState<'totalSpent' | 'purchaseCount' | 'engagementScore' | 'name'>('totalSpent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    setCustomers(storageService.getCustomers());
  }, []);

  // Filter & Search Logic
  const filteredCustomers = customers
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSegment = selectedSegment === 'All' || c.segment === selectedSegment;
      return matchesSearch && matchesSegment;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Database</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse, search, and analyze individual customer profiles and segment rationale.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          Total Records: <span className="text-slate-900 font-bold">{filteredCustomers.length}</span> / {customers.length}
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Segment Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          {(['All', 'High Value', 'Loyal', 'Regular', 'New / Potential', 'At Risk'] as const).map((seg) => (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedSegment === seg
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </Card>

      {/* Customer Data Table */}
      <Card className="overflow-hidden p-0">
        {filteredCustomers.length === 0 ? (
          <EmptyState
            icon={<UserCheck className="w-8 h-8" />}
            title="No matching customers found"
            description="Try adjusting your search criteria or segment filter."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedSegment('All');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Segment</th>
                  <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => toggleSort('totalSpent')}>
                    <div className="flex items-center gap-1">
                      Total Spent <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => toggleSort('purchaseCount')}>
                    <div className="flex items-center gap-1">
                      Purchases <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Last Active</th>
                  <th className="p-3.5 cursor-pointer hover:text-slate-800" onClick={() => toggleSort('engagementScore')}>
                    <div className="flex items-center gap-1">
                      Engagement <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.customerId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.email}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant={c.segment}>{c.segment}</Badge>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">₹{c.totalSpent.toLocaleString()}</td>
                    <td className="p-3.5 font-medium text-slate-600">{c.purchaseCount} orders</td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">{c.lastPurchaseDate}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              c.engagementScore > 70
                                ? 'bg-emerald-500'
                                : c.engagementScore > 40
                                ? 'bg-brand-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${c.engagementScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">{c.engagementScore}/100</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<ChevronRight className="w-4 h-4" />}
                        onClick={() => setSelectedCustomer(c)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Analysis: ${selectedCustomer.name}`}
          subtitle={`ID: ${selectedCustomer.customerId} • ${selectedCustomer.location}`}
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs text-slate-500">Current Segment Classification</p>
                <div className="mt-1">
                  <Badge variant={selectedCustomer.segment} size="md">
                    {selectedCustomer.segment}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Engagement Score</p>
                <p className="text-xl font-mono font-bold text-brand-600">{selectedCustomer.engagementScore}/100</p>
              </div>
            </div>

            {/* Explainable AI Reason Block */}
            <div className="p-4 bg-brand-50 rounded-xl border border-brand-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-600" />
                Why this segment? (Deterministic Factor Rationale)
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedCustomer.explanation?.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded border border-brand-100">
                    <span className="text-brand-500 font-bold">•</span>
                    <span>{reason}</span>
                  </li>
                )) || <li>Criteria match standard RFM rules for this tier.</li>}
              </ul>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-400">Total Lifetime Spend</p>
                <p className="text-base font-bold text-slate-900 mt-1">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-400">Purchase Count</p>
                <p className="text-base font-bold text-slate-900 mt-1">{selectedCustomer.purchaseCount} orders</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-400">Last Purchase Date</p>
                <p className="text-base font-mono font-bold text-slate-900 mt-1">{selectedCustomer.lastPurchaseDate}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-400">Website Visits</p>
                <p className="text-base font-bold text-slate-900 mt-1">{selectedCustomer.websiteVisits} sessions</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-400">Email Opens</p>
                <p className="text-base font-bold text-slate-900 mt-1">{selectedCustomer.emailOpens} opens</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-400">Email Clicks</p>
                <p className="text-base font-bold text-slate-900 mt-1">{selectedCustomer.emailClicks} clicks</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedCustomer(null)}>
                Close Analysis
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
