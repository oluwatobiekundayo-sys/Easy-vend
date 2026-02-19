
import React, { useState, useMemo } from 'react';
import { User, Token, UserRole } from '../types';

interface ReportsProps {
  user: User;
}

const Reports: React.FC<ReportsProps> = ({ user }) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const tokens: Token[] = useMemo(() => {
    const saved = localStorage.getItem('easy_vend_tokens');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const filteredData = useMemo(() => {
    return tokens.filter(t => {
      if (!dateRange.start || !dateRange.end) return true;
      const date = new Date(t.createdAt).getTime();
      const start = new Date(dateRange.start).getTime();
      const end = new Date(dateRange.end).getTime();
      return date >= start && date <= end;
    });
  }, [tokens, dateRange]);

  const stats = useMemo(() => {
    const totalAmount = filteredData.reduce((acc, t) => acc + t.amount, 0);
    const totalCharges = filteredData.reduce((acc, t) => acc + t.totalServiceCharge, 0);
    const totalUnits = filteredData.reduce((acc, t) => acc + t.units, 0);
    return { totalAmount, totalCharges, totalUnits };
  }, [filteredData]);

  const exportCSV = () => {
    const headers = ['ID', 'Token Code', 'Meter #', 'Amount', 'Units', 'Service Charge', 'Date'];
    
    // Function to safely wrap CSV values
    const escape = (val: any) => {
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
    };

    const rows = filteredData.map(t => [
      escape(t.id), 
      escape(t.tokenCode), 
      escape(t.meterNumber), 
      escape(t.amount.toFixed(2)), 
      escape(t.units.toFixed(2)), 
      escape(t.totalServiceCharge.toFixed(2)), 
      escape(new Date(t.createdAt).toLocaleDateString())
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `easy_vend_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Financial Reports</h1>
          <p className="text-slate-500">Analyze revenue, service charges and vending volume.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center space-x-2 shadow-lg shadow-slate-900/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Start Date</label>
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0071bc] outline-none transition-all" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">End Date</label>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0071bc] outline-none transition-all" 
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={() => setDateRange({start: '', end: ''})}
              className="text-[#0071bc] font-bold text-sm hover:underline mb-3 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-br from-[#0071bc] to-[#005a96] p-8 rounded-3xl text-white shadow-xl shadow-blue-600/20">
          <p className="text-sm font-bold opacity-75 uppercase tracking-widest">Gross Revenue</p>
          <h2 className="text-4xl font-black mt-2">₦{stats.totalAmount.toLocaleString()}</h2>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-900/20">
          <p className="text-sm font-bold opacity-75 uppercase tracking-widest">Service Earnings</p>
          <h2 className="text-4xl font-black mt-2">₦{stats.totalCharges.toLocaleString()}</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Energy</p>
          <h2 className="text-4xl font-black mt-2 text-slate-900">{stats.totalUnits.toLocaleString()} kWh</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100">
           <h3 className="font-bold text-slate-900 text-lg">Detailed Transaction History</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Transaction Date</th>
                  <th className="px-6 py-4">Meter Number</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-right">Service Fee</th>
                  <th className="px-6 py-4 text-right">Units (kWh)</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {filteredData.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{t.meterNumber}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">₦{t.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-red-500 font-medium">-₦{t.totalServiceCharge.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#7dc242]">{t.units.toFixed(2)}</td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">No records found for the selected filter.</td>
                  </tr>
                )}
             </tbody>
           </table>
         </div>
      </div>
    </div>
  );
};

export default Reports;
