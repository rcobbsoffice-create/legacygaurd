import React, { useState } from 'react';
import { Sparkles, Copy, Check, Target, BookOpen, ShieldCheck } from 'lucide-react';

export default function AdPlaybook() {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedVertical, setSelectedVertical] = useState('All');

  const adCampaigns = [
    {
      id: 'life-1',
      vertical: 'Life',
      title: 'State Burial Protection & Funeral Rate Lock',
      cpl: '$8.50 – $12.00 CPL',
      headline: 'ATTENTION SENIORS 50-80: 2026 Burial Protection Rates Locked',
      primaryText: `Seniors in your state may qualify for up to $25,000 in Whole Life Burial Coverage with NO medical exam required.\n\nFuneral costs have surged past $9,000. Lock in a guaranteed monthly rate with Lawrence Poole (Licensed Agent Since 1990) that NEVER increases as you age.\n\nTap below to check your rate in under 60 seconds.`,
      cta: 'Check Rate Eligibility',
      targeting: 'Age 50–78 | Location: VA, NC & Target States | Placement: Facebook Feed & Reels'
    },
    {
      id: 'auto-1',
      vertical: 'Auto',
      title: 'Auto Insurance Rate Relief & Multi-Car Bundle',
      cpl: '$10.00 – $16.00 CPL',
      headline: 'Drivers: Are You Overpaying On Auto Insurance? Check 2026 Rates',
      primaryText: `Car insurance rates went up again this year. But drivers with clean records can cut their monthly premiums by switching or bundling Auto + Home.\n\nLawrence Poole compares 20+ top carriers to find your lowest rate. Takes 60 seconds to check savings.\n\nClick below to get your free auto quote breakdown.`,
      cta: 'Get Free Auto Quote',
      targeting: 'Age 25–70 | Interest: Auto Insurance, Savings | Placement: Mobile Feed'
    },
    {
      id: 'home-1',
      vertical: 'Home',
      title: 'Homeowners Policy Rate Review & Bundle Discount',
      cpl: '$14.00 – $20.00 CPL',
      headline: 'Homeowners Alert: Cut Your Premium With Multi-Policy Bundle Credits',
      primaryText: `Don't let home insurance rate hikes eat your budget. Lawrence Poole has been helping homeowners since 1990 secure lower dwelling premiums and full coverage protection.\n\nBundle Home + Auto to save up to 28% off your annual bill.\n\nTap below for a quick 60-second home quote.`,
      cta: 'Check Home Rates',
      targeting: 'Homeowners Age 30–75 | Placement: Facebook & Instagram'
    },
    {
      id: 'annuity-1',
      vertical: 'Annuity',
      title: 'Protect 401(k) / IRA From Market Volatility (High Ticket)',
      cpl: '$35.00 – $65.00 CPL (High Value)',
      headline: 'Retirees 55-75: How To Protect Your 401(k) From Stock Market Drops',
      primaryText: `Worried about stock market crashes wiping out your hard-earned retirement savings?\n\nA Fixed Index Annuity guarantees ZERO principal loss during market downturns while providing tax-deferred growth and GUARANTEED LIFETIME INCOME.\n\nRequest your free 2026 Retirement Protection Guide from Lawrence Poole today.`,
      cta: 'Get Retirement Guide',
      targeting: 'Age 55–74 | Interests: 401(k), IRA, Retirement, AARP | Placement: Feed'
    },
    {
      id: 'medicare-1',
      vertical: 'Medicare',
      title: '2026 Medicare Advantage & Supplement Review',
      cpl: '$12.00 – $22.00 CPL',
      headline: 'Turning 65 Or On Medicare? Check Available Dental/Vision Benefits',
      primaryText: `Are you getting all the Medicare benefits you deserve? Depending on your zip code, you may be eligible for plans with $0 monthly premiums, prescription drug coverage, and dental/vision benefits.\n\nConsult with Lawrence Poole, independent licensed specialist since 1990.\n\nClick below to check plans in your area.`,
      cta: 'Check Medicare Plans',
      targeting: 'Age 64–79 | Interest: Medicare, Social Security | Placement: Feed'
    }
  ];

  const filteredCampaigns = adCampaigns.filter(ad => 
    selectedVertical === 'All' || ad.vertical === selectedVertical
  );

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-400/40 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3.5 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Lawrence Poole Multi-Line Campaign Kit
          </div>
          <h1 className="brand-serif text-3xl sm:text-4xl font-extrabold text-amber-300">
            Multi-Line Low-Cost Ad Playbook
          </h1>
          <p className="text-slate-300 text-base max-w-3xl">
            Copy and paste these ad copy templates into Meta Ads Manager to generate exclusive leads for Life, Home, Auto, Annuities, and Medicare directly to your web portal.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto bg-white p-3 rounded-xl border border-slate-200">
          <span className="text-xs font-extrabold text-slate-500 uppercase mr-2">Filter Line:</span>
          {['All', 'Life', 'Auto', 'Home', 'Annuity', 'Medicare'].map((vert) => (
            <button
              key={vert}
              onClick={() => setSelectedVertical(vert)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all ${
                selectedVertical === vert 
                  ? 'bg-emerald-900 text-amber-300 shadow-sm' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {vert}
            </button>
          ))}
        </div>

        {/* Campaigns List */}
        <div className="space-y-6">
          {filteredCampaigns.map((ad) => (
            <div key={ad.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-900 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded uppercase">
                      {ad.vertical}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900">{ad.title}</h3>
                  </div>
                  <p className="text-xs text-emerald-800 font-bold mt-1">Benchmark: {ad.cpl}</p>
                </div>

                <button 
                  onClick={() => handleCopy(ad.id, `${ad.headline}\n\n${ad.primaryText}`)}
                  className="btn-gold text-xs py-2 px-3.5 font-black"
                >
                  {copiedId === ad.id ? "Copied To Clipboard!" : "Copy Ad Text"}
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Facebook Headline</label>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-bold text-slate-900 text-base mt-1">
                    {ad.headline}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Ad Copy</label>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 text-sm whitespace-pre-line mt-1 font-normal leading-relaxed">
                    {ad.primaryText}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
