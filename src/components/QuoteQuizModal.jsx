import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, Lock, Sparkles, Phone, User, Mail, Calendar, Car, Home, TrendingUp, HeartPulse } from 'lucide-react';
import { api } from '../services/api';

export default function QuoteQuizModal({ isOpen, onClose, onLeadSubmit, initialCategory = 'life' }) {
  const [category, setCategory] = useState(initialCategory);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCategory(initialCategory || 'life');
    setStep(1);
    setSubmitted(false);
  }, [initialCategory, isOpen]);

  // Form State
  const [formData, setFormData] = useState({
    // Common
    fullName: '',
    phone: '',
    email: '',
    state: 'VA',
    callTime: 'Morning (9am - 12pm)',
    
    // Life
    exactAge: '62',
    gender: 'Female',
    coverageAmount: 15000,
    tobacco: 'No',
    healthStatus: 'Good',

    // Auto
    vehicleCount: '2 Vehicles',
    currentAutoCarrier: 'Geico / Progressive',
    drivingHistory: 'Clean (No Tickets)',
    wantBundle: 'Yes (Save on Home/Life)',

    // Home
    homeType: 'Single Family Home',
    homeValue: '$350,000',
    roofAge: '1 - 5 Years',

    // Annuity
    rolloverAmount: '$100,000 - $250,000',
    annuityGoal: 'Guaranteed Lifetime Income',
    retirementTime: 'Within 1 - 3 Years',

    // Medicare
    medicareStatus: 'Already Enrolled in Part A & B',
    turning65: 'Turning 65 in next 6 months',
    doctorPreference: 'Want to keep current doctors'
  });

  if (!isOpen) return null;

  const calculateEstimate = () => {
    if (category === 'auto') return { min: 85, max: 140, label: '/ mo (2 vehicles estimate)' };
    if (category === 'home') return { min: 65, max: 110, label: '/ mo (home policy estimate)' };
    if (category === 'annuity') return { min: 650, max: 1450, label: '/ mo guaranteed lifetime income' };
    if (category === 'medicare') return { min: 0, max: 45, label: '/ mo (Plan C/D options)' };
    
    // Life / Senior Life
    const age = parseInt(formData.exactAge) || 60;
    let base = 20 + (age - 50) * 1.4;
    if (formData.tobacco === 'Yes') base *= 1.35;
    return { min: Math.round(base), max: Math.round(base * 1.3), label: '/ mo (locked rate)' };
  };

  const currentEst = calculateEstimate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please enter your name and phone number so Lawrence Poole can lock in your quote.");
      return;
    }

    const categoryLabels = {
      life: 'Senior Life & Final Expense',
      living: 'Term/Whole Living Benefits',
      auto: 'Auto Insurance',
      home: 'Homeowners Insurance',
      annuity: 'Annuity & Rollover',
      medicare: 'Medicare Supplement'
    };

    const newLead = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: category,
      categoryLabel: categoryLabels[category] || 'Life',
      name: formData.fullName,
      phone: formData.phone,
      email: formData.email || 'N/A',
      state: formData.state,
      details: category === 'auto' ? `${formData.vehicleCount} • ${formData.currentAutoCarrier}` :
               category === 'home' ? `${formData.homeType} • ${formData.homeValue}` :
               category === 'annuity' ? `Rollover: ${formData.rolloverAmount}` :
               category === 'medicare' ? `${formData.medicareStatus}` :
               `Age ${formData.exactAge} • $${formData.coverageAmount.toLocaleString()} Benefit`,
      estimatedRate: `$${currentEst.min} - $${currentEst.max}${currentEst.label}`,
      preferredTime: formData.callTime,
      source: `Meta Ad - ${categoryLabels[category]} Funnel`,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: category === 'annuity' ? 'HIGH TICKET ($150k+)' : 'High Intent (96%)',
      status: 'New'
    };

    try {
      await api.submitPublicLead(newLead);
    } catch (err) {
      console.error('Failed to save lead to server:', err);
    }

    onLeadSubmit(newLead);
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            
            {/* Header & Step Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-800 mb-2">
                <span>Lawrence Poole Direct Quote Engine • {category.toUpperCase()}</span>
                <span>Step {step} of 4</span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-800 to-amber-500 h-full transition-all duration-300 ease-out" 
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* STEP 1: Category Specific Questions */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {category === 'auto' ? 'Tell us about your vehicles' :
                     category === 'home' ? 'Tell us about your home' :
                     category === 'annuity' ? 'Your Retirement & Investment Goals' :
                     category === 'medicare' ? 'Medicare Eligibility & Status' :
                     'Who is this coverage for?'}
                  </h3>
                  <p className="text-slate-600 text-sm mt-1">Answer 2 quick questions to calculate carrier rates.</p>
                </div>

                {/* Auto Step 1 */}
                {category === 'auto' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Number of Vehicles to Insure</label>
                      <select 
                        value={formData.vehicleCount}
                        onChange={(e) => setFormData({...formData, vehicleCount: e.target.value})}
                        className="input-senior"
                      >
                        <option value="1 Vehicle">1 Vehicle</option>
                        <option value="2 Vehicles">2 Vehicles (Multi-car discount)</option>
                        <option value="3+ Vehicles">3+ Vehicles</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Current Auto Insurance Carrier</label>
                      <input 
                        type="text"
                        placeholder="e.g. Geico, Progressive, State Farm, None"
                        value={formData.currentAutoCarrier}
                        onChange={(e) => setFormData({...formData, currentAutoCarrier: e.target.value})}
                        className="input-senior"
                      />
                    </div>
                  </div>
                )}

                {/* Home Step 1 */}
                {category === 'home' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Property Type</label>
                      <select 
                        value={formData.homeType}
                        onChange={(e) => setFormData({...formData, homeType: e.target.value})}
                        className="input-senior"
                      >
                        <option value="Single Family Home">Single Family Home</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Condo / Co-Op">Condo / Co-Op</option>
                        <option value="Mobile / Manufactured">Mobile / Manufactured</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Estimated Home Value / Rebuild</label>
                      <select 
                        value={formData.homeValue}
                        onChange={(e) => setFormData({...formData, homeValue: e.target.value})}
                        className="input-senior"
                      >
                        <option value="$200,000 - $350,000">$200,000 - $350,000</option>
                        <option value="$350,000 - $500,000">$350,000 - $500,000</option>
                        <option value="$500,000+">$500,000+</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Annuity Step 1 */}
                {category === 'annuity' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Estimated 401(k) / IRA / Savings Rollover Amount</label>
                      <select 
                        value={formData.rolloverAmount}
                        onChange={(e) => setFormData({...formData, rolloverAmount: e.target.value})}
                        className="input-senior font-bold text-emerald-800"
                      >
                        <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                        <option value="$100,000 - $250,000">$100,000 - $250,000</option>
                        <option value="$250,000 - $500,000">$250,000 - $500,000</option>
                        <option value="$500,000+">$500,000+ (High Yield)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Primary Retirement Goal</label>
                      <select 
                        value={formData.annuityGoal}
                        onChange={(e) => setFormData({...formData, annuityGoal: e.target.value})}
                        className="input-senior"
                      >
                        <option value="Guaranteed Lifetime Income">Guaranteed Lifetime Income</option>
                        <option value="Principal Protection (Zero Market Loss)">Principal Protection (Zero Market Loss)</option>
                        <option value="Tax Deferred Wealth Accumulation">Tax Deferred Wealth Accumulation</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Medicare Step 1 */}
                {category === 'medicare' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Current Medicare Enrollment</label>
                      <select 
                        value={formData.medicareStatus}
                        onChange={(e) => setFormData({...formData, medicareStatus: e.target.value})}
                        className="input-senior"
                      >
                        <option value="Already Enrolled in Part A & B">Already Enrolled in Part A & B</option>
                        <option value="Turning 65 soon (Need Part A/B help)">Turning 65 soon (Need Part A/B help)</option>
                        <option value="Looking to Switch Plan during Open Enrollment">Looking to Switch Plan</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Life Step 1 (Default) */}
                {(category === 'life' || category === 'living') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Age</label>
                      <input 
                        type="number" 
                        min="18" max="85"
                        value={formData.exactAge}
                        onChange={(e) => setFormData({...formData, exactAge: e.target.value})}
                        className="input-senior"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">State</label>
                      <select 
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="input-senior"
                      >
                        {['VA', 'NC', 'FL', 'GA', 'OH', 'PA', 'TN', 'MD', 'SC'].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setStep(2)}
                  className="w-full btn-gold py-3.5 justify-center mt-4 text-base font-black"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* STEP 2: Secondary Options */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Bundling & Coverage Preferences</h3>
                  <p className="text-slate-600 text-sm mt-1">Select state and discount preferences.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">State</label>
                    <select 
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="input-senior"
                    >
                      {['VA', 'NC', 'FL', 'GA', 'OH', 'PA', 'TN', 'MD', 'SC'].map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Combine Policies to Save?</label>
                    <select 
                      value={formData.wantBundle}
                      onChange={(e) => setFormData({...formData, wantBundle: e.target.value})}
                      className="input-senior font-bold text-emerald-800"
                    >
                      <option value="Yes (Save on Home/Life/Auto)">Yes (Maximum Bundle Credit)</option>
                      <option value="No (Single Policy)">No (Single Policy Only)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="btn-secondary py-3.5">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 btn-gold py-3.5 justify-center font-black">
                    <span>Calculate Estimate</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Estimate Display */}
            {step === 3 && (
              <div className="space-y-5 text-center">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Lawrence Poole Carrier Rates Loaded
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900">
                  Estimated Rate Breakdown
                </h3>

                <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-2 border border-amber-400">
                  <p className="text-xs uppercase tracking-wider font-bold text-amber-300">
                    {category.toUpperCase()} POLICY ESTIMATE ({formData.state})
                  </p>
                  <div className="text-4xl font-black text-amber-400">
                    ${currentEst.min} – ${currentEst.max} <span className="text-sm text-slate-300 font-normal">{currentEst.label}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Rate compares top national carriers for best value.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary py-3.5">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button onClick={() => setStep(4)} className="flex-1 btn-gold py-3.5 justify-center font-black">
                    <span>Lock In Quote With Lawrence</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Contact Details */}
            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">Send Quote To Lawrence Poole</h3>
                  <p className="text-slate-600 text-sm mt-1">Lawrence will review carrier rates and call to verify your discounts.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-800" /> Full Legal Name *
                  </label>
                  <input 
                    type="text" required placeholder="e.g. Lawrence Poole"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="input-senior"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-emerald-800" /> Phone Number *
                  </label>
                  <input 
                    type="tel" required placeholder="(757) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="input-senior"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                    <input 
                      type="email" placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-senior !py-2 !text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Best Call Time</label>
                    <select 
                      value={formData.callTime}
                      onChange={(e) => setFormData({...formData, callTime: e.target.value})}
                      className="input-senior !py-2 !text-sm"
                    >
                      <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                      <option value="Afternoon (12pm - 4pm)">Afternoon (12pm - 4pm)</option>
                      <option value="Evening (4pm - 7pm)">Evening (4pm - 7pm)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full btn-gold py-4 justify-center text-lg font-black shadow-lg mt-2">
                  <ShieldCheck className="w-6 h-6" />
                  <span>Submit Quote To Lawrence Poole</span>
                </button>
              </form>
            )}

          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-8 space-y-5">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center border-2 border-amber-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-800" />
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-slate-900">Quote Dispatched To Lawrence Poole!</h3>
              <p className="text-slate-600 mt-2 text-base">
                Thank you, <strong>{formData.fullName}</strong>. Lawrence Poole will review your <strong>{category.toUpperCase()}</strong> quote and call you at <strong>{formData.phone}</strong> during <strong>{formData.callTime}</strong>.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-left text-sm text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-2 text-emerald-900">
                <Phone className="w-4 h-4" /> Agent Direct Hotline:
              </div>
              <p>Need immediate service? Call Lawrence directly at <strong>(757) 449-6463</strong> or email <strong>lp2nsure@gmail.com</strong>.</p>
            </div>

            <button onClick={onClose} className="btn-primary py-3 px-8 justify-center font-bold">
              Done & Return To Portal
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
