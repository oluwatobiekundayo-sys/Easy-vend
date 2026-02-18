
import React from 'react';

const ArchitectureDocs: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto space-y-12 pb-20">
      <section>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Final System Blueprint</h1>
        <p className="text-xl text-slate-600 leading-relaxed">Phase 3: Dashboard, Reports, and Security Integration.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg text-sm">1</span>
          <span>Reporting & Audit Queries</span>
        </h2>
        <div className="bg-white border border-slate-200 rounded-2xl p-8 overflow-hidden shadow-sm">
          <pre className="text-slate-700 font-mono text-xs md:text-sm whitespace-pre-wrap">
{`-- Revenue by Date Range
SELECT 
    DATE(created_at) as date,
    SUM(amount) as gross_revenue,
    SUM(total_service_charge) as charges
FROM tokens 
WHERE created_at BETWEEN ? AND ?
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Service Earnings per Property
SELECT 
    m.property,
    SUM(t.total_service_charge) as total_earnings
FROM tokens t
JOIN meters m ON t.meter_id = m.id
GROUP BY m.property;`}
          </pre>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <span className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg text-sm">2</span>
          <span>Security Enhancements</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-2">Rate Limiting</h4>
              <p className="text-sm text-slate-600">Implemented using 'express-rate-limit'. 100 requests per 15 minutes per IP to prevent brute-force on login and vending.</p>
           </div>
           <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-2">Sanitization</h4>
              <p className="text-sm text-slate-600">All inputs are passed through 'DOMPurify' on frontend and 'joi' schema validation on backend to prevent XSS/Injection.</p>
           </div>
        </div>
      </section>

      <section className="bg-blue-600 rounded-3xl p-10 text-white shadow-2xl">
        <h2 className="text-2xl font-black mb-6">Deployment Guide</h2>
        <div className="space-y-8">
            <div>
                <h3 className="font-bold text-blue-100 uppercase tracking-widest text-sm mb-3">Local Setup</h3>
                <ul className="text-sm space-y-2 opacity-90">
                    <li>1. Install Node.js v18+</li>
                    <li>2. Create .env: DATABASE_URL, JWT_SECRET, PORT</li>
                    <li>3. Run migrations: <code className="bg-blue-800 px-2 py-1 rounded">npm run migrate</code></li>
                    <li>4. Start Dev: <code className="bg-blue-800 px-2 py-1 rounded">npm run dev</code></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-blue-100 uppercase tracking-widest text-sm mb-3">Production (Docker)</h3>
                <div className="bg-blue-800 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                    <pre>{`FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]`}</pre>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default ArchitectureDocs;
