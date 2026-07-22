import React, { useState } from 'react';
import { 
  ShieldCheck, Car, Home, TrendingUp, HeartPulse, FileCheck, 
  PhoneCall, Mail, CheckCircle2, Star, Award, ArrowRight, 
  HelpCircle, ChevronDown, ChevronUp, Lock, DollarSign, Sparkles
} from 'lucide-react';

export default function ConsumerFunnel({ openQuizModal, selectedCategory, setSelectedCategory }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const categories = [
    { id: 'life', label: 'Senior Life & Final Expense', icon: ShieldCheck, desc: 'Burial Whole Life, Day 1 Coverage, Locked Rates' },
    { id: 'living', label: 'Term/Whole & Living Benefits', icon: FileCheck, desc: 'Life insurance that pays while you are alive' },
    { id: 'auto', label: 'Auto Insurance', icon: Car, desc: 'Multi-vehicle, liability, comprehensive & bundling' },
    { id: 'home', label: 'Homeowners Insurance', icon: Home, desc: 'Property, dwelling, flood & umbrella liability' },
    { id: 'annuity', label: 'Annuities & Retirement', icon: TrendingUp, desc: 'Guaranteed lifetime income & 401(k) protection' },
    { id: 'medicare', label: 'Medicare & Supplements', icon: HeartPulse, desc: 'Part C Advantage, Supplement Medigap & Rx' }
  ];

  const categoryFaqs = {
    life: [
      { q: "What is Final Expense Whole Life Insurance?", a: "Final Expense insurance is a whole life policy designed to pay for funeral services, burial or cremation, medical bills, and debts. Rates are locked for life and never increase as you age." },
      { q: "Is a medical exam required?", a: "No! All Senior Life & Final Expense policies through Lawrence Poole require NO medical exam and NO blood draws." }
    ],
    living: [
      { q: "What are Living Benefits?", a: "Living benefits allow you to access your policy's death benefit early if you suffer a critical, chronic, or terminal illness (e.g. heart attack, cancer, stroke) to cover medical expenses or bills." }
    ],
    auto: [
      { q: "How much can I save by bundling Auto & Home?", a: "Combining Auto and Homeowners insurance with Lawrence Poole typically saves drivers between 15% and 28% off their total annual premiums." }
    ],
    home: [
      { q: "Does standard homeowners insurance cover flood damage?", a: "Standard homeowners policies exclude flood damage. Lawrence Poole provides dedicated flood protection and umbrella policy add-ons." }
    ],
    annuity: [
      { q: "How do Fixed Index Annuities protect my retirement?", a: "Annuities guarantee that your principal investment will NEVER lose money during stock market drops while offering index-linked growth and guaranteed lifetime income." }
    ],
    medicare: [
      { q: "When can I enroll in Medicare Advantage or Supplements?", a: "You can enroll during your Initial Enrollment Period (turning 65), the Annual Open Enrollment Period (Oct 15 - Dec 7), or Special Enrollment Periods." }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Top Gold Trust Ribbon */}
      <div className="bg-emerald-950 text-amber-300 py-2.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b border-amber-500/30">
        <Award className="w-4 h-4 text-amber-400" />
        <span>LAWRENCE POOLE • LICENSED AGENT SINCE 1990 • "YOU DO LIFE.. LET ME PROTECT IT"</span>
      </div>

      {/* Hero Header - PRO MAX Centered Style */}
      <section className="relative pt-16 pb-20 bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white overflow-hidden border-b border-amber-500/30 flex flex-col items-center text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-5 py-2 rounded-full text-sm font-black tracking-widest uppercase mb-8 shadow-xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            Independent Specialist • Since 1990
          </div>

          <h1 className="brand-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.1] mb-8">
            Complete Protection.<br />
            <span className="text-amber-400">For Life & Home.</span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-300 leading-relaxed font-medium max-w-3xl mb-12">
            Work directly with <strong>Lawrence Poole</strong>. We compare top national carriers to lock in your best rates with premium, local service.
          </p>

          {/* Direct Agent Contact Card Banner */}
          <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 backdrop-blur-xl shadow-2xl max-w-2xl w-full">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className="font-extrabold text-white text-xl sm:text-2xl">Lawrence Poole</div>
              <div className="text-sm sm:text-base text-amber-300 font-semibold flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
                <span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4" /> (757) 449-6463</span>
                <span className="hidden sm:inline text-emerald-700">•</span>
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> LP2NSURE@GMAIL.COM</span>
              </div>
            </div>

            <a 
              href="tel:7574496463"
              className="btn-gold text-lg py-3 px-8 whitespace-nowrap shadow-xl rounded-full"
            >
              Call Lawrence
            </a>
          </div>

        </div>
      </section>

      {/* Insurance Vertical Category Selector */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="brand-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
            Select Protection Line
          </h2>
          <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl">
            Choose a coverage category below to check rates and unlock your multi-line savings.
          </p>
        </div>

        {/* 6 Category Buttons - Centered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-6 sm:p-8 rounded-3xl text-center border-2 transition-all flex flex-col items-center justify-center gap-4 ${
                  isSelected 
                    ? 'border-emerald-800 bg-emerald-900 text-white shadow-2xl scale-[1.03] ring-4 ring-emerald-900/20' 
                    : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-400 hover:bg-slate-50 hover:shadow-xl'
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  isSelected ? 'bg-amber-400 text-emerald-950 shadow-inner' : 'bg-slate-100 text-emerald-800'
                }`}>
                  <Icon className="w-8 h-8" />
                </div>

                <div className="flex flex-col items-center">
                  <div className={`font-extrabold text-lg sm:text-xl leading-snug mb-2 ${isSelected ? 'text-amber-300' : 'text-slate-900'}`}>
                    {cat.label}
                  </div>
                  <div className={`text-sm leading-relaxed ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {cat.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Category Details Showcase */}
        <div className="mt-8 senior-card border-2 border-emerald-900/20 bg-white p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Featured Product Line
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {categories.find(c => c.id === selectedCategory)?.label} Protection
              </h3>
              <p className="text-slate-600 text-sm mt-1">
                Custom policy options tailored for Virginia, North Carolina, and nationwide residents.
              </p>
            </div>

            <button 
              onClick={() => openQuizModal(selectedCategory)}
              className="btn-gold text-base py-3 px-7 font-black shadow-md justify-center"
            >
              <span>Get Free {categories.find(c => c.id === selectedCategory)?.label} Quote</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Specific Dynamic Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              <h4 className="font-extrabold text-slate-900">Carrier Price Comparison</h4>
              <p className="text-xs text-slate-600">Lawrence Poole shops Mutual of Omaha, Progressive, Travelers, Aetna, Americo, and 20+ top carriers to get you the lowest rate.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <Award className="w-6 h-6 text-amber-600" />
              <h4 className="font-extrabold text-slate-900">Since 1990 Expertise</h4>
              <p className="text-xs text-slate-600">Over 35 years of trusted insurance guidance. You work directly with Lawrence, not an automated call center.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h4 className="font-extrabold text-slate-900">Multi-Policy Bundle Discounts</h4>
              <p className="text-xs text-slate-600">Combine your Life, Home, Auto, or Medicare policies to unlock additional multi-line savings up to 28%.</p>
            </div>

          </div>

        </div>
      </section>

      {/* Bundle & Save Multi-Line Calculator Banner */}
      <section className="py-12 bg-gradient-to-r from-emerald-950 to-slate-900 text-white border-y border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <span className="bg-amber-400 text-emerald-950 text-xs font-black px-3 py-1 rounded-full uppercase">
                Bundle & Save Advantage
              </span>
              <h3 className="brand-serif text-3xl font-extrabold text-white">
                Have Multiple Policies? Let Lawrence Bundle & Cut Your Rates
              </h3>
              <p className="text-slate-300 text-base">
                Combine your <strong>Auto + Homeowners</strong>, or your <strong>Senior Medicare + Final Expense</strong> with Lawrence Poole to receive maximum multi-line policy credits.
              </p>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right">
              <button 
                onClick={() => openQuizModal(selectedCategory)}
                className="btn-gold text-lg py-4 px-8 font-black shadow-xl"
              >
                Calculate Bundle Discount
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="brand-serif text-3xl font-extrabold text-slate-900">Common Questions</h2>
          <p className="text-slate-600 mt-1">Frequently asked questions about {categories.find(c => c.id === selectedCategory)?.label}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-2">
          {(categoryFaqs[selectedCategory] || categoryFaqs.life).map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="faq-item">
                <div 
                  className="faq-question"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
                {isOpen && <div className="faq-answer">{faq.a}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky Call Hotline */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-emerald-950 text-white border-t border-amber-400/40 p-3 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs sm:text-base">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-bold">Speak Directly With Lawrence Poole:</span>
            <a href="tel:7574496463" className="font-black text-amber-300 hover:underline flex items-center gap-1">
              <PhoneCall className="w-4 h-4" /> (757) 449-6463
            </a>
          </div>

          <button 
            onClick={() => openQuizModal(selectedCategory)}
            className="btn-gold text-xs sm:text-sm py-2 px-5 font-black"
          >
            Get Online Quote Now
          </button>
        </div>
      </div>

    </div>
  );
}
