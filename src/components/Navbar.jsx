import React from 'react';
import { PhoneCall, ShieldCheck, UserCheck, Building2 } from 'lucide-react';

export default function Navbar({ onConsumerClick, onAgentHubClick, isAgentLoggedIn, agentName, activeView }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Logo */}
          <button onClick={onConsumerClick} className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-900 to-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-md">
              <span className="brand-serif font-black text-xl text-amber-400 leading-none">LP</span>
            </div>
            <div className="hidden sm:block text-left">
              <span className="brand-serif font-black text-xl text-slate-900 tracking-wide block leading-tight">LAWRENCE POOLE</span>
              <span className="text-xs text-emerald-800 font-bold italic">Licensed Agent · Est. 1990</span>
            </div>
          </button>

          {/* Center Phone (desktop) */}
          <a href="tel:7574496463"
            className="hidden lg:flex items-center gap-2 text-emerald-900 font-extrabold text-sm px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors">
            <PhoneCall className="w-4 h-4 text-amber-600" /> (757) 449-6463
          </a>

          {/* Portal Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Consumer Button */}
            <button
              onClick={onConsumerClick}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeView === 'consumer'
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
              }`}>
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Consumer</span>
            </button>

            {/* Agent Hub Button */}
            <button
              onClick={onAgentHubClick}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeView === 'agent'
                  ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow-lg'
                  : 'bg-gradient-to-r from-emerald-900 to-slate-900 text-amber-300 border-emerald-800 hover:from-emerald-800'
              }`}>
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">{isAgentLoggedIn ? agentName?.split(' ')[0] || 'Agent Hub' : 'Agent Hub'}</span>
              {!isAgentLoggedIn && (
                <span className="hidden sm:inline text-[10px] bg-amber-400 text-emerald-950 rounded-full px-1.5 py-0.5 font-black ml-0.5">LOGIN</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
