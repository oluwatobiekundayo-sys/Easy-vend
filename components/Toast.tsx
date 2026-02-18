
import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  return (
    <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 z-[100] animate-in slide-in-from-right-10 duration-300 ${
      type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'
    }`}>
      {type === 'success' ? (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
      ) : (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )}
      <span className="font-bold text-sm">{message}</span>
    </div>
  );
};

export default Toast;
