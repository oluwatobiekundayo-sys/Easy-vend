
import React, { useState, useEffect } from 'react';
import { User, UserRole, AuthState } from './types';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MeterManagement from './pages/MeterManagement';
import UserManagement from './pages/UserManagement';
import TokenVending from './pages/TokenVending';
import Reports from './pages/Reports';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ArchitectureDocs from './pages/ArchitectureDocs';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('easy_vend_auth');
    return saved ? JSON.parse(saved) : { user: null, token: null, isAuthenticated: false };
  });

  const [currentPage, setCurrentPage] = useState<'dashboard' | 'meters' | 'users' | 'vending' | 'reports' | 'docs'>('dashboard');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    localStorage.setItem('easy_vend_auth', JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (user: User, token: string) => {
    setAuth({ user, token, isAuthenticated: true });
    showToast('Login successful', 'success');
  };

  const handleLogout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false });
    setCurrentPage('dashboard');
    showToast('Logged out', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={auth.user!} />;
      case 'meters': return <MeterManagement user={auth.user!} />;
      case 'vending': return <TokenVending user={auth.user!} showToast={showToast} />;
      case 'reports': return <Reports user={auth.user!} />;
      case 'users': return <UserManagement user={auth.user!} />;
      case 'docs': return <ArchitectureDocs />;
      default: return <Dashboard user={auth.user!} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activePage={currentPage} 
        onNavigate={setCurrentPage} 
        userRole={auth.user?.role || UserRole.OFFICER} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={auth.user!} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto relative">
            {renderPage()}
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default App;
