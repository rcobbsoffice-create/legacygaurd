import React, { useState, useEffect } from 'react';
import {
  Users, Search, Plus, Phone, Mail, ChevronRight, ChevronDown,
  Tag, FileText, Edit3, Check, X, Star, Clock, AlertCircle,
  Home, Car, HeartPulse, ShieldCheck, TrendingUp, DollarSign,
  Filter, Download, Trash2, StickyNote
} from 'lucide-react';

const STORAGE_KEY = 'lp_crm_clients';

const LINE_COLORS = {
  life:     { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', icon: ShieldCheck },
  auto:     { bg: 'bg-blue-100',    text: 'text-blue-800',    border: 'border-blue-300',    icon: Car },
  home:     { bg: 'bg-orange-100',  text: 'text-orange-800',  border: 'border-orange-300',  icon: Home },
  medicare: { bg: 'bg-purple-100',  text: 'text-purple-800',  border: 'border-purple-300',  icon: HeartPulse },
  annuity:  { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-300',   icon: TrendingUp },
  living:   { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-300',    icon: DollarSign },
};

const STATUS_OPTS = ['Prospect', 'Active', 'Follow-Up', 'Lapsed', 'Do Not Call'];
const LINE_OPTS   = ['life', 'auto', 'home', 'medicare', 'annuity', 'living'];

const BLANK_CLIENT = {
  id: '', name: '', phone: '', email: '', dob: '', state: 'VA',
  status: 'Prospect', lines: [], premium: '', carrier: '', agentId: '',
  notes: [], createdAt: ''
};

const SEED_CLIENTS = [
  { id: 'c-001', name: 'Dorothy Vance', phone: '(757) 555-8912', email: 'dvance64@gmail.com', dob: '1957-04-12', state: 'VA', status: 'Active', lines: ['life'], premium: '$34.50/mo', carrier: 'Mutual of Omaha', agentId: 'agent-001', notes: [{ text: 'Prefers morning calls. Enrolled Nov 2024.', date: '2024-11-10', author: 'LP' }], createdAt: '2024-11-10' },
  { id: 'c-002', name: 'Gregory Stephens', phone: '(757) 555-3104', email: 'gstephens_va@aol.com', dob: '1968-09-03', state: 'VA', status: 'Active', lines: ['home', 'auto'], premium: '$158/mo', carrier: 'Travelers', agentId: 'agent-001', notes: [{ text: 'Bundle discount applied. Renewal March 2026.', date: '2025-03-01', author: 'LP' }], createdAt: '2025-03-01' },
  { id: 'c-003', name: 'Barbara Watson', phone: '(757) 555-7729', email: 'bwatson_med@gmail.com', dob: '1959-11-20', state: 'VA', status: 'Active', lines: ['medicare', 'life'], premium: '$29.50/mo', carrier: 'Aetna', agentId: 'agent-001', notes: [{ text: 'Part G Supplement. Very happy with plan.', date: '2025-01-15', author: 'LP' }], createdAt: '2025-01-15' },
  { id: 'c-004', name: 'Arthur Pendelton', phone: '(757) 555-4920', email: 'art.pendelton@gmail.com', dob: '1952-02-28', state: 'VA', status: 'Prospect', lines: ['annuity'], premium: '', carrier: '', agentId: 'agent-002', notes: [{ text: '$250k 401k rollover. Needs comparison quote.', date: '2026-07-21', author: 'MW' }], createdAt: '2026-07-21' },
  { id: 'c-005', name: 'Melissa Richardson', phone: '(757) 555-8831', email: 'mrichardson77@yahoo.com', dob: '1977-06-15', state: 'VA', status: 'Follow-Up', lines: ['auto'], premium: '', carrier: '', agentId: 'agent-002', notes: [{ text: 'Left voicemail. Try again Thursday PM.', date: '2026-07-21', author: 'MW' }], createdAt: '2026-07-21' },
];

function loadClients() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : SEED_CLIENTS;
  } catch { return SEED_CLIENTS; }
}
function saveClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export default function CRMModule({ currentAgent }) {
  const [clients, setClients]     = useState(loadClients);
  const [search, setSearch]       = useState('');
  const [filterLine, setFilterLine] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected]   = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [newNote, setNewNote]     = useState('');

  const isAdmin = currentAgent?.role === 'admin';

  const persist = (updated) => { setClients(updated); saveClients(updated); };

  const visible = clients.filter(c => {
    if (!isAdmin && c.agentId !== currentAgent?.id) return false;
    if (filterLine !== 'all' && !c.lines.includes(filterLine)) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
  });

  const openAdd = () => {
    setEditClient({ ...BLANK_CLIENT, id: `c-${Date.now()}`, agentId: currentAgent?.id, createdAt: new Date().toISOString().split('T')[0] });
    setShowForm(true);
  };
  const openEdit = (c) => { setEditClient({ ...c }); setShowForm(true); setSelected(null); };

  const saveForm = () => {
    if (!editClient.name) return;
    const exists = clients.find(c => c.id === editClient.id);
    const updated = exists ? clients.map(c => c.id === editClient.id ? editClient : c) : [editClient, ...clients];
    persist(updated);
    setShowForm(false); setEditClient(null);
    if (!exists) setSelected(editClient);
  };

  const deleteClient = (id) => {
    if (!window.confirm('Delete this client?')) return;
    persist(clients.filter(c => c.id !== id));
    setSelected(null);
  };

  const addNote = () => {
    if (!newNote.trim() || !selected) return;
    const note = { text: newNote.trim(), date: new Date().toISOString().split('T')[0], author: currentAgent?.initials };
    const updated = clients.map(c => c.id === selected.id ? { ...c, notes: [note, ...c.notes] } : c);
    persist(updated);
    setSelected(updated.find(c => c.id === selected.id));
    setNewNote('');
  };

  const toggleLine = (line) => {
    if (!editClient) return;
    const lines = editClient.lines.includes(line) ? editClient.lines.filter(l => l !== line) : [...editClient.lines, line];
    setEditClient({ ...editClient, lines });
  };

  const LineBadge = ({ line, small }) => {
    const cfg = LINE_COLORS[line] || {};
    const Icon = cfg.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-bold ${cfg.bg} ${cfg.text} ${cfg.border} ${small ? 'text-[10px]' : 'text-xs'}`}>
        {Icon && <Icon className="w-3 h-3" />} {line.charAt(0).toUpperCase() + line.slice(1)}
      </span>
    );
  };

  const statusColor = (s) => ({ Active: 'bg-emerald-100 text-emerald-800', Prospect: 'bg-blue-100 text-blue-800', 'Follow-Up': 'bg-amber-100 text-amber-800', Lapsed: 'bg-slate-100 text-slate-600', 'Do Not Call': 'bg-red-100 text-red-700' }[s] || 'bg-slate-100 text-slate-600');

  return (
    <div className="flex h-[calc(100vh-65px)] lg:h-[calc(100vh-73px)] overflow-hidden">

      {/* Client List Panel */}
      <div className={`${selected ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 shrink-0`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">Clients</h2>
              <p className="text-xs text-slate-500">{visible.length} {isAdmin ? 'total' : 'your clients'}</p>
            </div>
            <button onClick={openAdd} className="btn-primary text-xs py-2 px-3">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search clients…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-slate-50" />
          </div>
          <div className="flex gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none">
              <option value="all">All Status</option>
              {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filterLine} onChange={e => setFilterLine(e.target.value)}
              className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none">
              <option value="all">All Lines</option>
              {LINE_OPTS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Client Cards */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {visible.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm">No clients found</p>
            </div>
          )}
          {visible.map(c => (
            <button key={c.id} onClick={() => setSelected(c)}
              className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selected?.id === c.id ? 'bg-emerald-50 border-l-4 border-emerald-700' : ''}`}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="font-extrabold text-slate-900 text-sm">{c.name}</div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${statusColor(c.status)}`}>{c.status}</span>
              </div>
              <div className="text-xs text-slate-500 mb-2">{c.phone} · {c.state}</div>
              <div className="flex flex-wrap gap-1">
                {c.lines.map(l => <LineBadge key={l} line={l} small />)}
              </div>
              {c.premium && <div className="text-xs font-bold text-emerald-700 mt-1.5">{c.premium} · {c.carrier}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Client Detail Panel */}
      {selected && (
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto min-w-0">
          {/* Detail Header */}
          <div className="bg-white border-b border-slate-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelected(null)} className="md:hidden text-slate-500 hover:text-slate-800 mr-1">
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg">
                  {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900 text-xl">{selected.name}</h2>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.lines.map(l => <LineBadge key={l} line={l} />)}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusColor(selected.status)}`}>{selected.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(selected)} className="btn-secondary text-xs py-1.5 px-3"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => deleteClient(selected.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <a href={`tel:${selected.phone.replace(/\D/g,'')}`}
                  className="flex items-center gap-2 text-emerald-700 font-bold hover:underline">
                  <Phone className="w-4 h-4" /> {selected.phone}
                </a>
                <a href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 text-blue-700 font-bold hover:underline">
                  <Mail className="w-4 h-4" /> {selected.email}
                </a>
                {selected.dob && <div className="text-slate-600"><span className="font-bold text-slate-800">DOB:</span> {selected.dob}</div>}
                <div className="text-slate-600"><span className="font-bold text-slate-800">State:</span> {selected.state}</div>
                {selected.premium && <div className="text-slate-600"><span className="font-bold text-slate-800">Premium:</span> {selected.premium}</div>}
                {selected.carrier && <div className="text-slate-600"><span className="font-bold text-slate-800">Carrier:</span> {selected.carrier}</div>}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-600" /> Activity & Notes
              </h3>
              <div className="flex gap-2 mb-4">
                <input value={newNote} onChange={e => setNewNote(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addNote()}
                  placeholder="Add a call note or update…"
                  className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-600" />
                <button onClick={addNote} className="btn-primary text-xs py-2 px-3"><Plus className="w-4 h-4" /></button>
              </div>
              <div className="space-y-3">
                {selected.notes?.length === 0 && <p className="text-sm text-slate-400 italic">No notes yet.</p>}
                {selected.notes?.map((n, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0">{n.author}</div>
                    <div className="bg-slate-50 rounded-xl px-3 py-2 flex-1">
                      <p className="text-sm text-slate-800">{n.text}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{n.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="hidden md:flex flex-1 items-center justify-center text-slate-300 bg-slate-50">
          <div className="text-center">
            <Users className="w-16 h-16 mx-auto mb-3 opacity-20" />
            <p className="font-semibold">Select a client to view details</p>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && editClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-slate-900 text-xl">{editClient.id.startsWith('c-') && clients.find(c => c.id === editClient.id) ? 'Edit Client' : 'Add Client'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-4">
              {[['name','Full Name','text'],['phone','Phone','tel'],['email','Email','email'],['dob','Date of Birth','date'],['state','State','text'],['premium','Monthly Premium','text'],['carrier','Carrier','text']].map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
                  <input type={type} value={editClient[key] || ''} onChange={e => setEditClient({ ...editClient, [key]: e.target.value })}
                    className="input-senior text-sm" placeholder={label} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTS.map(s => (
                    <button key={s} onClick={() => setEditClient({ ...editClient, status: s })}
                      className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-colors ${editClient.status === s ? 'bg-emerald-900 text-white border-emerald-900' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2">Insurance Lines</label>
                <div className="flex flex-wrap gap-2">
                  {LINE_OPTS.map(l => (
                    <button key={l} onClick={() => toggleLine(l)}
                      className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-colors ${editClient.lines.includes(l) ? 'bg-emerald-900 text-white border-emerald-900' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'}`}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveForm} className="flex-1 btn-gold justify-center text-sm py-3 font-black">
                  <Check className="w-4 h-4" /> Save Client
                </button>
                <button onClick={() => setShowForm(false)} className="btn-secondary text-sm py-3 px-4">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
