import React, { useState } from 'react';
import { 
  Users, PhoneCall, Mail, Calendar, Download, Plus, Filter, 
  Sparkles, ShieldCheck, CheckCircle2, Clock, AlertCircle, 
  Send, ExternalLink, RefreshCw, DollarSign, TrendingUp, Search, X, Tag
} from 'lucide-react';

export default function AgentDashboard({ leads, setLeads }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  // Metrics
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const annuityLeadsCount = leads.filter(l => l.category === 'annuity').length;

  const filteredLeads = leads.filter(l => {
    const matchesCat = filterCategory === 'All' || l.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.phone.includes(searchTerm) || 
                          l.state.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const handleSimulateMultiLineLead = () => {
    const categories = ['life', 'auto', 'home', 'annuity', 'medicare'];
    const selectedCat = categories[Math.floor(Math.random() * categories.length)];
    const names = ["Thomas Wright", "Sandra Collins", "William Harris", "Deborah King", "Kenneth Scott"];
    const name = names[Math.floor(Math.random() * names.length)];

    const catMap = {
      life: { label: 'Senior Life & Final Expense', details: 'Age 68 • $15,000 Whole Life', rate: '$38 - $52/mo' },
      auto: { label: 'Auto Insurance', details: '2 Vehicles • Geico Switcher', rate: '$95 - $135/mo' },
      home: { label: 'Homeowners Insurance', details: 'Single Family • $420k Rebuild', rate: '$75 - $110/mo' },
      annuity: { label: 'Annuity & Rollover', details: '401(k) Rollover: $180,000', rate: '$950 - $1,400/mo income' },
      medicare: { label: 'Medicare Supplement', details: 'Turning 65 • Part B Active', rate: '$0 - $40/mo' }
    };

    const newLead = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: selectedCat,
      categoryLabel: catMap[selectedCat].label,
      name: name,
      phone: `(757) ${Math.floor(200 + Math.random()*700)}-${Math.floor(1000 + Math.random()*8000)}`,
      email: `${name.toLowerCase().replace(' ', '.')}@gmail.com`,
      state: 'VA',
      details: catMap[selectedCat].details,
      estimatedRate: catMap[selectedCat].rate,
      preferredTime: 'Morning (9am - 12pm)',
      source: `Meta Ad - ${selectedCat.toUpperCase()} Campaign`,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: selectedCat === 'annuity' ? 'HIGH TICKET ($180k)' : 'High Intent (95%)',
      status: 'New'
    };

    setLeads([newLead, ...leads]);
  };

  const exportToCSV = () => {
    const headers = "ID,Category,Name,Phone,Email,State,Details,Rate,Status,SubmittedAt\n";
    const rows = leads.map(l => 
      `"${l.id}","${l.categoryLabel}","${l.name}","${l.phone}","${l.email}","${l.state}","${l.details}","${l.estimatedRate}","${l.status}","${l.submittedAt}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lawrence_Poole_Leads_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-950 text-white p-6 rounded-2xl border border-amber-400/40 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="brand-serif text-2xl sm:text-3xl font-extrabold text-amber-300">
                Lawrence Poole Lead Command Center
              </h1>
              <span className="bg-amber-400 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                Multi-Line Active
              </span>
            </div>
            <p className="text-slate-300 text-sm mt-1">
              Agent Direct Hotline: <strong>(757) 449-6463</strong> • <strong>lp2nsure@gmail.com</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleSimulateMultiLineLead} className="btn-gold text-xs sm:text-sm py-2.5 px-4 font-black">
              <Plus className="w-4 h-4" />
              <span>Simulate Multi-Line Lead</span>
            </button>

            <button onClick={exportToCSV} className="btn-secondary text-xs sm:text-sm py-2.5 px-4 font-bold">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Total Agency Leads</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{totalLeads}</h3>
              <p className="text-xs text-emerald-800 font-bold mt-1">100% Exclusive To Lawrence</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-lg">
              LP
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Uncontacted New Leads</p>
              <h3 className="text-3xl font-black text-amber-600 mt-1">{newLeadsCount}</h3>
              <p className="text-xs text-amber-800 font-bold mt-1">Target Speed &lt; 2 Minutes</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">High-Ticket Annuity Pipeline</p>
              <h3 className="text-3xl font-black text-emerald-700 mt-1">{annuityLeadsCount}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">401(k) Rollover Leads</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Avg Self-Gen CPL</p>
              <h3 className="text-3xl font-black text-purple-600 mt-1">$12.40</h3>
              <p className="text-xs text-emerald-800 font-bold mt-1">Vs $50 IMO Vendors</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Lead Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase mr-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Vertical:
            </span>
            {['All', 'life', 'auto', 'home', 'annuity', 'medicare'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-black uppercase transition-colors ${
                  filterCategory === cat 
                    ? 'bg-emerald-900 text-amber-300 shadow-sm' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-xs border-b border-slate-200">
                  <th className="py-3.5 px-4">Line & Prospect</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Details</th>
                  <th className="py-3.5 px-4">Quoted Estimate</th>
                  <th className="py-3.5 px-4">Cross-Sell Opportunity</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="py-4 px-4">
                      <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                        {lead.categoryLabel || lead.category}
                      </span>
                      <div className="font-extrabold text-slate-900 text-base mt-1">{lead.name}</div>
                      <div className="text-xs text-slate-500">{lead.id} • {lead.state}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{lead.phone}</div>
                      <div className="text-xs text-slate-500">{lead.email}</div>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-slate-700 max-w-xs">
                      {lead.details}
                    </td>

                    <td className="py-4 px-4 font-bold text-emerald-800">
                      {lead.estimatedRate}
                    </td>

                    <td className="py-4 px-4">
                      <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        {lead.category === 'auto' ? 'Home Bundle' :
                         lead.category === 'home' ? 'Auto Bundle' :
                         lead.category === 'medicare' ? 'Final Expense' :
                         'Living Benefits'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <a
                        href={`tel:${lead.phone}`}
                        className="btn-gold text-xs py-1.5 px-3.5 font-bold"
                      >
                        Call (757)
                      </a>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
