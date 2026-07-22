import React from 'react';
import { ShieldCheck, PhoneCall, Mail, Award, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-slate-300 py-12 border-t border-amber-400/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 font-black flex items-center justify-center border border-white text-base">
                LP
              </div>
              <div>
                <span className="brand-serif font-black text-xl text-white tracking-wide">LAWRENCE POOLE</span>
                <div className="text-xs text-amber-300 font-bold">Licensed Agent Since 1990</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
              "Your Agent For Life" • "I Write It All" • "You Do Life.. Let Me Protect It"<br />
              Providing independent insurance policy comparisons for Life, Home, Auto, Annuities, Senior Life, Medicare, and Living Benefits.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-amber-300 text-sm mb-3">Direct Contact</h4>
            <div className="space-y-2 text-xs text-slate-200">
              <div className="flex items-center gap-2 font-bold">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <a href="tel:7574496463" className="hover:underline text-amber-300">(757) 449-6463</a>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Mail className="w-4 h-4 text-amber-400" />
                <a href="mailto:lp2nsure@gmail.com" className="hover:underline text-amber-300">lp2nsure@gmail.com</a>
              </div>
              <div className="text-slate-400 text-[11px] pt-1">
                Licensed Agent • Serving VA, NC, FL, GA, OH, PA, TN & Nationwide.
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-amber-300 text-sm mb-3">Insurance Products Written</h4>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>• Senior Life & Final Expense</li>
              <li>• Term / Whole & Living Benefits</li>
              <li>• Auto Insurance (Multi-Car)</li>
              <li>• Homeowners & Property</li>
              <li>• Fixed Index Annuities</li>
              <li>• Medicare Supplement & Advantage</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-emerald-900 pt-6 text-[11px] text-slate-400 space-y-3 leading-normal">
          <p>
            <strong>Disclaimer:</strong> Lawrence Poole is an independent licensed insurance agent. Product quotes and estimated rates shown on this portal are for illustrative purposes and subject to carrier underwriting approval. Medicare products: Not affiliated with or endorsed by the U.S. government or the federal Medicare program.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-slate-400">
            <div>© 2026 Lawrence Poole, Licensed Agent. All Rights Reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">State Licensing</a>
              <span className="text-emerald-700">|</span>
              <button onClick={() => window.dispatchEvent(new CustomEvent('openAgentHub'))} className="text-amber-400 hover:underline font-semibold">Agent Hub Login</button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
