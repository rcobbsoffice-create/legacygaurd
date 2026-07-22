import React, { useState } from 'react';
import {
  ClipboardList, Plus, Check, X, ChevronRight, DollarSign,
  Calendar, Building, User, TrendingUp, AlertCircle, CheckCircle2,
  Clock, Loader2, FileCheck, Filter, Download
} from 'lucide-react';

const STORAGE_KEY = 'lp_applications';

const STATUSES = ['Submitted', 'Underwriting', 'Approved', 'Issued', 'Active', 'Declined'];
const STATUS_CFG = {
  Submitted:    { color: 'bg-blue-500',   light: 'bg-blue-100 text-blue-800',   icon: Clock },
  Underwriting: { color: 'bg-amber-500',  light: 'bg-amber-100 text-amber-800', icon: Loader2 },
  Approved:     { color: 'bg-emerald-400',light: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  Issued:       { color: 'bg-emerald-600',light: 'bg-emerald-100 text-emerald-900', icon: FileCheck },
  Active:       { color: 'bg-green-600',  light: 'bg-green-100 text-green-900', icon: Check },
  Declined:     { color: 'bg-red-500',    light: 'bg-red-100 text-red-800',     icon: X },
};

const LINES = ['life','living','auto','home','annuity','medicare'];
const CARRIERS = ['Mutual of Omaha','Americo','Aetna','Cigna','Progressive','Travelers','USAA','Transamerica','North American','Foresters'];

const SEED_APPS = [
  { id:'app-001', clientName:'Dorothy Vance',    carrier:'Mutual of Omaha', line:'life',    product:'Simplified Issue Whole Life', annualPremium:'$414',    status:'Active',       submittedDate:'2024-11-10', agentId:'agent-001', faceAmount:'$15,000', notes:'Day 1 coverage. No exam.' },
  { id:'app-002', clientName:'Gregory Stephens', carrier:'Travelers',       line:'home',    product:'HO-3 Homeowners + Auto Bundle', annualPremium:'$1,896', status:'Active',       submittedDate:'2025-03-01', agentId:'agent-001', faceAmount:'$380,000',notes:'Bundle discount applied.' },
  { id:'app-003', clientName:'Barbara Watson',   carrier:'Aetna',           line:'medicare',product:'Plan G Medigap Supplement',    annualPremium:'$354',    status:'Active',       submittedDate:'2025-01-15', agentId:'agent-001', faceAmount:'N/A',     notes:'OEP enrollment. Part A/B verified.' },
  { id:'app-004', clientName:'Arthur Pendelton', carrier:'North American',  line:'annuity', product:'Fixed Index Annuity',           annualPremium:'$0 (lump sum $250k)', status:'Underwriting', submittedDate:'2026-07-20', agentId:'agent-002', faceAmount:'$250,000',notes:'Pending suitability review.' },
  { id:'app-005', clientName:'Melissa Richardson',carrier:'Progressive',    line:'auto',    product:'Multi-Vehicle Comprehensive',  annualPremium:'$1,104',  status:'Submitted',    submittedDate:'2026-07-21', agentId:'agent-002', faceAmount:'N/A',     notes:'2 vehicles. Awaiting MVR.' },
];

const BLANK = { id:'', clientName:'', carrier:'', line:'life', product:'', annualPremium:'', faceAmount:'', status:'Submitted', submittedDate:new Date().toISOString().split('T')[0], agentId:'', notes:'' };

function loadApps() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : SEED_APPS; } catch { return SEED_APPS; }
}
function saveApps(apps) { localStorage.setItem(STORAGE_KEY, JSON.stringify(apps)); }

export default function ApplicationTracker({ currentAgent }) {
  const [apps, setApps]           = useState(loadApps);
  const [filterLine, setFilterLine] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ ...BLANK });
  const [expandedId, setExpandedId] = useState(null);

  const isAdmin = currentAgent?.role === 'admin';

  const persist = (updated) => { setApps(updated); saveApps(updated); };

  const visible = apps.filter(a => {
    if (!isAdmin && a.agentId !== currentAgent?.id) return false;
    if (filterLine !== 'all' && a.line !== filterLine) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const totalAV = visible.filter(a => a.status === 'Active').reduce((sum, a) => {
    const n = parseFloat(a.annualPremium?.replace(/[^0-9.]/g,'')) || 0;
    return sum + n;
  }, 0);

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: visible.filter(a => a.status === s).length }), {});

  const saveForm = () => {
    if (!form.clientName) return;
    const id = form.id || `app-${Date.now()}`;
    const entry = { ...form, id, agentId: form.agentId || currentAgent?.id };
    const exists = apps.find(a => a.id === id);
    persist(exists ? apps.map(a => a.id === id ? entry : a) : [entry, ...apps]);
    setShowForm(false); setForm({ ...BLANK });
  };

  const advance = (app) => {
    const idx = STATUSES.indexOf(app.status);
    if (idx < STATUSES.length - 2) {
      persist(apps.map(a => a.id === app.id ? { ...a, status: STATUSES[idx + 1] } : a));
    }
  };

  const StatusBar = ({ app }) => {
    const activeIdx = STATUSES.indexOf(app.status);
    return (
      <div className="flex items-center gap-0 mt-3">
        {STATUSES.filter(s => s !== 'Declined').map((s, i) => {
          const done = activeIdx >= i;
          const current = activeIdx === i;
          return (
            <React.Fragment key={s}>
              <div className={`flex flex-col items-center ${i > 0 ? 'flex-1' : ''}`}>
                {i > 0 && <div className={`h-1 w-full mb-1 rounded ${done ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'} ${current ? 'ring-2 ring-emerald-400 ring-offset-1' : ''}`}>
                  {done ? '✓' : i + 1}
                </div>
                <div className={`text-[9px] mt-0.5 font-bold ${done ? 'text-emerald-700' : 'text-slate-400'}`}>{s.slice(0,4)}</div>
              </div>
              {i < STATUSES.filter(s => s !== 'Declined').length - 1 && <div className="flex-1 h-1 bg-transparent -mt-3" />}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 pb-24 lg:pb-8 max-w-6xl mx-auto">

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-extrabold text-slate-900">{visible.length}</div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Total Apps</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-extrabold text-amber-600">{(counts.Submitted||0) + (counts.Underwriting||0)}</div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">In Pipeline</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-700">{counts.Active||0}</div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Active Policies</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-800">${totalAV.toLocaleString()}</div>
          <div className="text-xs text-slate-500 font-semibold mt-0.5">Total Annual Value</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          <select value={filterLine} onChange={e => setFilterLine(e.target.value)} className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
            <option value="all">All Lines</option>
            {LINES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={() => { setForm({ ...BLANK }); setShowForm(true); }} className="btn-gold text-sm py-2.5 px-5 font-black">
          <Plus className="w-4 h-4" /> New Application
        </button>
      </div>

      {/* Application Cards */}
      <div className="space-y-4">
        {visible.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-25" />
            <p className="font-semibold">No applications found</p>
          </div>
        )}
        {visible.map(app => {
          const SIcon = STATUS_CFG[app.status]?.icon || Clock;
          const isExpanded = expandedId === app.id;
          return (
            <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button className="w-full text-left p-5" onClick={() => setExpandedId(isExpanded ? null : app.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-extrabold text-slate-900 text-base">{app.clientName}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${STATUS_CFG[app.status]?.light}`}>
                        <SIcon className="w-3 h-3" /> {app.status}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">{app.product} · <span className="font-semibold text-slate-800">{app.carrier}</span></div>
                    <div className="text-xs text-slate-400 mt-0.5">{app.line.charAt(0).toUpperCase() + app.line.slice(1)} · Submitted {app.submittedDate}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-emerald-700 text-lg">{app.annualPremium}</div>
                    <div className="text-xs text-slate-400">annual premium</div>
                  </div>
                </div>
                {app.status !== 'Declined' && app.status !== 'Active' && <StatusBar app={app} />}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-100 bg-slate-50">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-sm mb-4">
                    <div><span className="text-slate-500 text-xs">Face Amount</span><br /><span className="font-bold text-slate-900">{app.faceAmount}</span></div>
                    <div><span className="text-slate-500 text-xs">Line</span><br /><span className="font-bold text-slate-900 capitalize">{app.line}</span></div>
                    <div><span className="text-slate-500 text-xs">Notes</span><br /><span className="font-semibold text-slate-700">{app.notes || '—'}</span></div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {app.status !== 'Active' && app.status !== 'Declined' && (
                      <button onClick={() => advance(app)} className="btn-primary text-xs py-2 px-4">
                        <ChevronRight className="w-3.5 h-3.5" /> Advance Status
                      </button>
                    )}
                    <button onClick={() => { setForm({ ...app }); setShowForm(true); }} className="btn-secondary text-xs py-2 px-4">Edit</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-slate-900 text-xl">New Application</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-3">
              {[['clientName','Client Name','text'],['product','Product Name','text'],['annualPremium','Annual Premium','text'],['faceAmount','Face Amount / Coverage','text'],['submittedDate','Submitted Date','date']].map(([k,l,t]) => (
                <div key={k}>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{l}</label>
                  <input type={t} value={form[k]||''} onChange={e => setForm({...form,[k]:e.target.value})} className="input-senior text-sm" placeholder={l} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Carrier</label>
                <select value={form.carrier} onChange={e => setForm({...form,carrier:e.target.value})} className="input-senior text-sm">
                  <option value="">Select carrier…</option>
                  {CARRIERS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Line of Business</label>
                <select value={form.line} onChange={e => setForm({...form,line:e.target.value})} className="input-senior text-sm">
                  {LINES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm({...form,status:e.target.value})} className="input-senior text-sm">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Notes</label>
                <textarea value={form.notes||''} onChange={e => setForm({...form,notes:e.target.value})} rows={2} className="input-senior text-sm resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveForm} className="flex-1 btn-gold justify-center text-sm py-3 font-black"><Check className="w-4 h-4" /> Save Application</button>
                <button onClick={() => setShowForm(false)} className="btn-secondary text-sm py-3 px-4">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
