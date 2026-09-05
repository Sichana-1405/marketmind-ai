import React, { useState, useEffect } from 'react';
import { Plus, Megaphone, Trash2, Eye } from 'lucide-react';
import { Campaign, CampaignStatus } from '../types/campaign';
import { Customer } from '../types/customer';
import { storageService } from '../services/storageService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { CampaignCreatorModal } from '../components/campaigns/CampaignCreatorModal';
import { CampaignPreviewCard } from '../components/campaigns/CampaignPreviewCard';

export const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState<CampaignStatus | 'All'>('All');

  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [selectedPreviewCampaign, setSelectedPreviewCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    setCampaigns(storageService.getSavedCampaigns());
    setCustomers(storageService.getCustomers());
  }, []);

  const handleSaveNewCampaign = (newCamp: Campaign) => {
    const updated = storageService.saveCampaign(newCamp);
    setCampaigns(updated);
  };

  const handleStatusChange = (id: string, newStatus: CampaignStatus) => {
    const updated = storageService.updateCampaignStatus(id, newStatus);
    setCampaigns(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      const updated = storageService.deleteCampaign(id);
      setCampaigns(updated);
      if (selectedPreviewCampaign?.id === id) setSelectedPreviewCampaign(null);
    }
  };

  const filteredCampaigns = campaigns.filter(
    (c) => activeTab === 'All' || c.status === activeTab
  );

  const totalActive = campaigns.filter((c) => c.status === 'Active').length;
  const totalBudgetINR = campaigns.reduce((acc, c) => acc + c.budgetINR, 0);
  const totalEstRevenueINR = campaigns.reduce(
    (acc, c) => acc + (c.performance?.revenueINR || c.estimate.estimatedRevenueINR),
    0
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Marketing Campaign Generator & Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Segment-targeted campaigns designed to maximize retention, upsell, and re-engagement.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreatorOpen(true)}
        >
          Create Targeted Campaign
        </Button>
      </div>

      {/* Campaign KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Active Campaigns</p>
          <p className="text-2xl font-extrabold text-slate-900">{totalActive} Active</p>
          <p className="text-xs text-slate-400">{campaigns.length} total saved campaigns</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Campaign Budget</p>
          <p className="text-2xl font-extrabold text-brand-600">₹{totalBudgetINR.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Allocated across segments</p>
        </Card>
        <Card className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Estimated Revenue Generated</p>
          <p className="text-2xl font-extrabold text-emerald-600">₹{totalEstRevenueINR.toLocaleString()}</p>
          <p className="text-xs text-slate-400">Deterministic ROI impact projection</p>
        </Card>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-200">
        {(['All', 'Active', 'Ready', 'Draft', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {tab} {tab !== 'All' && `(${campaigns.filter((c) => c.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="w-8 h-8" />}
          title="No campaigns found"
          description="Create a new targeted campaign using the 7-step Campaign Creator wizard."
          actionLabel="Create Campaign"
          onAction={() => setIsCreatorOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => (
            <Card key={camp.id} hoverEffect className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={camp.targetSegment}>{camp.targetSegment}</Badge>
                  <select
                    value={camp.status}
                    onChange={(e) => handleStatusChange(camp.id, e.target.value as CampaignStatus)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border focus:outline-none bg-white cursor-pointer ${
                      camp.status === 'Active'
                        ? 'text-emerald-700 border-emerald-200 bg-emerald-50'
                        : camp.status === 'Ready'
                        ? 'text-brand-700 border-brand-200 bg-brand-50'
                        : camp.status === 'Completed'
                        ? 'text-sky-700 border-sky-200 bg-sky-50'
                        : 'text-slate-500 border-slate-200'
                    }`}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Ready">Ready</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{camp.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{camp.strategySummary}</p>

                {/* Offer & Channel info */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Channel: <strong className="text-brand-600">{camp.recommendedChannel}</strong></span>
                    <span>Budget: <strong className="text-slate-700">₹{camp.budgetINR.toLocaleString()}</strong></span>
                  </div>
                  <p className="text-slate-700 text-[11px] font-medium bg-white p-2 rounded border border-slate-100">
                    🎁 {camp.recommendedOffer}
                  </p>
                </div>
              </div>

              {/* Estimate / Performance Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
                    <p className="text-[10px] text-slate-400">Audience</p>
                    <p className="font-bold text-slate-900 mt-0.5">{camp.estimate.estimatedAudience}</p>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
                    <p className="text-[10px] text-slate-400">Est. Conv</p>
                    <p className="font-bold text-emerald-600 mt-0.5">{camp.estimate.estimatedConversions}</p>
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-200">
                    <p className="text-[10px] text-slate-400">Est. Revenue</p>
                    <p className="font-bold text-brand-600 mt-0.5">₹{(camp.performance?.revenueINR || camp.estimate.estimatedRevenueINR).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => setSelectedPreviewCampaign(camp)}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => handleDelete(camp.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 7-Step Campaign Creator Wizard Modal */}
      <CampaignCreatorModal
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        customers={customers}
        onSaveCampaign={handleSaveNewCampaign}
      />

      {/* Single Campaign Full Preview Modal */}
      {selectedPreviewCampaign && (
        <Modal
          isOpen={!!selectedPreviewCampaign}
          onClose={() => setSelectedPreviewCampaign(null)}
          title={`Campaign Preview: ${selectedPreviewCampaign.title}`}
          subtitle={`ID: ${selectedPreviewCampaign.id} • Target: ${selectedPreviewCampaign.targetSegment}`}
          maxWidth="xl"
        >
          <CampaignPreviewCard
            campaign={selectedPreviewCampaign}
            onSave={() => {
              handleStatusChange(selectedPreviewCampaign.id, 'Active');
              setSelectedPreviewCampaign(null);
            }}
            isSaved={selectedPreviewCampaign.status === 'Active'}
          />
        </Modal>
      )}
    </div>
  );
};
