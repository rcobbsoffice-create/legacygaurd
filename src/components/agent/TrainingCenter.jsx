import React, { useState } from 'react';
import {
  GraduationCap, BookOpen, ChevronDown, ChevronUp, Search,
  ShieldCheck, Car, Home, HeartPulse, TrendingUp, DollarSign,
  FileText, CheckCircle2, AlertTriangle, Star, Play, ExternalLink
} from 'lucide-react';

const MODULES = [
  {
    id: 'life',
    label: 'Final Expense & Senior Life',
    icon: ShieldCheck,
    color: 'emerald',
    tag: 'Life Insurance',
    overview: 'Final Expense Whole Life is a simplified-issue permanent policy designed for seniors aged 45–85. Coverage ranges from $2,000–$35,000. Rates are locked for life, no medical exam required, and many products offer Day 1 coverage.',
    keyPoints: [
      'No medical exam — simplified health questions only',
      'Rates NEVER increase after issue',
      'Coverage never cancels as long as premiums are paid',
      'Builds cash value over time',
      'Benefits paid directly to beneficiary, usually within 24–48 hrs',
    ],
    objections: [
      { obj: '"I already have coverage through my employer."', res: 'Group employer coverage typically ends at retirement or job loss. A personal Final Expense policy stays with you for life, regardless of employment.' },
      { obj: '"It\'s too expensive."', res: 'Rates start as low as $18/month for $5,000 in coverage. Compare that to average funeral costs of $9,000–$12,000 — this is peace of mind for cents a day.' },
      { obj: '"I\'m in too poor of health to qualify."', res: 'Many carriers (Americo, AIG, Mutual of Omaha) offer Graded Benefit or Modified plans for clients with serious health conditions — coverage still guaranteed.' },
    ],
    carriers: [
      { name: 'Mutual of Omaha', notes: 'Day 1 Level Benefit, very competitive for ages 50-75' },
      { name: 'Americo', notes: 'Eagle Premier — competitive for diabetics and heart conditions' },
      { name: 'AIG/Corebridge', notes: 'Guaranteed Issue available with no health questions' },
      { name: 'Foresters Financial', notes: 'Strong for tobacco users and diabetics' },
    ],
    compliance: [
      'Always confirm state of residence before quoting — rates vary by state.',
      'Virginia requires a replacement form (VA Form 14-32) when replacing existing life coverage.',
      'Do NOT suggest canceling existing coverage until new policy is issued.',
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=final+expense+insurance+training',
  },
  {
    id: 'living',
    label: 'Living Benefits & Term Life',
    icon: DollarSign,
    color: 'rose',
    tag: 'Life Insurance',
    overview: 'Living Benefits riders allow policyholders to access a portion of their death benefit EARLY if diagnosed with a qualifying Critical, Chronic, or Terminal illness (e.g., heart attack, cancer, stroke, ALS). Term life provides temporary, high-value coverage for income replacement.',
    keyPoints: [
      'Accelerated Death Benefit — access funds while still living',
      'Critical Illness: heart attack, stroke, cancer, organ failure',
      'Chronic Illness: permanent inability to perform 2+ ADLs',
      'Terminal Illness: 12–24 month life expectancy',
      'No premium increase for adding living benefits on many carriers',
    ],
    objections: [
      { obj: '"I have health insurance — why do I need this?"', res: 'Health insurance covers medical bills. Living Benefits replace your INCOME when you can\'t work. Who pays your mortgage, utilities, and groceries during recovery?' },
      { obj: '"I\'m young and healthy — I don\'t need it now."', res: 'That\'s exactly why you should get it now — premiums are lowest when you are young and healthy. A 40-year-old with diabetes cannot qualify for living benefits.' },
    ],
    carriers: [
      { name: 'Transamerica', notes: 'Strong living benefit riders — TransACE series' },
      { name: 'National Life Group', notes: 'FlexLife IUL with triple living benefit option' },
      { name: 'Mutual of Omaha', notes: 'Term Life Express — quick issue for healthy applicants' },
    ],
    compliance: [
      'Riders must be disclosed on the application separately.',
      'Never guarantee specific payout amounts for living benefits — they depend on benefit period elected.',
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=living+benefits+life+insurance+training',
  },
  {
    id: 'auto',
    label: 'Auto Insurance',
    icon: Car,
    color: 'blue',
    tag: 'P&C',
    overview: 'Auto insurance is mandatory in Virginia (and most states). Key coverages include Liability, Collision, Comprehensive, Uninsured Motorist (UM/UIM), and Medical Payments. Your value is in comparison shopping across carriers to find the best rate.',
    keyPoints: [
      'Virginia minimum: $30k/$60k bodily injury, $20k property damage',
      'Always upsell Uninsured Motorist coverage — VA has high UM rate',
      'Bundling with home can save 15–28%',
      'Multi-vehicle discounts stack — always ask for all vehicles',
      'Good driver / telematics discounts available through most carriers',
    ],
    objections: [
      { obj: '"I\'ve been with [carrier] forever — they treat me right."', res: 'Loyalty is great, but carriers raise rates at renewal every year. Let me run a quick comparison — you\'ll be surprised. Most clients save $400–$900/year.' },
    ],
    carriers: [
      { name: 'Progressive', notes: 'Best for high-risk / SR-22 clients' },
      { name: 'Travelers', notes: 'Excellent for bundles — home + auto discounts' },
      { name: 'Safeco', notes: 'Great for multi-vehicle families' },
      { name: 'Nationwide', notes: 'Strong telematics / SmartRide program' },
    ],
    compliance: [
      'Virginia requires an SR-22 for DUI/DWI convictions — confirm before quoting.',
      'Do not bind coverage by phone without written confirmation from client.',
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=auto+insurance+agent+training',
  },
  {
    id: 'home',
    label: 'Homeowners Insurance',
    icon: Home,
    color: 'orange',
    tag: 'P&C',
    overview: 'Homeowners insurance (HO-3 is standard) covers dwelling, personal property, liability, and additional living expenses. Key upsell opportunities include flood rider, umbrella policy, and scheduled personal property for jewelry/electronics.',
    keyPoints: [
      'HO-3 = open-peril dwelling + named-peril personal property',
      'Always check Rebuild Cost (not market value) for dwelling coverage amount',
      'Flood is EXCLUDED from standard HO-3 — always disclose this',
      'Umbrella policy ($1M) adds ~$15–25/mo — great upsell',
      'Home + Auto bundle is strongest retention strategy',
    ],
    objections: [
      { obj: '"My mortgage company just assigned me insurance."', res: 'Lender-placed insurance costs 2–5x more than a policy you choose. Let me find you a better rate and put that savings back in your pocket.' },
    ],
    carriers: [
      { name: 'Travelers', notes: 'Top choice for bundles — excellent claims service' },
      { name: 'Hippo', notes: 'Modern tech-forward, great for new homeowners' },
      { name: 'Nationwide', notes: 'Strong for coastal VA properties' },
    ],
    compliance: [
      'Virginia requires separate flood policy through NFIP or private market.',
      'Confirm mortgage lender requirements before binding — some require specific coverage levels.',
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=homeowners+insurance+agent+training',
  },
  {
    id: 'annuity',
    label: 'Annuities & Retirement',
    icon: TrendingUp,
    color: 'amber',
    tag: 'Financial',
    overview: 'Fixed Index Annuities (FIAs) offer principal protection tied to market index performance (S&P 500, etc.) with no direct market risk. Key pitch: "You can never lose your principal." Great for 401(k) rollovers, IRAs, and retirement income planning.',
    keyPoints: [
      'Principal NEVER decreases due to market loss',
      'Interest credited based on index performance (floor = 0%, not negative)',
      'Income Rider: Guaranteed lifetime income regardless of account value',
      'Excellent 401(k) / IRA rollover vehicle — tax-deferred growth',
      'Commission: Typically 5–8% of premium — highest in the business',
    ],
    objections: [
      { obj: '"My financial advisor says annuities have high fees."', res: 'Variable annuities have high fees — Fixed Index Annuities typically have NO management fees. The carrier earns the spread from your index cap vs actual index performance.' },
      { obj: '"I want access to my money."', res: 'Most FIAs allow 10% free withdrawals annually penalty-free. After surrender period (5–10 years), full liquidity returns. Income rider gives guaranteed monthly check for life.' },
    ],
    carriers: [
      { name: 'North American (Sammons)', notes: 'BenefitSolutions income rider — very competitive' },
      { name: 'Athene', notes: 'Agility 10 — high cap rates for S&P index' },
      { name: 'American Equity', notes: 'AssetShield — strong accumulation focus' },
      { name: 'Nationwide', notes: 'New Heights — global multi-index options' },
    ],
    compliance: [
      'Suitability review required on ALL annuity applications in VA.',
      'Complete NAIC Suitability Training before selling annuities.',
      'Replacement of existing annuity requires mandatory 60-day free look period disclosure.',
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=fixed+index+annuity+training+agent',
  },
  {
    id: 'medicare',
    label: 'Medicare & Supplements',
    icon: HeartPulse,
    color: 'purple',
    tag: 'Medicare',
    overview: 'Medicare has 4 parts: Part A (hospital), Part B (medical), Part C (Advantage), Part D (prescription drugs). Medigap Supplements (Plan G, Plan N) fill the gaps left by Original Medicare. Agents must be AHIP certified annually to sell Medicare plans.',
    keyPoints: [
      'Annual AHIP certification required — complete by Sept 30 each year',
      'Initial Enrollment Period: 3 months before + month of + 3 months after 65th birthday',
      'Open Enrollment: Oct 15 – Dec 7 annually (Advantage and Part D)',
      'Plan G is the most comprehensive Medigap — covers everything except Part B deductible',
      'Medicare Advantage (Part C): $0 premium but network restrictions apply',
    ],
    objections: [
      { obj: '"I\'m just going to go with the $0 premium Medicare Advantage."', res: 'Medicare Advantage has $0 premiums but can have high out-of-pocket costs — up to $8,850/year in-network. Plan G averages $120–$160/month but has predictable, near-zero out-of-pocket costs.' },
      { obj: '"My doctor doesn\'t take Medicare."', res: 'With Original Medicare + Supplement, 97% of U.S. doctors are in-network. Medicare Advantage networks are much more restrictive — this is a key differentiator.' },
    ],
    carriers: [
      { name: 'Aetna', notes: 'Competitive Plan G rates — strong brand recognition' },
      { name: 'Cigna', notes: 'High star-rated Advantage plans in VA markets' },
      { name: 'Mutual of Omaha', notes: 'Very competitive Medigap rates for new-to-Medicare clients' },
      { name: 'UnitedHealthcare', notes: 'AARP-branded — strong for brand-loyal seniors' },
    ],
    compliance: [
      'AHIP certification required annually before Oct 15 to sell during AEP.',
      'Scope of Appointment (SOA) form required 48 hours before Medicare Advantage sales appointment.',
      'Cannot discuss Medicare Advantage at a Final Expense appointment without prior SOA.',
    ],
    videoUrl: 'https://www.youtube.com/results?search_query=medicare+supplement+agent+training',
  },
];

export default function TrainingCenter() {
  const [search, setSearch]       = useState('');
  const [activeId, setActiveId]   = useState('life');
  const [openObj, setOpenObj]     = useState(null);

  const filtered = MODULES.filter(m =>
    !search || m.label.toLowerCase().includes(search.toLowerCase()) ||
    m.tag.toLowerCase().includes(search.toLowerCase())
  );

  const active = MODULES.find(m => m.id === activeId);
  const Icon   = active?.icon;

  const colorMap = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rose:    'bg-rose-100 text-rose-800 border-rose-300',
    blue:    'bg-blue-100 text-blue-800 border-blue-300',
    orange:  'bg-orange-100 text-orange-800 border-orange-300',
    amber:   'bg-amber-100 text-amber-800 border-amber-300',
    purple:  'bg-purple-100 text-purple-800 border-purple-300',
  };
  const activeBg = {
    emerald: 'bg-emerald-600', rose: 'bg-rose-600', blue: 'bg-blue-600',
    orange: 'bg-orange-600', amber: 'bg-amber-500', purple: 'bg-purple-600',
  };

  return (
    <div className="flex h-full overflow-hidden">

      {/* Module List */}
      <div className="w-64 lg:w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-extrabold text-slate-900 mb-3">Training Modules</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search modules…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-slate-50" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.map(m => {
            const MIcon = m.icon;
            const isActive = activeId === m.id;
            return (
              <button key={m.id} onClick={() => setActiveId(m.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 transition-all ${isActive ? `${activeBg[m.color]} text-white shadow-lg` : 'hover:bg-slate-50 text-slate-700'}`}>
                <MIcon className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold text-sm leading-tight">{m.label}</div>
                  <div className={`text-[10px] font-semibold ${isActive ? 'text-white/70' : 'text-slate-400'}`}>{m.tag}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-8 bg-slate-50">
        
        {/* Mobile module tabs */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4">
          {MODULES.map(m => {
            const MIcon = m.icon;
            return (
              <button key={m.id} onClick={() => setActiveId(m.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${activeId === m.id ? `${activeBg[m.color]} text-white border-transparent` : 'bg-white text-slate-600 border-slate-200'}`}>
                <MIcon className="w-3.5 h-3.5" /> {m.label.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {active && (
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Header */}
            <div className={`rounded-3xl p-6 sm:p-8 text-white ${activeBg[active.color]} shadow-xl`}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  {Icon && <Icon className="w-7 h-7" />}
                </div>
                <div>
                  <div className={`text-xs font-black uppercase tracking-widest mb-1 text-white/70`}>{active.tag}</div>
                  <h1 className="brand-serif text-2xl sm:text-3xl font-extrabold text-white">{active.label}</h1>
                </div>
              </div>
              <p className="mt-5 text-white/90 text-sm sm:text-base leading-relaxed">{active.overview}</p>
              <a href={active.videoUrl} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 mt-5 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors">
                <Play className="w-4 h-4" /> Watch Training Videos
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Key Points */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
              <h3 className="font-extrabold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" /> Key Selling Points
              </h3>
              <ul className="space-y-2.5">
                {active.keyPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Objection Handling */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
              <h3 className="font-extrabold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" /> Objection Handling Scripts
              </h3>
              <div className="space-y-3">
                {active.objections.map((o, i) => (
                  <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button onClick={() => setOpenObj(openObj === i ? null : i)}
                      className="w-full text-left px-4 py-3 flex items-start justify-between gap-2 bg-slate-50 hover:bg-slate-100 transition-colors">
                      <span className="text-sm font-bold text-slate-800 text-left">{o.obj}</span>
                      {openObj === i ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    </button>
                    {openObj === i && (
                      <div className="px-4 py-3 text-sm text-slate-700 bg-white border-t border-slate-200 leading-relaxed">
                        <span className="text-emerald-700 font-bold">Your Response: </span>{o.res}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier Notes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
              <h3 className="font-extrabold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" /> Carrier Quick Reference
              </h3>
              <div className="space-y-3">
                {active.carriers.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${activeBg[active.color]}`} />
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{c.name}</div>
                      <div className="text-xs text-slate-600">{c.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 sm:p-6">
              <h3 className="font-extrabold text-amber-900 text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> Compliance Reminders
              </h3>
              <ul className="space-y-2">
                {active.compliance.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
