
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center md:hidden">
         <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold mr-2">E</div>
         <span className="font-bold text-slate-900">Easy Vend</span>
      </div>

      <div className="hidden md:flex flex-col">
        <h2 className="text-lg font-bold text-slate-900">Welcome, {user.name}</h2>
        <p className="text-sm text-slate-500">Access Level: <span className="text-blue-600 font-semibold">{user.role}</span></p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative group cursor-pointer">
           <div className="flex items-center space-x-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-semibold text-slate-900 leading-none">{user.name}</p>
               <p className="text-xs text-slate-500 mt-1">{user.email}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 font-bold border border-slate-200">
               {user.name.charAt(0)}
             </div>
           </div>
           
           <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
             <div className="p-2">
               <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                 <span>Sign Out</span>
               </button>
             </div>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
