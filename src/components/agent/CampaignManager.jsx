import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Zap, Play, Pause, RefreshCw, Target, DollarSign, TrendingUp,
  AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Eye,
  Sparkles, Activity, BarChart2,
  Settings2, Loader2, ArrowUpRight, Bell
} from 'lucide-react';
import * as MetaAPI from '../../services/metaApi';

// Inline Meta/Facebook icon (not in lucide-react)
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// ── Ad Creative Data ──────────────────────────────────────────────────────────
const AD_CREATIVES = {
  life: {
    imageUrl: '/ad_life_insurance.png',
    headline: 'Peace of Mind for Your Family',
    body: 'Final expense coverage starting at just $30/mo. No medical exam. Rates locked for life. Get your free quote today.',
    cta: 'LEARN_MORE',
    ctaLabel: 'Learn More',
  },
  auto: {
    imageUrl: '/ad_auto_insurance.png',
    headline: 'Stop Overpaying for Auto Insurance',
    body: 'We shop 20+ carriers to find your lowest rate. 2 minutes. No obligation. Save up to $900/year today.',
    cta: 'GET_QUOTE',
    ctaLabel: 'Get Quote',
  },
  medicare: {
    imageUrl: '/ad_medicare.png',
    headline: 'Turning 65? Don\'t Miss Your Window.',
    body: 'Compare Medicare Supplement plans from top carriers. Free review with a licensed Medicare specialist. No cost, no pressure.',
    cta: 'SIGN_UP',
    ctaLabel: 'Get Free Review',
  },
  home: {
    imageUrl: '/ad_home_annuity.png',
    headline: 'Protect Your Home & Your Future',
    body: 'Bundle home + auto and save up to 22%. Plus, ask about fixed index annuities that protect your retirement from market losses.',
    cta: 'LEARN_MORE',
    ctaLabel: 'Learn More',
  },
};

const LINES = [
  { id: 'life',     label: 'Final Expense / Senior Life', color: 'emerald' },
  { id: 'auto',     label: 'Auto Insurance',              color: 'blue' },
  { id: 'medicare', label: 'Medicare Supplement',         color: 'teal' },
  { id: 'home',     label: 'Home & Annuity',              color: 'amber' },
];

// ── Demo Lead Generator (attaches campaignId to every lead the tick produces) ──
const LEAD_FIRST_NAMES = ['Thomas', 'Sandra', 'William', 'Deborah', 'Kenneth', 'Patricia', 'Harold', 'Linda', 'Ronald', 'Betty'];
const LEAD_LAST_NAMES  = ['Wright', 'Collins', 'Harris', 'King', 'Scott', 'Bennett', 'Foster', 'Grant', 'Hayes', 'Morrison'];

const LEAD_TEMPLATES = {
  life:     { details: 'Age 68 • $15,000 Whole Life • Non-Smoker',        rate: '$34.50 - $52/mo' },
  auto:     { details: '2 Vehicles • Current Carrier Switcher',            rate: '$92 - $135/mo' },
  medicare: { details: 'Turning 65 • Enrolled in Part A/B',                rate: '$0 - $40/mo' },
  home:     { details: 'Single Family Home • Wants Auto Bundle Quote',     rate: '$70 - $110/mo' },
};

function generateCampaignLeads(count, { campaignId, adId, line, targetStates, agentId }) {
  const states = targetStates.split(',').map(s => s.trim()).filter(Boolean);
  const lineMeta = LINES.find(l => l.id === line);
  const template = LEAD_TEMPLATES[line] || LEAD_TEMPLATES.life;

  return Array.from({ length: count }, () => {
    const first = LEAD_FIRST_NAMES[Math.floor(Math.random() * LEAD_FIRST_NAMES.length)];
    const last  = LEAD_LAST_NAMES[Math.floor(Math.random() * LEAD_LAST_NAMES.length)];
    return {
      id: `LEAD-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      category: line,
      categoryLabel: lineMeta?.label || line,
      name: `${first} ${last}`,
      phone: `(757) ${Math.floor(200 + Math.random() * 700)}-${Math.floor(1000 + Math.random() * 8000)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@gmail.com`,
      state: states[Math.floor(Math.random() * states.length)] || 'VA',
      details: template.details,
      estimatedRate: template.rate,
      preferredTime: 'Morning (9am - 12pm)',
      source: 'Meta Ads Autopilot',
      campaignId,
      adId,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: 'New (Autopilot)',
      status: 'New',
      agentId,
    };
  });
}

const STATUS_COLORS = {
  idle:    'bg-slate-100 text-slate-600',
  running: 'bg-emerald-100 text-emerald-700',
  paused:  'bg-amber-100 text-amber-700',
  boosting:'bg-blue-100 text-blue-700',
  error:   'bg-red-100 text-red-700',
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color = 'emerald', alert }) {
  return (
    <div className={`bg-white rounded-2xl border p-4 ${alert ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${color}-100`}>
          <Icon className={`w-4 h-4 text-${color}-700`} />
        </div>
        {alert && <AlertTriangle className="w-4 h-4 text-red-500" />}
      </div>
      <div className={`text-2xl font-black ${alert ? 'text-red-700' : 'text-slate-900'}`}>{value}</div>
      <div className="text-xs text-slate-500 font-semibold mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-1">{sub}</div>}
    </div>
  );
}

// ── Ad Preview Card ───────────────────────────────────────────────────────────
function AdPreview({ creative, line }) {
  if (!creative) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
        <FacebookIcon className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold text-slate-600">Facebook Ad Preview</span>
        <span className="ml-auto text-[10px] text-slate-400">Sponsored</span>
      </div>
      <div className="relative">
        <img src={creative.imageUrl} alt="Ad Creative" className="w-full object-cover max-h-52" />
      </div>
      <div className="p-4">
        <div className="text-xs text-slate-400 mb-1">lpinsurance.com · Insurance</div>
        <div className="font-extrabold text-slate-900 text-base leading-snug mb-1">{creative.headline}</div>
        <div className="text-xs text-slate-600 line-clamp-2 mb-3">{creative.body}</div>
        <button className="w-full py-2 rounded-lg bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors">
          {creative.ctaLabel}
        </button>
      </div>
    </div>
  );
}

// ── Activity Log ──────────────────────────────────────────────────────────────
function ActivityLog({ events }) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {events.length === 0 && (
        <div className="text-center text-slate-400 text-xs py-6 font-medium">
          No activity yet. Launch a campaign to begin.
        </div>
      )}
      {events.map((e, i) => (
        <div key={i} className={`flex items-start gap-3 text-xs py-2 px-3 rounded-xl border ${
          e.type === 'boost' ? 'bg-blue-50 border-blue-200' :
          e.type === 'alert' ? 'bg-amber-50 border-amber-200' :
          e.type === 'error' ? 'bg-red-50 border-red-200' :
          e.type === 'success' ? 'bg-emerald-50 border-emerald-200' :
          'bg-slate-50 border-slate-200'
        }`}>
          <span className="shrink-0 mt-0.5">
            {e.type === 'boost'   && <ArrowUpRight className="w-3 h-3 text-blue-600" />}
            {e.type === 'alert'   && <AlertTriangle className="w-3 h-3 text-amber-500" />}
            {e.type === 'error'   && <AlertTriangle className="w-3 h-3 text-red-500" />}
            {e.type === 'success' && <CheckCircle2  className="w-3 h-3 text-emerald-600" />}
            {e.type === 'info'    && <Activity      className="w-3 h-3 text-slate-500" />}
          </span>
          <div className="flex-1">
            <span className="font-semibold text-slate-700">{e.message}</span>
          </div>
          <span className="shrink-0 text-slate-400">{e.time}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CampaignManager({ currentAgent, setLeads }) {
  // Config State
  const [selectedLine, setSelectedLine]   = useState('life');
  const [weeklyBudget, setWeeklyBudget]   = useState(700);
  const [leadQuota, setLeadQuota]         = useState(50);
  const [targetStates, setTargetStates]   = useState('VA, NC, FL');
  const [ageMin, setAgeMin]               = useState(50);
  const [ageMax, setAgeMax]               = useState(80);

  // Campaign State
  const [status, setStatus]         = useState('idle'); // idle | launching | running | paused | boosting
  const [campaignId, setCampaignId] = useState(null);
  const [adId, setAdId]             = useState(null);
  const [events, setEvents]         = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Live Metrics
  const [totalSpend, setTotalSpend]   = useState(0);
  const [totalLeads, setTotalLeads]   = useState(0);
  const [impressions, setImpressions] = useState(0);
  const [cpl, setCpl]                 = useState(0);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [tickCount, setTickCount]     = useState(0);

  const timerRef = useRef(null);
  const creative = AD_CREATIVES[selectedLine];

  const addEvent = useCallback((message, type = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setEvents(prev => [{ message, type, time }, ...prev].slice(0, 40));
  }, []);

  // ── Autopilot Tick ─────────────────────────────────────────────────────────
  const autopilotTick = useCallback(async (cId, currentBudget, currentLeads, quota) => {
    try {
      const insights = await MetaAPI.getCampaignInsights(cId);
      const newSpend  = parseFloat(insights.spend);
      const newLeads  = parseInt(insights.leads, 10);
      const newCpl    = parseFloat(insights.cpl);

      setTotalSpend(prev  => Math.min(prev + newSpend, weeklyBudget));
      setTotalLeads(prev  => Math.min(prev + newLeads, quota * 1.05));
      setImpressions(prev => prev + parseInt(insights.impressions, 10));
      setCpl(newCpl);

      if (newLeads > 0 && setLeads) {
        const freshLeads = generateCampaignLeads(newLeads, {
          campaignId: cId,
          adId,
          line: selectedLine,
          targetStates,
          agentId: currentAgent?.id,
        });
        setLeads(prev => [...freshLeads, ...prev]);
      }

      const accLeads = currentLeads + newLeads;
      const paceLeads = quota * (tickCount / 14); // 14 ticks = full week

      // Adaptive logic
      if (accLeads < paceLeads * 0.75 && currentBudget < weeklyBudget / 7 * 1.4) {
        const boosted = Math.round(currentBudget * 1.15);
        await MetaAPI.updateCampaignBudget(cId, boosted);
        setDailyBudget(boosted);
        setStatus('boosting');
        addEvent(`📈 Autopilot boosted daily budget to $${boosted} — leads behind pace.`, 'boost');
        setTimeout(() => setStatus('running'), 3000);
      } else if (newCpl > 22) {
        addEvent(`⚠️ High CPL detected ($${newCpl.toFixed(2)}). Autopilot shifting spend to best audience segment.`, 'alert');
      } else {
        addEvent(`Tick complete: +${newLeads} leads, $${newSpend.toFixed(2)} spent, CPL $${newCpl.toFixed(2)}`, 'info');
      }

      setTickCount(prev => prev + 1);

    } catch (err) {
      addEvent(`API Error: ${err.message}`, 'error');
    }
  }, [weeklyBudget, tickCount, addEvent, adId, selectedLine, targetStates, currentAgent, setLeads]);

  // ── Launch Campaign ────────────────────────────────────────────────────────
  const handleLaunch = async () => {
    setStatus('launching');
    setEvents([]);
    setTotalSpend(0);
    setTotalLeads(0);
    setImpressions(0);
    setTickCount(0);
    addEvent('Connecting to Meta Marketing API…', 'info');

    try {
      const daily = Math.round(weeklyBudget / 7);
      setDailyBudget(daily);

      const campaign = await MetaAPI.createCampaign({
        name: `LP Insurance – ${LINES.find(l => l.id === selectedLine)?.label} – ${new Date().toLocaleDateString()}`,
        objective: 'LEAD_GENERATION',
        dailyBudget: daily,
      });
      addEvent(`✅ Campaign created: ${campaign.id}`, 'success');

      const adSet = await MetaAPI.createAdSet({
        campaignId: campaign.id,
        name: `${selectedLine.toUpperCase()} AdSet – Ages ${ageMin}-${ageMax}`,
        targeting: { ageMin, ageMax, states: targetStates.split(',').map(s => s.trim()) },
        dailyBudget: daily,
      });
      addEvent(`✅ Ad Set created: ${adSet.id}`, 'success');

      const adCreative = await MetaAPI.createAdCreative({
        adSetId: adSet.id,
        headline: creative.headline,
        body: creative.body,
        cta: creative.cta,
        imageUrl: creative.imageUrl,
      });
      addEvent(`✅ Ad Creative uploaded: ${adCreative.id}`, 'success');

      const ad = await MetaAPI.createAd({
        name: `LP – ${selectedLine} – Ad`,
        adSetId: adSet.id,
        creativeId: adCreative.id,
      });
      addEvent(`🚀 Campaign is LIVE! Ad ID: ${ad.id}`, 'success');

      setCampaignId(campaign.id);
      setAdId(ad.id);
      setStatus('running');

      // Start cron-style polling every 8 seconds (= 1 "day" in demo)
      timerRef.current = setInterval(() => {
        setTotalLeads(prev => {
          autopilotTick(campaign.id, dailyBudget, prev, leadQuota);
          return prev;
        });
      }, 8000);

    } catch (err) {
      addEvent(`Launch failed: ${err.message}`, 'error');
      setStatus('idle');
    }
  };

  const handlePause = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (campaignId) {
      await MetaAPI.pauseCampaign(campaignId);
      addEvent('Campaign paused by admin.', 'info');
    }
    setStatus('paused');
  };

  const handleResume = () => {
    setStatus('running');
    addEvent('Campaign resumed.', 'success');
    timerRef.current = setInterval(() => {
      setTotalLeads(prev => {
        autopilotTick(campaignId, dailyBudget, prev, leadQuota);
        return prev;
      });
    }, 8000);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setCampaignId(null);
    setAdId(null);
    setTotalSpend(0);
    setTotalLeads(0);
    setImpressions(0);
    setCpl(0);
    setTickCount(0);
    setEvents([]);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const pct = leadQuota > 0 ? Math.min((totalLeads / leadQuota) * 100, 100) : 0;
  const spendPct = weeklyBudget > 0 ? Math.min((totalSpend / weeklyBudget) * 100, 100) : 0;

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-slate-900">Meta Ads Autopilot</h1>
            <span className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 ${STATUS_COLORS[status]}`}>
              {status === 'running' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />}
              {status === 'boosting' && <Zap className="w-3 h-3" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-slate-500">Automated lead generation via the Meta Marketing API.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {status === 'idle' || status === 'error' ? (
            <button onClick={handleLaunch} className="btn-gold flex items-center gap-2 px-6 py-2.5 text-sm shadow-lg">
              <Play className="w-4 h-4" /> Launch Autopilot
            </button>
          ) : status === 'running' || status === 'boosting' ? (
            <button onClick={handlePause} className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-2">
              <Pause className="w-4 h-4" /> Pause
            </button>
          ) : status === 'paused' ? (
            <button onClick={handleResume} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
              <Play className="w-4 h-4" /> Resume
            </button>
          ) : (
            <button disabled className="opacity-60 bg-slate-100 border border-slate-200 rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Launching…
            </button>
          )}

          {(status !== 'idle' && status !== 'launching') && (
            <button onClick={handleReset} className="btn-secondary text-sm px-4 py-2.5 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT PANEL: Config + Preview */}
        <div className="space-y-4 lg:col-span-1">

          {/* Campaign Setup */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-400" /> Campaign Setup
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Insurance Line</label>
                <select value={selectedLine} onChange={e => setSelectedLine(e.target.value)} className="input-senior text-sm" disabled={status !== 'idle'}>
                  {LINES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Weekly Budget: <span className="text-emerald-700">${weeklyBudget}</span></label>
                <input type="range" min={100} max={5000} step={50} value={weeklyBudget} onChange={e => setWeeklyBudget(+e.target.value)} className="w-full accent-emerald-700" disabled={status !== 'idle'} />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>$100</span><span>$5,000</span></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Weekly Lead Quota: <span className="text-emerald-700">{leadQuota} leads</span></label>
                <input type="range" min={5} max={200} step={5} value={leadQuota} onChange={e => setLeadQuota(+e.target.value)} className="w-full accent-emerald-700" disabled={status !== 'idle'} />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>5</span><span>200</span></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Target States</label>
                <input type="text" value={targetStates} onChange={e => setTargetStates(e.target.value)} className="input-senior text-sm" placeholder="VA, NC, FL" disabled={status !== 'idle'} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Age Min</label>
                  <input type="number" min={25} max={85} value={ageMin} onChange={e => setAgeMin(+e.target.value)} className="input-senior text-sm" disabled={status !== 'idle'} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Age Max</label>
                  <input type="number" min={25} max={85} value={ageMax} onChange={e => setAgeMax(+e.target.value)} className="input-senior text-sm" disabled={status !== 'idle'} />
                </div>
              </div>
            </div>
          </div>

          {/* Ad Preview Toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button onClick={() => setShowPreview(!showPreview)} className="w-full flex items-center justify-between px-5 py-4 text-sm font-extrabold text-slate-900 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-slate-400" /> Ad Creative Preview
              </div>
              {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showPreview && (
              <div className="px-4 pb-5">
                <AdPreview creative={creative} line={selectedLine} />
                <div className="mt-3 space-y-2">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Headline</div>
                    <div className="text-xs font-bold text-slate-800">{creative.headline}</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Body Copy</div>
                    <div className="text-xs text-slate-700">{creative.body}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live Metrics + Activity */}
        <div className="lg:col-span-2 space-y-4">

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Spend" value={`$${totalSpend.toFixed(0)}`} sub={`of $${weeklyBudget} budget`} icon={DollarSign} color="emerald" />
            <StatCard label="Leads Generated" value={totalLeads.toFixed(0)} sub={`of ${leadQuota} quota`} icon={Target} color="blue" />
            <StatCard label="Impressions" value={impressions > 999 ? `${(impressions/1000).toFixed(1)}k` : impressions.toFixed(0)} sub="Est. reach" icon={Eye} color="purple" />
            <StatCard label="Cost Per Lead" value={cpl > 0 ? `$${cpl}` : '--'} sub="Target: <$15" icon={TrendingUp} color="amber" alert={cpl > 22} />
          </div>

          {/* Progress Bars */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Weekly Progress</h3>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                <span>Lead Quota: {totalLeads.toFixed(0)} / {leadQuota}</span>
                <span className={pct >= 100 ? 'text-emerald-600' : 'text-slate-500'}>{pct.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                <span>Budget Spent: ${totalSpend.toFixed(0)} / ${weeklyBudget}</span>
                <span>{spendPct.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-700" style={{ width: `${spendPct}%` }} />
              </div>
            </div>

            {campaignId && (
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span>Campaign ID: <code className="font-mono text-emerald-800 bg-emerald-50 px-1 rounded">{campaignId}</code></span>
                <span>Daily Budget: <strong>${dailyBudget}</strong></span>
                <span>Ticks: {tickCount}</span>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" /> Autopilot Activity Feed
              </h3>
              {events.length > 0 && (
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">{events.length} events</span>
              )}
            </div>
            <ActivityLog events={events} />
          </div>

          {/* Meta API Status */}
          <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FacebookIcon className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-white font-bold text-sm">Meta Marketing API</div>
                <div className="text-slate-400 text-xs">Running in Demo Mode · Real credentials: add VITE_META_* env vars</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Demo
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
