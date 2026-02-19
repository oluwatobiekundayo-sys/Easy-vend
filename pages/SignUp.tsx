
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface SignUpProps {
  onSignUp: (user: User, token: string) => void;
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.OFFICER
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Mock Sign Up Logic
    setTimeout(() => {
      onSignUp({
        id: crypto.randomUUID(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString()
      }, 'mock-jwt-token-new-user');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col items-center justify-center mb-8 text-center">
              <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-2 mb-4 shadow-sm">
                <img 
                    src="https://img.icons8.com/color/96/vending-machine.png" 
                    alt="EasyVend Logo" 
                    className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-black tracking-tighter">
                Join <span className="text-[#0071bc]">Easy</span><span className="text-[#7dc242]">Vend</span>
              </h1>
              <p className="text-slate-500 mt-1 font-medium text-sm">Create your facility management account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start space-x-3 animate-in fade-in zoom-in-95">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071bc] transition-all text-slate-900"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Work Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071bc] transition-all text-slate-900"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071bc] transition-all text-slate-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071bc] transition-all text-slate-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Select Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071bc] transition-all text-slate-900"
                >
                  <option value={UserRole.OFFICER}>Field Officer</option>
                  <option value={UserRole.ACCOUNTANT}>Accountant</option>
                  <option value={UserRole.ADMIN}>Administrator</option>
                </select>
                <p className="mt-1.5 text-[10px] text-slate-400 italic font-medium leading-relaxed">
                  * Administrator access requires manual verification by existing Super Admins in production.
                </p>
              </div>

              <button 
                disabled={loading}
                className={`w-full py-3.5 bg-gradient-to-r from-[#0071bc] to-[#7dc242] text-white rounded-xl font-black text-lg shadow-xl shadow-blue-600/20 hover:opacity-95 transition-all flex items-center justify-center space-x-2 mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                    Already have an account?{' '}
                    <button 
                        onClick={onSwitchToLogin}
                        className="text-[#0071bc] font-bold hover:underline"
                    >
                        Sign In
                    </button>
                </p>
            </div>
          </div>
          
          <div className="bg-slate-50 p-5 border-t border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © 2024 EasyVend Systems
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
