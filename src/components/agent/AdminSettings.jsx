import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useMarketplace } from '../../hooks/useMarketplace';

export default function AdminSettings({ currentAgent }) {
  const { pricing, updatePricing } = useMarketplace(currentAgent?.id);
  const [localPricing, setLocalPricing] = useState(pricing);
  const [saved, setSaved] = useState(false);

  // If not admin, shouldn't even render, but just in case:
  if (currentAgent?.role !== 'admin') {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center h-full">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500">You must be an administrator to view this page.</p>
      </div>
    );
  }

  const handleSave = () => {
    updatePricing(localPricing);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateTierPrice = (id, newPrice) => {
    setLocalPricing(prev => ({
      ...prev,
      tiers: prev.tiers.map(t => t.id === id ? { ...t, price: Number(newPrice) } : t)
    }));
  };

  const updateServicePrice = (id, newPrice) => {
    setLocalPricing(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, price: Number(newPrice) } : s)
    }));
  };

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" /> Admin Global Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure pricing for the Agent Marketplace.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${
            saved ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'btn-primary'
          }`}
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      {/* Lead Tiers Pricing */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="font-extrabold text-slate-900">Lead Package Pricing (Weekly)</h2>
        </div>
        <div className="p-6 space-y-4">
          {localPricing.tiers.map(tier => (
            <div key={tier.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <div>
                <div className="font-bold text-slate-900">{tier.name}</div>
                <div className="text-xs text-slate-500">{tier.leads} Leads / Week</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">$</span>
                <input 
                  type="number" 
                  value={tier.price} 
                  onChange={(e) => updateTierPrice(tier.id, e.target.value)}
                  className="input-senior text-sm w-32 font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Pricing */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="font-extrabold text-slate-900">Agent Services Pricing (One-Time)</h2>
        </div>
        <div className="p-6 space-y-4">
          {localPricing.services.map(srv => (
            <div key={srv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50">
              <div>
                <div className="font-bold text-slate-900">{srv.name}</div>
                <div className="text-xs text-slate-500">{srv.type} payment</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">$</span>
                <input 
                  type="number" 
                  value={srv.price} 
                  onChange={(e) => updateServicePrice(srv.id, e.target.value)}
                  className="input-senior text-sm w-32 font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
