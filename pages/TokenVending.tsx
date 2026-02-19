
import React, { useState, useEffect, useMemo } from 'react';
import { User, Meter, Token, ServiceChargeType, MeterStatus } from '../types';

interface TokenVendingProps {
  user: User;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const TokenVending: React.FC<TokenVendingProps> = ({ user, showToast }) => {
  const [meters, setMeters] = useState<Meter[]>(() => {
    const saved = localStorage.getItem('easy_vend_meters');
    return saved ? JSON.parse(saved) : [];
  });

  const [tokens, setTokens] = useState<Token[]>(() => {
    const saved = localStorage.getItem('easy_vend_tokens');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    meterNumber: '',
    numberOfTokens: 1,
    amount: 0,
    tariffRate: 25.5,
    serviceCharge: 150,
    serviceChargeType: ServiceChargeType.FLAT
  });

  const [error, setError] = useState('');
  const [vendingSuccess, setVendingSuccess] = useState<Token[] | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time calculations
  const calculation = useMemo(() => {
    const { amount, serviceCharge, serviceChargeType, tariffRate } = formData;
    let totalServiceCharge = 0;
    
    if (serviceChargeType === ServiceChargeType.FLAT) {
      totalServiceCharge = serviceCharge;
    } else {
      totalServiceCharge = (serviceCharge / 100) * amount;
    }

    const netAmount = amount - totalServiceCharge;
    const units = tariffRate > 0 ? netAmount / tariffRate : 0;

    return {
      totalServiceCharge,
      netAmount,
      units: Math.max(0, parseFloat(units.toFixed(2)))
    };
  }, [formData]);

  const generateRandomToken = () => {
    return Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join(' ');
  };

  const validate = () => {
    if (formData.meterNumber.length !== 11) {
      setError('Meter number must be exactly 11 digits.');
      return false;
    }
    const meter = meters.find(m => m.meterNumber === formData.meterNumber);
    if (!meter) {
      setError('Meter number not found in database.');
      return false;
    }
    if (meter.status !== MeterStatus.ACTIVE) {
      setError('Meter is currently Inactive. Cannot vend tokens.');
      return false;
    }
    if (formData.amount <= 0) {
      setError('Amount must be greater than zero.');
      return false;
    }
    if (calculation.netAmount <= 0) {
      setError('Net amount must be greater than zero. Check service charges.');
      return false;
    }
    return true;
  };

  const initiateVend = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (validate()) {
      setIsConfirming(true);
    }
  };

  const handleFinalVend = () => {
    setIsConfirming(false);
    setIsLoading(true);

    const meter = meters.find(m => m.meterNumber === formData.meterNumber)!;

    setTimeout(() => {
      const newTokens: Token[] = [];
      for (let i = 0; i < formData.numberOfTokens; i++) {
        newTokens.push({
          id: crypto.randomUUID(),
          tokenCode: generateRandomToken(),
          meterId: meter.id,
          meterNumber: meter.meterNumber,
          amount: formData.amount,
          tariffRate: formData.tariffRate,
          serviceCharge: formData.serviceCharge,
          serviceChargeType: formData.serviceChargeType,
          totalServiceCharge: calculation.totalServiceCharge,
          netAmount: calculation.netAmount,
          units: calculation.units,
          generatedBy: user.id,
          createdAt: new Date().toISOString()
        });
      }

      const updatedTokens = [...newTokens, ...tokens];
      setTokens(updatedTokens);
      localStorage.setItem('easy_vend_tokens', JSON.stringify(updatedTokens));
      setVendingSuccess(newTokens);
      setIsLoading(false);
      showToast(`${formData.numberOfTokens} Token(s) generated successfully`, 'success');
      setFormData(prev => ({ ...prev, amount: 0 }));
    }, 1000);
  };

  const userLast5 = useMemo(() => {
    return tokens
      .filter(t => t.generatedBy === user.id)
      .slice(0, 5);
  }, [tokens, user.id]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Token Vending</h1>
        <p className="text-slate-500 mt-2">Generate recharge tokens for registered meters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center space-y-4">
                 <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-blue-600 font-bold">Securing Transaction...</p>
              </div>
            )}

            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              <span>Vending Configuration</span>
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start space-x-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={initiateVend} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meter Number (11 Digits)</label>
                  <input 
                    type="text"
                    required
                    maxLength={11}
                    value={formData.meterNumber}
                    onChange={(e) => setFormData({...formData, meterNumber: e.target.value.replace(/\D/g, '')})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all font-mono tracking-widest"
                    placeholder="Enter 11 digits"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Tokens</label>
                  <input 
                    type="number"
                    min={1}
                    max={10}
                    value={formData.numberOfTokens}
                    onChange={(e) => setFormData({...formData, numberOfTokens: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Vending Amount (Total)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
                    <input 
                      type="number"
                      required
                      min={0}
                      step="any"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tariff Rate (per Unit)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.tariffRate}
                    onChange={(e) => setFormData({...formData, tariffRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service Charge Type</label>
                  <select 
                    value={formData.serviceChargeType}
                    onChange={(e) => setFormData({...formData, serviceChargeType: e.target.value as ServiceChargeType})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value={ServiceChargeType.FLAT}>Flat Fee</option>
                    <option value={ServiceChargeType.PERCENTAGE}>Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Service Charge Value</label>
                  <input 
                    type="number"
                    step="any"
                    value={formData.serviceCharge}
                    onChange={(e) => setFormData({...formData, serviceCharge: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap gap-8 justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Service Deducted</p>
                  <p className="text-xl font-bold text-slate-900">₦{calculation.totalServiceCharge.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Net Vending Amount</p>
                  <p className="text-xl font-bold text-blue-600">₦{calculation.netAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Units</p>
                  <p className="text-xl font-bold text-green-600">{calculation.units} kWh</p>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
              >
                <span>GENERATE {formData.numberOfTokens > 1 ? `${formData.numberOfTokens} TOKENS` : 'TOKEN'}</span>
              </button>
            </form>
          </div>

          {vendingSuccess && (
            <div className="bg-green-50 border border-green-200 p-8 rounded-3xl animate-in zoom-in-95 duration-300">
               <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900">Tokens Generated Successfully</h3>
                    <p className="text-sm text-green-700">Display this code to the customer</p>
                  </div>
               </div>

               <div className="space-y-4">
                 {vendingSuccess.map((token, idx) => (
                   <div key={token.id} className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Token {idx + 1}</span>
                        <span className="text-xs font-mono text-slate-400">{token.id.split('-')[0]}</span>
                      </div>
                      <p className="text-3xl font-black text-slate-900 text-center tracking-[0.2em] font-mono py-4">
                        {token.tokenCode}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-sm">
                         <div>
                            <p className="text-slate-500">Meter Number</p>
                            <p className="font-bold text-slate-900">{token.meterNumber}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-slate-500">Units Loaded</p>
                            <p className="font-bold text-green-600">{token.units} kWh</p>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
               <button 
                onClick={() => setVendingSuccess(null)}
                className="mt-6 w-full py-3 text-sm font-bold text-green-700 bg-white border border-green-200 rounded-xl hover:bg-green-50"
               >
                 Clear History
               </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs opacity-50">Your Last 5 Generations</h3>
            <div className="space-y-4">
               {userLast5.length === 0 ? (
                 <p className="text-sm text-slate-400 text-center py-8 italic">No tokens generated yet.</p>
               ) : (
                 userLast5.map(token => (
                   <div key={token.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                      <div className="flex justify-between items-start mb-2">
                         <p className="text-xs font-mono text-slate-400">{new Date(token.createdAt).toLocaleTimeString()}</p>
                         <p className="text-xs font-bold text-blue-600">{token.units} kWh</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900 mb-1">{token.meterNumber}</p>
                      <p className="text-[10px] font-mono text-slate-500 truncate">{token.tokenCode}</p>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>
      </div>

      {isConfirming && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
           <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Confirm Vending</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">Please review the details below. This action cannot be reversed.</p>
              
              <div className="bg-slate-50 p-6 rounded-2xl space-y-3 mb-8">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Meter Number:</span>
                    <span className="font-bold font-mono">{formData.meterNumber}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Vending Amount:</span>
                    <span className="font-bold">₦{formData.amount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Service Fee:</span>
                    <span className="font-bold text-red-500">-₦{calculation.totalServiceCharge.toFixed(2)}</span>
                 </div>
                 <div className="pt-3 border-t border-slate-200 flex justify-between text-lg">
                    <span className="font-bold text-slate-900">Units:</span>
                    <span className="font-black text-green-600">{calculation.units} kWh</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                  onClick={() => setIsConfirming(false)}
                  className="py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                  onClick={handleFinalVend}
                  className="py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                 >
                   Confirm & Vend
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TokenVending;
