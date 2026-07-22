import React, { useState } from 'react';
import {
  Wrench, Calculator, DollarSign, MessageSquare, Users,
  ChevronDown, Copy, Check, RefreshCw, Star
} from 'lucide-react';

// ── Needs Analysis Calculator ─────────────────────────────────────────────────
function NeedsAnalysis() {
  const [form, setForm] = useState({ age: 45, income: 60000, debts: 30000, dependents: 2, yearsIncome: 10, finalExpense: 12000 });
  const rec = Math.round(form.income * form.yearsIncome + form.debts + form.finalExpense);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
      <h3 className="font-extrabold text-slate-900 text-lg mb-1 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-emerald-700" /> Life Insurance Needs Analysis
      </h3>
      <p className="text-xs text-slate-500 mb-5">Estimate how much coverage a client needs based on their financial picture.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ['age', 'Client Age', 'number'],
          ['income', 'Annual Income ($)', 'number'],
          ['debts', 'Total Debts ($)', 'number'],
          ['dependents', 'Number of Dependents', 'number'],
          ['yearsIncome', 'Years of Income to Replace', 'number'],
          ['finalExpense', 'Final Expense Budget ($)', 'number'],
        ].map(([k, l, t]) => (
          <div key={k}>
            <label className="block text-xs font-bold text-slate-600 mb-1">{l}</label>
            <input type={t} value={form[k]} onChange={e => setForm({ ...form, [k]: +e.target.value })}
              className="input-senior text-sm" />
          </div>
        ))}
      </div>
      <div className="mt-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-5 text-center">
        <div className="text-sm text-emerald-700 font-bold mb-1">Recommended Coverage Amount</div>
        <div className="text-4xl font-extrabold text-emerald-900">${rec.toLocaleString()}</div>
        <div className="text-xs text-emerald-600 mt-2">
          = ${form.income.toLocaleString()} × {form.yearsIncome} yrs + ${form.debts.toLocaleString()} debts + ${form.finalExpense.toLocaleString()} final exp.
        </div>
      </div>
    </div>
  );
}

// ── Premium Estimator ─────────────────────────────────────────────────────────
const RATE_TABLE = {
  life:     { '45-55': { M: 28, F: 22 }, '56-65': { M: 48, F: 38 }, '66-75': { M: 72, F: 58 }, '76-85': { M: 112, F: 90 } },
  term:     { '25-35': { M: 18, F: 15 }, '36-45': { M: 32, F: 26 }, '46-55': { M: 58, F: 46 }, '56-65': { M: 95, F: 78 } },
  medicare: { '65-70': { M: 128, F: 118 }, '71-75': { M: 148, F: 138 }, '76-80': { M: 172, F: 162 }, '81+': { M: 210, F: 198 } },
};

function PremiumEstimator() {
  const [product, setProduct] = useState('life');
  const [band, setBand]       = useState('');
  const [gender, setGender]   = useState('M');
  const [coverage, setCoverage] = useState(15000);

  const bands = Object.keys(RATE_TABLE[product] || {});
  const baseRate = band && RATE_TABLE[product]?.[band]?.[gender] || 0;
  const monthly = baseRate ? Math.round((coverage / 1000) * baseRate) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
      <h3 className="font-extrabold text-slate-900 text-lg mb-1 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-amber-600" /> Quick Rate Estimator
      </h3>
      <p className="text-xs text-slate-500 mb-5">Rough monthly premium estimates by product, age band, and coverage amount.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Product Type</label>
          <select value={product} onChange={e => { setProduct(e.target.value); setBand(''); }} className="input-senior text-sm">
            <option value="life">Final Expense / Senior Life</option>
            <option value="term">Term Life (10–30yr)</option>
            <option value="medicare">Medicare Supplement Plan G</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Age Band</label>
          <select value={band} onChange={e => setBand(e.target.value)} className="input-senior text-sm">
            <option value="">Select age band…</option>
            {bands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Gender</label>
          <div className="flex gap-2">
            {['M','F'].map(g => (
              <button key={g} onClick={() => setGender(g)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${gender === g ? 'bg-emerald-900 text-white border-emerald-900' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}>
                {g === 'M' ? 'Male' : 'Female'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Coverage Amount: ${coverage.toLocaleString()}</label>
          <input type="range" min={5000} max={product === 'life' ? 35000 : 500000} step={1000} value={coverage} onChange={e => setCoverage(+e.target.value)}
            className="w-full accent-emerald-700" />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>$5k</span><span>{product === 'life' ? '$35k' : '$500k'}</span>
          </div>
        </div>
      </div>
      {monthly !== null && band && (
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <div className="text-sm text-amber-700 font-bold mb-1">Estimated Monthly Premium</div>
          <div className="text-4xl font-extrabold text-amber-900">~${monthly}/mo</div>
          <div className="text-xs text-amber-600 mt-1">${(monthly * 12).toLocaleString()}/year · Rates vary by carrier & health class</div>
        </div>
      )}
    </div>
  );
}

// ── Phone Script Generator ────────────────────────────────────────────────────
const SCRIPTS = {
  life: (name) => `Hi, may I speak with ${name || 'the homeowner'}? ... Hi ${name || 'there'}, my name is [YOUR NAME] with LP Insurance. I'm calling because we recently helped several families in your area lock in final expense coverage that guarantees funeral and burial costs are covered — with no medical exam required and rates that NEVER increase. I'm not here to sell you anything today — I just want to ask you a few quick questions to see if you'd even qualify... [pause] Do you have about 60 seconds?`,
  auto: (name) => `Hi ${name || 'there'}, this is [YOUR NAME] with LP Insurance. I'm reaching out because we work with over 20 insurance carriers and we're finding that most people in your area are overpaying for auto insurance by anywhere from $400 to $900 a year. I'd love to run a free comparison for you — there's absolutely no obligation and it only takes about 3 minutes. Would right now be a good time?`,
  medicare: (name) => `Good morning, may I speak with ${name || 'the subscriber'}? ... Hi ${name || 'there'}, I'm [YOUR NAME] with LP Insurance. I'm an independent Medicare specialist and I help folks in Virginia review their current Medicare options to make sure they have the right coverage at the best possible rate. I'm NOT a telemarketer — I work directly with clients one on one. Are you currently on Medicare or will you be turning 65 soon?`,
  annuity: (name) => `Hi ${name || 'there'}, this is [YOUR NAME] calling from LP Insurance. I specialize in retirement income planning and I work with folks who have 401(k)s or savings they're concerned about protecting from market losses. I'm calling to let you know about an option that guarantees your principal NEVER loses value in a market downturn, while still giving you growth potential. Do you have 2 minutes for me to explain how it works?`,
};

function ScriptGenerator() {
  const [product, setProduct] = useState('life');
  const [clientName, setClientName] = useState('');
  const [copied, setCopied]  = useState(false);

  const script = SCRIPTS[product]?.(clientName);

  const copy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
      <h3 className="font-extrabold text-slate-900 text-lg mb-1 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-600" /> Phone Script Generator
      </h3>
      <p className="text-xs text-slate-500 mb-5">Generate a customizable opening call script by product type.</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Product Type</label>
          <select value={product} onChange={e => setProduct(e.target.value)} className="input-senior text-sm">
            <option value="life">Final Expense / Senior Life</option>
            <option value="auto">Auto Insurance</option>
            <option value="medicare">Medicare Supplements</option>
            <option value="annuity">Annuities / Retirement</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Client Name (optional)</label>
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Dorothy" className="input-senior text-sm" />
        </div>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-800 leading-relaxed font-medium italic mb-3">
        {script}
      </div>
      <button onClick={copy} className={`btn-secondary text-sm py-2 px-4 ${copied ? 'text-emerald-700 border-emerald-400' : ''}`}>
        {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Script</>}
      </button>
    </div>
  );
}

// ── Bundle Analyzer ───────────────────────────────────────────────────────────
function BundleAnalyzer() {
  const [auto, setAuto]   = useState(150);
  const [home, setHome]   = useState(120);
  const discount          = Math.round((auto + home) * 0.22);
  const bundled           = auto + home - discount;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
      <h3 className="font-extrabold text-slate-900 text-lg mb-1 flex items-center gap-2">
        <Users className="w-5 h-5 text-purple-600" /> Multi-Policy Bundle Analyzer
      </h3>
      <p className="text-xs text-slate-500 mb-5">Show clients how much they save by bundling Auto + Home.</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Current Auto Premium ($/mo)</label>
          <input type="number" value={auto} onChange={e => setAuto(+e.target.value)} className="input-senior text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">Current Home Premium ($/mo)</label>
          <input type="number" value={home} onChange={e => setHome(+e.target.value)} className="input-senior text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
          <div className="text-sm text-slate-500 font-semibold mb-1">Current Total</div>
          <div className="text-2xl font-extrabold text-slate-900">${auto + home}/mo</div>
          <div className="text-xs text-slate-400">${((auto + home) * 12).toLocaleString()}/yr</div>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-200">
          <div className="text-sm text-red-600 font-semibold mb-1">Bundle Savings</div>
          <div className="text-2xl font-extrabold text-red-700">-${discount}/mo</div>
          <div className="text-xs text-red-400">~22% discount</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
          <div className="text-sm text-emerald-700 font-semibold mb-1">New Bundle Rate</div>
          <div className="text-2xl font-extrabold text-emerald-800">${bundled}/mo</div>
          <div className="text-xs text-emerald-600">${(bundled * 12).toLocaleString()}/yr</div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const TOOL_TABS = [
  { id: 'needs',   label: 'Needs Analysis',  icon: Calculator },
  { id: 'premium', label: 'Rate Estimator',  icon: DollarSign },
  { id: 'script',  label: 'Call Scripts',    icon: MessageSquare },
  { id: 'bundle',  label: 'Bundle Analyzer', icon: Users },
];

export default function AgentTools({ currentAgent }) {
  const [activeTab, setActiveTab] = useState('needs');

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Agent Productivity Tools</h2>
        <p className="text-sm text-slate-500">Calculators, scripts, and analyzers to close more deals faster.</p>
      </div>

      {/* Tool Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {TOOL_TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${activeTab === t.id ? 'bg-emerald-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-400'}`}>
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'needs'   && <NeedsAnalysis />}
      {activeTab === 'premium' && <PremiumEstimator />}
      {activeTab === 'script'  && <ScriptGenerator />}
      {activeTab === 'bundle'  && <BundleAnalyzer />}
    </div>
  );
}
