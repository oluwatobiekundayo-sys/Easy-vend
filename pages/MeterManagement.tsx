
import React, { useState, useEffect } from 'react';
import { User, Meter, MeterStatus, UserRole } from '../types';

interface MeterManagementProps {
  user: User;
}

const MeterManagement: React.FC<MeterManagementProps> = ({ user }) => {
  const [meters, setMeters] = useState<Meter[]>(() => {
    const saved = localStorage.getItem('easy_vend_meters');
    return saved ? JSON.parse(saved) : [
      { id: crypto.randomUUID(), meterNumber: '12345678901', tenantName: 'Alice Johnson', property: 'Silver Heights', unit: 'Unit 4A', status: MeterStatus.ACTIVE, createdAt: new Date().toISOString() },
      { id: crypto.randomUUID(), meterNumber: '98765432109', tenantName: 'Bob Smith', property: 'Oak Ridge', unit: 'Suite 200', status: MeterStatus.ACTIVE, createdAt: new Date().toISOString() }
    ];
  });

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeter, setEditingMeter] = useState<Meter | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    meterNumber: '',
    tenantName: '',
    property: '',
    unit: '',
    status: MeterStatus.ACTIVE
  });
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('easy_vend_meters', JSON.stringify(meters));
  }, [meters]);

  const validateMeterNumber = (num: string) => {
    return /^\d{11}$/.test(num);
  };

  const handleOpenAdd = () => {
    setEditingMeter(null);
    setFormData({ meterNumber: '', tenantName: '', property: '', unit: '', status: MeterStatus.ACTIVE });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (meter: Meter) => {
    setEditingMeter(meter);
    setFormData({
      meterNumber: meter.meterNumber,
      tenantName: meter.tenantName,
      property: meter.property,
      unit: meter.unit,
      status: meter.status
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateMeterNumber(formData.meterNumber)) {
      setError('Meter number must be exactly 11 numeric digits.');
      return;
    }

    // Duplicate check
    const isDuplicate = meters.some(m => m.meterNumber === formData.meterNumber && m.id !== editingMeter?.id);
    if (isDuplicate) {
      setError('A meter with this number already exists in the system.');
      return;
    }

    if (editingMeter) {
      setMeters(prev => prev.map(m => m.id === editingMeter.id ? { ...m, ...formData } : m));
    } else {
      const newMeter: Meter = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setMeters(prev => [newMeter, ...prev]);
    }

    setIsModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setMeters(prev => prev.map(m => 
      m.id === id 
        ? { ...m, status: m.status === MeterStatus.ACTIVE ? MeterStatus.INACTIVE : MeterStatus.ACTIVE } 
        : m
    ));
  };

  const filteredMeters = meters.filter(m => 
    m.meterNumber.includes(search) || 
    m.tenantName.toLowerCase().includes(search.toLowerCase()) ||
    m.property.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meter Registry</h1>
          <p className="text-slate-500">Manage 11-digit electricity meters and assignments</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-[#0071bc] to-[#7dc242] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:opacity-90 transition-all flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span>Register New Meter</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text"
              placeholder="Search by Meter #, Tenant, or Property..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071bc] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 px-2 whitespace-nowrap">
            <span>Showing {filteredMeters.length} meters</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Meter Details</th>
                <th className="px-6 py-4">Assignment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMeters.map((meter) => (
                <tr key={meter.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#0071bc]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 font-mono tracking-wider">{meter.meterNumber}</p>
                        <p className="text-xs text-slate-500">UID: {meter.id.split('-')[0]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{meter.tenantName}</p>
                      <p className="text-xs text-slate-500">{meter.property} • {meter.unit}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      meter.status === MeterStatus.ACTIVE 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-600'
                    }`}>
                      {meter.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-slate-500">{new Date(meter.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleOpenEdit(meter)}
                        className="p-2 text-slate-400 hover:text-[#0071bc] hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Meter"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button 
                        onClick={() => toggleStatus(meter.id)}
                        className={`p-2 rounded-lg transition-all ${
                          meter.status === MeterStatus.ACTIVE 
                          ? 'text-red-400 hover:text-red-600 hover:bg-red-50' 
                          : 'text-green-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={meter.status === MeterStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                      >
                        {meter.status === MeterStatus.ACTIVE ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMeters.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                      <p className="text-slate-500 font-medium">No results found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{editingMeter ? 'Edit Meter' : 'Register New Meter'}</h3>
                <p className="text-sm text-slate-500 mt-1">Specify building location and tenant details.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-start space-x-2 border border-red-100 animate-in shake duration-300">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Meter Number (11 Digits)</label>
                  <input 
                    type="text"
                    required
                    maxLength={11}
                    value={formData.meterNumber}
                    onChange={(e) => setFormData({...formData, meterNumber: e.target.value.replace(/\D/g, '')})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0071bc] focus:outline-none transition-all font-mono tracking-widest text-lg"
                    placeholder="XXXXXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tenant Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.tenantName}
                    onChange={(e) => setFormData({...formData, tenantName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0071bc] focus:outline-none transition-all"
                    placeholder="Occupant Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Property</label>
                  <input 
                    type="text"
                    required
                    value={formData.property}
                    onChange={(e) => setFormData({...formData, property: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0071bc] focus:outline-none transition-all"
                    placeholder="Estate / Building"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Unit / Suite</label>
                  <input 
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0071bc] focus:outline-none transition-all"
                    placeholder="Flat # or Office #"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Initial Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as MeterStatus})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0071bc] focus:outline-none transition-all"
                  >
                    <option value={MeterStatus.ACTIVE}>Active</option>
                    <option value={MeterStatus.INACTIVE}>Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 px-6 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 px-6 bg-[#0071bc] text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:opacity-95 transition-all"
                >
                  {editingMeter ? 'Update Record' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeterManagement;
