
import React, { useMemo } from 'react';
import { User, UserRole, Meter, Token } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const meters: Meter[] = useMemo(() => {
    const saved = localStorage.getItem('easy_vend_meters');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const tokens: Token[] = useMemo(() => {
    const saved = localStorage.getItem('easy_vend_tokens');
    return saved ? JSON.parse(saved) : [];
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = tokens.reduce((acc, t) => acc + t.amount, 0);
    const totalMeters = meters.length;
    const totalTokens = tokens.length;
    const activeTenants = meters.filter(m => m.status === 'Active').length;
    
    // Role based filtering
    if (user.role === UserRole.ADMIN) {
      return [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'System-wide earnings', type: 'revenue' },
        { label: 'Total Meters', value: totalMeters.toString(), sub: 'Registered devices', type: 'meters' },
        { label: 'Tokens Vended', value: totalTokens.toString(), sub: 'Lifetime count', type: 'tokens' },
        { label: 'Active Tenants', value: activeTenants.toString(), sub: 'Currently using power', type: 'tenants' }
      ];
    } else if (user.role === UserRole.ACCOUNTANT) {
      const serviceCharges = tokens.reduce((acc, t) => acc + t.totalServiceCharge, 0);
      return [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'Gross amount', type: 'revenue' },
        { label: 'Service Earnings', value: `$${serviceCharges.toLocaleString()}`, sub: 'Commission/Charges', type: 'charges' },
        { label: 'Net Distribution', value: `$${(totalRevenue - serviceCharges).toLocaleString()}`, sub: 'Payable to property', type: 'net' },
        { label: 'Monthly Avg', value: `$${(totalRevenue / 12 || 0).toFixed(0)}`, sub: 'Projected monthly', type: 'avg' }
      ];
    } else {
      // Officer
      const userTokens = tokens.filter(t => t.generatedBy === user.id);
      return [
        { label: 'Your Vends', value: userTokens.length.toString(), sub: 'Tokens vended by you', type: 'tokens' },
        { label: 'Your Revenue', value: `$${userTokens.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`, sub: 'Collected by you', type: 'revenue' },
        { label: 'Registered Meters', value: totalMeters.toString(), sub: 'Total in system', type: 'meters' },
        { label: 'Active Alerts', value: '0', sub: 'Meters needing review', type: 'alerts' }
      ];
    }
  }, [meters, tokens, user.role, user.id]);

  const recentVends = useMemo(() => tokens.slice(0, 5), [tokens]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Easy Vend Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back, {user.name}. Here is your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Last 5 Tokens Generated</h3>
          </div>
          <div className="space-y-4">
            {recentVends.length > 0 ? recentVends.map((token) => (
              <div key={token.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold font-mono">
                    T
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{token.meterNumber}</p>
                    <p className="text-xs text-slate-500">{token.units} kWh • {new Date(token.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">${token.amount.toFixed(2)}</p>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{token.tokenCode}</p>
                </div>
              </div>
            )) : (
              <p className="text-center py-10 text-slate-400 italic">No vending history available.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">System Audit Activity</h3>
            <p className="text-sm text-slate-500 mb-6">Real-time log of security events and vends.</p>
            <div className="space-y-4">
               {[
                 { action: 'Meter Registered', detail: 'Meter #11002233441 added by Admin', time: '10m ago' },
                 { action: 'Token Vended', detail: 'Officer generated 50.00 kWh token', time: '25m ago' },
                 { action: 'Staff Login', detail: 'Jane Officer signed in from workspace', time: '1h ago' }
               ].map((log, i) => (
                 <div key={i} className="flex items-start space-x-3 text-xs">
                    <div className="w-2 h-2 mt-1 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-bold text-slate-800">{log.action}</p>
                      <p className="text-slate-500">{log.detail}</p>
                      <p className="text-slate-400 text-[10px] mt-1">{log.time}</p>
                    </div>
                 </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
