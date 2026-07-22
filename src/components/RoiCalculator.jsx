import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, ShieldCheck, ArrowRight, Award, PiggyBank } from 'lucide-react';

export default function RoiCalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState(100);
  const [imoLeadCost, setImoLeadCost] = useState(45);
  const [selfLeadCost, setSelfLeadCost] = useState(12);
  const [closeRate, setCloseRate] = useState(25); // 25%
  const [avgApv, setAvgApv] = useState(1100); // $1,100 average annualized premium
  const [commissionRate, setCommissionRate] = useState(110); // 110% contract level

  // Math Calculations
  const imoTotalSpend = monthlyLeads * imoLeadCost;
  const selfTotalSpend = monthlyLeads * selfLeadCost;
  const monthlySavings = imoTotalSpend - selfTotalSpend;
  const yearlySavings = monthlySavings * 12;

  const totalClosedPolicies = Math.round((monthlyLeads * (closeRate / 100)));
  const grossCommissionMonthly = totalClosedPolicies * avgApv * (commissionRate / 100);
  
  const imoNetProfitMonthly = grossCommissionMonthly - imoTotalSpend;
  const selfNetProfitMonthly = grossCommissionMonthly - selfTotalSpend;

  const selfRoiPercent = selfTotalSpend > 0 ? Math.round((grossCommissionMonthly / selfTotalSpend) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-800 space-y-3">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-400/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Calculator className="w-4 h-4 text-purple-400" />
            Agent Income & Lead Savings Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">IMO Vendor vs Self-Generated Lead ROI Calculator</h1>
          <p className="text-slate-300 text-base max-w-3xl">
            See exactly how much profit your insurance agency retains by generating exclusive Final Expense leads directly through your custom landing page instead of buying reseller IMO leads.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Inputs Panel */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-xl text-slate-900 border-b border-slate-200 pb-3">
              Campaign & Commission Inputs
            </h3>

            <div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-700 mb-1">
                <span>Monthly Target Lead Volume</span>
                <span className="text-emerald-700 font-extrabold">{monthlyLeads} leads / mo</span>
              </div>
              <input 
                type="range" min="20" max="500" step="10" 
                value={monthlyLeads} 
                onChange={(e) => setMonthlyLeads(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">IMO / Vendor Lead Price ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input 
                    type="number" 
                    value={imoLeadCost} 
                    onChange={(e) => setImoLeadCost(Number(e.target.value))}
                    className="input-senior !py-2 !pl-7 !text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Self-Gen Ad Cost ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <input 
                    type="number" 
                    value={selfLeadCost} 
                    onChange={(e) => setSelfLeadCost(Number(e.target.value))}
                    className="input-senior !py-2 !pl-7 !text-sm border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Close Rate %</label>
                <input 
                  type="number" 
                  value={closeRate} 
                  onChange={(e) => setCloseRate(Number(e.target.value))}
                  className="input-senior !py-2 !text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Avg Policy APV ($)</label>
                <input 
                  type="number" 
                  value={avgApv} 
                  onChange={(e) => setAvgApv(Number(e.target.value))}
                  className="input-senior !py-2 !text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Commission %</label>
                <input 
                  type="number" 
                  value={commissionRate} 
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="input-senior !py-2 !text-sm"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800">Estimated Monthly Closing Activity:</div>
              <div>• Closed Policies: <strong>{totalClosedPolicies} policies / month</strong></div>
              <div>• Gross Agency Commission: <strong>${grossCommissionMonthly.toLocaleString()} / month</strong></div>
            </div>
          </div>

          {/* Right Results Panel */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Highlight Savings Banner */}
            <div className="senior-card border-2 border-emerald-500 bg-emerald-950 text-white space-y-4">
              <div className="flex items-center gap-3">
                <PiggyBank className="w-8 h-8 text-amber-400" />
                <div>
                  <h3 className="text-xl font-extrabold text-white">Your Net Yearly Cost Savings</h3>
                  <p className="text-xs text-emerald-300">By replacing IMO reseller leads with your own funnel</p>
                </div>
              </div>

              <div className="text-4xl sm:text-5xl font-black text-amber-400">
                ${yearlySavings.toLocaleString()} <span className="text-lg text-emerald-200 font-normal">/ year saved</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-sm border-t border-emerald-800">
                <div>
                  <span className="text-xs text-emerald-300 block">Monthly Savings</span>
                  <span className="font-extrabold text-white text-lg">${monthlySavings.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-emerald-300 block">Ad Campaign ROI</span>
                  <span className="font-extrabold text-emerald-400 text-lg">{selfRoiPercent}%</span>
                </div>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option A: IMO Reseller Leads */}
              <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">IMO Vendor Leads</span>
                  <span className="text-xs font-extrabold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">${imoLeadCost}/lead</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500">Monthly Lead Spend</div>
                  <div className="text-2xl font-black text-slate-900">${imoTotalSpend.toLocaleString()}</div>
                </div>

                <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Monthly Net Profit:</span>
                    <span className="font-bold text-slate-900">${imoNetProfitMonthly.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Option B: Self-Generated Landing Page Leads */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-sm space-y-3 bg-emerald-50/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Self-Gen Funnel</span>
                  <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">${selfLeadCost}/lead</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500">Monthly Lead Spend</div>
                  <div className="text-2xl font-black text-emerald-700">${selfTotalSpend.toLocaleString()}</div>
                </div>

                <div className="border-t border-emerald-200 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Monthly Net Profit:</span>
                    <span className="font-bold text-emerald-800 text-sm">${selfNetProfitMonthly.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
