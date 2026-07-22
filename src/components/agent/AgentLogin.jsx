import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, X } from 'lucide-react';

export default function AgentLogin({ onClose, login, loginError, isLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) login(email, password);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
         style={{ background: 'rgba(6,38,28,0.92)', backdropFilter: 'blur(14px)' }}>
      
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 relative">

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors z-10 bg-slate-100 rounded-full p-1.5">
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 px-8 pt-10 pb-8 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center mx-auto mb-5 shadow-2xl border-4 border-white/20">
            <ShieldCheck className="w-10 h-10 text-emerald-950" />
          </div>
          <h2 className="brand-serif text-3xl font-extrabold text-white tracking-tight mb-1">Agent Hub</h2>
          <p className="text-emerald-300 text-sm font-medium">LP Insurance — Licensed Agent Portal</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          
          {loginError && (
            <div className="mb-5 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Agent Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="agent@lp2nsure.com"
                  required
                  className="input-senior pl-11 text-base"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-senior pl-11 pr-11 text-base"
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-800" />
                <span className="text-sm text-slate-600 font-medium">Keep me signed in</span>
              </label>
              <button type="button" className="text-sm text-emerald-700 font-bold hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading || !email || !password}
              className="w-full btn-primary justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing In…</>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> Sign In to Agent Hub</>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-black text-amber-800 uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-amber-700 font-mono">
              <div><span className="font-bold">Admin:</span> lawrence@lp2nsure.com / LPAdmin2024</div>
              <div><span className="font-bold">Agent:</span> marcus@lp2nsure.com / Agent123</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
