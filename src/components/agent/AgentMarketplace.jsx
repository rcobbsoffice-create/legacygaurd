import React, { useState } from 'react';
import { ShoppingCart, Star, Zap, Crown, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../hooks/useMarketplace';
import CheckoutModal from './CheckoutModal';

export default function AgentMarketplace({ currentAgent }) {
  const { pricing, agentPurchases, purchaseItem } = useMarketplace(currentAgent?.id);
  const [checkoutItem, setCheckoutItem] = useState(null);

  const TIER_ICONS = { tier_starter: Star, tier_pro: Zap, tier_elite: Crown };
  const TIER_COLORS = { 
    tier_starter: 'from-slate-100 to-slate-200 text-slate-800 border-slate-300', 
    tier_pro: 'from-amber-100 to-amber-200 text-amber-900 border-amber-400', 
    tier_elite: 'from-emerald-800 to-emerald-950 text-emerald-100 border-emerald-950' 
  };

  const handlePurchaseComplete = (item) => {
    purchaseItem(item.leads ? 'tier' : 'service', item.id);
    setCheckoutItem(null);
  };

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 text-amber-400 font-black tracking-widest text-xs mb-3">
            <ShoppingCart className="w-4 h-4" /> AGENT MARKETPLACE
          </div>
          <h1 className="brand-serif text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">Grow Your Business. <br/><span className="text-emerald-400">Own Your Leads.</span></h1>
          <p className="text-slate-300 text-base sm:text-lg">Subscribe to exclusive lead packages or upgrade your professional image with custom funnels and business cards.</p>
        </div>
        
        <div className="relative z-10 shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center w-full sm:w-auto min-w-[200px]">
          <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider mb-2">Current Tier</div>
          {agentPurchases.tier ? (
            <div className="text-2xl font-black text-amber-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-6 h-6" /> {pricing.tiers.find(t => t.id === agentPurchases.tier)?.name}
            </div>
          ) : (
            <div className="text-xl font-bold text-white">Free Agent</div>
          )}
        </div>
      </div>

      {/* Lead Packages */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Weekly Lead Packages</h2>
          <p className="text-slate-500">Exclusive, high-intent leads delivered directly to your CRM every week.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricing.tiers.map(tier => {
            const Icon = TIER_ICONS[tier.id] || Star;
            const colors = TIER_COLORS[tier.id];
            const isCurrent = agentPurchases.tier === tier.id;
            
            return (
              <div key={tier.id} className={`rounded-3xl border-2 flex flex-col overflow-hidden transition-transform hover:-translate-y-1 ${colors} ${isCurrent ? 'ring-4 ring-emerald-500/50' : ''}`}>
                <div className={`p-6 sm:p-8 bg-gradient-to-br ${colors} border-b border-black/10`}>
                  <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-2xl mb-1">{tier.name}</h3>
                  <p className="text-sm opacity-80">{tier.desc}</p>
                </div>
                
                <div className="p-6 sm:p-8 bg-white text-slate-900 flex-1 flex flex-col">
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-black">${tier.price}</span>
                    <span className="text-slate-500 font-bold mb-1">/wk</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-1">
                    <li className="flex items-center gap-2 font-bold text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {tier.leads} Exclusive Leads/wk</li>
                    <li className="flex items-center gap-2 font-bold text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real-time delivery to CRM</li>
                    <li className="flex items-center gap-2 font-bold text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-line filter support</li>
                  </ul>
                  
                  <button 
                    disabled={isCurrent}
                    onClick={() => setCheckoutItem(tier)}
                    className={`w-full py-3.5 rounded-full font-black text-sm transition-all ${
                      isCurrent 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200' 
                        : tier.id === 'tier_elite' ? 'bg-emerald-950 text-amber-400 hover:bg-emerald-900 shadow-xl' : 'btn-gold shadow-xl'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : 'Select Package'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Agent Services */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Agent Services & Upgrades</h2>
          <p className="text-slate-500">Build your brand and establish trust with clients.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricing.services.map(srv => {
            const isPurchased = agentPurchases.services.includes(srv.id);
            return (
              <div key={srv.id} className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col relative overflow-hidden">
                {isPurchased && (
                  <div className="absolute top-4 right-4 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2">{srv.name}</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1">{srv.desc}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-lg font-black text-emerald-800">${srv.price}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{srv.type}</div>
                  </div>
                  <button 
                    disabled={isPurchased}
                    onClick={() => setCheckoutItem(srv)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                      isPurchased ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isPurchased ? 'Purchased' : 'Buy Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {checkoutItem && (
        <CheckoutModal 
          item={checkoutItem} 
          onClose={() => setCheckoutItem(null)} 
          onConfirm={handlePurchaseComplete} 
        />
      )}

    </div>
  );
}
