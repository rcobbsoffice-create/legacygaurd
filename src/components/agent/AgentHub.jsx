import React, { useState } from 'react';
import {
  LayoutDashboard, Users, ClipboardList, Calculator,
  GraduationCap, Wrench, LogOut, ChevronRight, Bell, Menu, X,
  ShieldCheck, PhoneCall, TrendingUp, ShoppingCart, Settings, Star, ExternalLink, Zap
} from 'lucide-react';
import AgentDashboard from '../AgentDashboard';
import CRMModule from './CRMModule';
import ApplicationTracker from './ApplicationTracker';
import RoiCalculator from '../RoiCalculator';
import TrainingCenter from './TrainingCenter';
import AgentTools from './AgentTools';
import AgentMarketplace from './AgentMarketplace';
import AdminSettings from './AdminSettings';
import CampaignManager from './CampaignManager';
import { useMarketplace } from '../../hooks/useMarketplace';

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',      icon: LayoutDashboard,  desc: 'Leads & pipeline' },
  { id: 'crm',          label: 'CRM',             icon: Users,            desc: 'Client manager' },
  { id: 'applications', label: 'Applications',    icon: ClipboardList,    desc: 'Track submissions' },
  { id: 'roi',          label: 'ROI Calculator',  icon: Calculator,       desc: 'Cost savings' },
  { id: 'training',     label: 'Training',        icon: GraduationCap,    desc: 'Product education' },
  { id: 'tools',        label: 'Agent Tools',     icon: Wrench,           desc: 'Scripts & calculators' },
  { id: 'marketplace',  label: 'Marketplace',     icon: ShoppingCart,     desc: 'Buy leads & services' },
];

const ADMIN_NAV = [
  { id: 'campaigns', label: 'Ad Autopilot',    icon: Zap,      desc: 'Meta ads automation' },
  { id: 'admin',     label: 'Admin Settings',  icon: Settings, desc: 'Manage global pricing' }
];

export default function AgentHub({ currentAgent, leads, setLeads, logout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pricing, agentPurchases } = useMarketplace(currentAgent?.id);

  const newLeadCount = leads?.filter(l => l.status === 'New').length || 0;

  const AgentAvatar = ({ size = 'md' }) => {
    const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl' };
    const colorMap = { amber: 'bg-amber-400 text-emerald-950', emerald: 'bg-emerald-500 text-white', blue: 'bg-blue-500 text-white' };
    return (
      <div className={`${sizes[size]} ${colorMap[currentAgent?.color] || 'bg-slate-300 text-slate-800'} rounded-2xl flex items-center justify-center font-black shrink-0`}>
        {currentAgent?.initials}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':    return <AgentDashboard leads={leads} setLeads={setLeads} agentId={currentAgent?.id} isAdmin={currentAgent?.role === 'admin'} />;
      case 'crm':          return <CRMModule currentAgent={currentAgent} />;
      case 'applications': return <ApplicationTracker currentAgent={currentAgent} />;
      case 'roi':          return <RoiCalculator />;
      case 'training':     return <TrainingCenter />;
      case 'tools':        return <AgentTools currentAgent={currentAgent} />;
      case 'marketplace':  return <AgentMarketplace currentAgent={currentAgent} />;
      case 'campaigns':    return <CampaignManager currentAgent={currentAgent} setLeads={setLeads} />;
      case 'admin':        return <AdminSettings currentAgent={currentAgent} />;
      default:             return null;
    }
  };

  const activeTier = pricing.tiers.find(t => t.id === agentPurchases.tier);

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* ── Sidebar (Desktop) ────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 flex flex-col shadow-2xl transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:transform-none`}>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-emerald-800/50">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <div className="brand-serif text-white font-black text-lg leading-tight">Agent Hub</div>
              <div className="text-emerald-400 text-xs font-semibold">LP Insurance Portal</div>
            </div>
            <button className="lg:hidden ml-auto text-slate-400" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Agent Profile */}
          <div className="flex items-center gap-3 bg-emerald-950/50 rounded-2xl p-3.5 border border-emerald-800/40 relative">
            <AgentAvatar size="md" />
            <div className="min-w-0">
              <div className="text-white font-extrabold text-sm truncate">{currentAgent?.name}</div>
              <div className="text-emerald-400 text-[10px] font-medium truncate mb-0.5">{currentAgent?.title}</div>
              {activeTier && (
                <div className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3" /> {activeTier.name}
                </div>
              )}
              {currentAgent?.role === 'admin' && !activeTier && (
                <div className="text-[10px] font-black uppercase text-amber-400">★ Admin</div>
              )}
            </div>
            {agentPurchases.services.includes('srv_website') && (
              <a href="#" className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1.5 shadow-lg border-2 border-emerald-950 group" title="View Your Funnel">
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {[...NAV_ITEMS, ...(currentAgent?.role === 'admin' ? ADMIN_NAV : [])].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all group ${
                  isActive
                    ? 'bg-amber-400 text-emerald-950 shadow-lg shadow-amber-900/20'
                    : 'text-slate-300 hover:bg-emerald-800/50 hover:text-white'
                }`}>
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-950' : 'text-slate-400 group-hover:text-white'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className={`text-[11px] ${isActive ? 'text-emerald-800' : 'text-slate-500'}`}>{item.desc}</div>
                </div>
                {item.id === 'dashboard' && newLeadCount > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-black ${isActive ? 'bg-emerald-900 text-amber-400' : 'bg-amber-400 text-emerald-950 animate-pulse'}`}>
                    {newLeadCount}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 shrink-0 text-emerald-800" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-800/50">
          <div className="text-[10px] text-emerald-700 font-semibold mb-3 uppercase tracking-widest px-2">
            Licensed: {currentAgent?.licenseStates?.join(', ')}
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all font-bold text-sm">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Content Area ────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-extrabold text-slate-900 text-lg leading-tight">
                {NAV_ITEMS.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-slate-500">{NAV_ITEMS.find(n => n.id === activeTab)?.desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {newLeadCount > 0 && (
              <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl" onClick={() => setActiveTab('dashboard')}>
                <Bell className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 text-emerald-950 text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {newLeadCount}
                </span>
              </button>
            )}
            <a href={`tel:${currentAgent?.phone?.replace(/\D/g,'')}`}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200 hover:bg-emerald-100">
              <PhoneCall className="w-3.5 h-3.5" />
              {currentAgent?.phone}
            </a>
            <AgentAvatar size="sm" />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>

        {/* ── Mobile Bottom Tab Bar ────────────────── */}
        <nav className="lg:hidden bg-white border-t border-slate-200 px-2 py-1 flex justify-around items-center fixed bottom-0 left-0 right-0 z-20 shadow-lg">
          {NAV_ITEMS.slice(0, 5).map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all ${isActive ? 'text-emerald-800' : 'text-slate-400'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-800' : ''}`} />
                <span className="text-[9px] font-bold">{item.label}</span>
              </button>
            );
          })}
          <button onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-slate-400">
            <Menu className="w-5 h-5" />
            <span className="text-[9px] font-bold">More</span>
          </button>
        </nav>
      </div>

    </div>
  );
}
