import React, { useState } from 'react';
import { Settings, Save, RefreshCcw, Database, Palette } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { storageService } from '../services/storageService';

export const SettingsPage: React.FC = () => {
  const [businessName, setBusinessName] = useState('Acme Commerce');
  const [industry, setIndustry] = useState('E-Commerce & Retail');
  const [currency, setCurrency] = useState('INR (₹)');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset customer data back to initial mock dataset?')) {
      storageService.resetToDefault();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage business profile, browser storage preferences, and system defaults.
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Business Profile */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings className="w-4 h-4 text-brand-600" />
            Business Profile & Workspace
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company / Workspace Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="SaaS & Digital Products">SaaS & Digital Products</option>
                  <option value="Consumer Brands">Consumer Brands</option>
                  <option value="Financial Services">Financial Services</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Base Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedMessage ? (
                <span className="text-emerald-600 font-medium">Settings saved successfully!</span>
              ) : <div />}
              <Button variant="primary" size="sm" type="submit" icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Data Storage Management */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="w-4 h-4 text-emerald-600" />
            LocalStorage Data Preferences
          </h3>

          <p className="text-xs text-slate-500">
            MarketMind AI processes customer datasets locally inside your browser storage for high performance and privacy compliance.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-900">Reset Mock Dataset</p>
              <p className="text-[11px] text-slate-400">Restore the default 105 customer benchmark dataset.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<RefreshCcw className="w-4 h-4" />}
              onClick={handleResetData}
            >
              Reset Data
            </Button>
          </div>
        </Card>

        {/* UI Theme */}
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Palette className="w-4 h-4 text-brand-600" />
            UI Theme & Preferences
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Appearance Theme</p>
                <p className="text-slate-400">Professional Blue + White SaaS Palette</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-brand-50 text-brand-700 font-semibold border border-brand-200">
                Light Mode (Active)
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-semibold text-slate-900">At-Risk Churn Alerts</p>
                <p className="text-slate-400">Highlight high risk customer drops automatically</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-brand-600 w-4 h-4 rounded cursor-pointer" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
