
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock Authentication Logic
    setTimeout(() => {
      if (email === 'admin@easyvend.com' && password === 'password') {
        onLogin({
          id: '1',
          name: 'Super Admin',
          email: email,
          role: UserRole.ADMIN,
          createdAt: new Date().toISOString()
        }, 'mock-jwt-token-admin');
      } else if (email === 'officer@easyvend.com' && password === 'password') {
        onLogin({
          id: '2',
          name: 'Jane Officer',
          email: email,
          role: UserRole.OFFICER,
          createdAt: new Date().toISOString()
        }, 'mock-jwt-token-officer');
      } else {
        setError('Invalid credentials. Hint: use admin@easyvend.com / password');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
                E
              </div>
              <h1 className="ml-4 text-2xl font-bold text-slate-900">Easy Vend</h1>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-xl font-bold text-slate-800">Sign in to workspace</h2>
              <p className="text-slate-500 mt-2">Facility Management Phase 1</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start space-x-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button 
                disabled={loading}
                className={`w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400 uppercase tracking-widest">
            <span>Secured Login</span>
            <span>v1.0.0-Beta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
