
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: any) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, userRole }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: 'meters', label: 'Meters', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
    )},
    { id: 'vending', label: 'Token Vending', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { id: 'reports', label: 'Reports', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    )},
    { id: 'users', label: 'Staff Management', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    ), roleRequired: [UserRole.ADMIN] },
    { id: 'docs', label: 'Architecture Docs', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      )}
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1 shadow-inner">
                <img 
                    src="https://img.icons8.com/color/96/vending-machine.png" 
                    alt="Logo Icon" 
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none">
                    <span className="text-[#0071bc]">Easy</span><span className="text-[#7dc242]">Vend</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 mt-1">Management</span>
            </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          if (item.roleRequired && !item.roleRequired.includes(userRole)) return null;
          
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? 'bg-gradient-to-r from-[#0071bc] to-[#7dc242] text-white shadow-lg shadow-blue-900/40' 
                : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">System Status</p>
          <div className="flex items-center mt-2 space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-200">Production Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
