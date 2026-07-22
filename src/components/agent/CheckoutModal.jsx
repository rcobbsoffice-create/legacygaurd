import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, X, Loader2, Lock } from 'lucide-react';

export default function CheckoutModal({ item, onClose, onConfirm }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    card: '',
    exp: '',
    cvc: ''
  });

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      
      // Close and trigger callback after success animation
      setTimeout(() => {
        onConfirm(item);
      }, 1500);
    }, 2000);
  };

  const isFormValid = form.name && form.card.length > 14 && form.exp.length === 5 && form.cvc.length >= 3;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Close button */}
        {!isProcessing && !success && (
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full z-10">
            <X className="w-5 h-5" />
          </button>
        )}

        {success ? (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Payment Successful!</h2>
            <p className="text-slate-500 font-medium">Your profile has been upgraded.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-200">
              <div className="flex items-center gap-3 text-emerald-800 mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">Secure Checkout</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-1">Complete Purchase</h2>
              <p className="text-sm text-slate-500">You are purchasing:</p>
              
              <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                <div>
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.leads ? `${item.leads} leads / week` : 'One-time upgrade'}</div>
                </div>
                <div className="text-xl font-extrabold text-emerald-700">${item.price}</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckout} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name on Card</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="input-senior text-sm" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="text" maxLength={19} value={form.card} onChange={e => setForm({...form, card: e.target.value})}
                    className="input-senior text-sm pl-10 font-mono" placeholder="0000 0000 0000 0000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                  <input required type="text" maxLength={5} value={form.exp} onChange={e => setForm({...form, exp: e.target.value})}
                    className="input-senior text-sm font-mono" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CVC</label>
                  <input required type="text" maxLength={4} value={form.cvc} onChange={e => setForm({...form, cvc: e.target.value})}
                    className="input-senior text-sm font-mono" placeholder="123" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isProcessing || !isFormValid}
                  className="w-full btn-gold justify-center py-3.5 text-base shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Pay ${item.price}</>
                  )}
                </button>
              </div>
              <div className="text-center mt-3">
                <p className="text-[10px] text-slate-400">This is a simulated transaction. No real payment is captured.</p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
