
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  user: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
  if (user.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Restricted Access</h2>
        <p className="text-slate-500 max-w-sm">Only system administrators can manage staff accounts and role assignments.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-500">Control system access and create work accounts</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          <span>Invite Team Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Super Admin', role: UserRole.ADMIN, email: 'admin@easyvend.com', status: 'Online' },
          { name: 'Jane Officer', role: UserRole.OFFICER, email: 'officer@easyvend.com', status: 'Offline' },
          { name: 'Accountant Mike', role: UserRole.ACCOUNTANT, email: 'accountant@easyvend.com', status: 'Away' }
        ].map((staff, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between mb-4">
               <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                 {staff.name.charAt(0)}
               </div>
               <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                 staff.status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
               }`}>
                 {staff.status}
               </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{staff.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{staff.email}</p>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{staff.role}</span>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
