import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Search, ArrowUpRight, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const mockSubscriptions = [
  { id: '1', company: 'Brew House', plan: 'Professional', amount: 1499, status: 'active', startDate: '2024-01-15', endDate: '2024-04-15', autoRenew: true },
  { id: '2', company: 'Fresh Bites', plan: 'Starter', amount: 0, status: 'trial', startDate: '2024-03-01', endDate: '2024-03-15', autoRenew: false },
  { id: '3', company: 'Sushi Express', plan: 'Enterprise', amount: 1999, status: 'active', startDate: '2024-01-05', endDate: '2024-04-05', autoRenew: true },
  { id: '4', company: 'Pizza Palace', plan: 'Professional', amount: 1499, status: 'active', startDate: '2024-02-15', endDate: '2024-05-15', autoRenew: true },
  { id: '5', company: 'Café Mocha', plan: 'Starter', amount: 999, status: 'pending', startDate: '2024-03-12', endDate: '-', autoRenew: false },
  { id: '6', company: 'Green Leaf', plan: 'Professional', amount: 1499, status: 'expired', startDate: '2024-01-20', endDate: '2024-03-20', autoRenew: false },
  { id: '7', company: 'Taco Town', plan: 'Starter', amount: 999, status: 'cancelled', startDate: '2024-02-01', endDate: '2024-03-01', autoRenew: false },
];

const statusConfig: Record<string, { color: string; icon: any }> = {
  active: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  trial: { color: 'bg-blue-100 text-blue-700', icon: Clock },
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
  expired: { color: 'bg-gray-100 text-gray-500', icon: XCircle },
  cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle },
};

const planColors: Record<string, string> = {
  Starter: 'bg-gray-100 text-gray-700', Professional: 'bg-indigo-100 text-indigo-700', Enterprise: 'bg-purple-100 text-purple-700',
};

export default function SubscriptionsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPlan, setFilterPlan] = useState('');

  const filtered = mockSubscriptions.filter((s) => {
    const matchSearch = s.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? s.status === filterStatus : true;
    const matchPlan = filterPlan ? s.plan === filterPlan : true;
    return matchSearch && matchStatus && matchPlan;
  });

  const totalMRR = mockSubscriptions.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.amount, 0);
  const activeCount = mockSubscriptions.filter((s) => s.status === 'active').length;
  const trialCount = mockSubscriptions.filter((s) => s.status === 'trial').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-500">Monitor and manage platform subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active MRR', value: `₹${totalMRR.toLocaleString()}`, change: '+18%', color: 'text-green-600' },
          { label: 'Active Subs', value: String(activeCount), change: '+5', color: 'text-indigo-600' },
          { label: 'On Trial', value: String(trialCount), change: '2 expiring', color: 'text-blue-600' },
          { label: 'Churn Rate', value: '3.2%', change: '-0.5%', color: 'text-orange-600' },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> {s.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by company..." className="input-field pl-10 text-sm" />
        </div>
        <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} className="input-field w-auto text-sm">
          <option value="">All Plans</option>
          <option value="Starter">Starter</option>
          <option value="Professional">Professional</option>
          <option value="Enterprise">Enterprise</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto text-sm">
          <option value="">All Statuses</option>
          {Object.keys(statusConfig).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Start Date</th>
                <th className="px-6 py-3 font-medium">End Date</th>
                <th className="px-6 py-3 font-medium">Auto-Renew</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((sub) => {
                const StatusIcon = statusConfig[sub.status]?.icon || Clock;
                return (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">{sub.company.charAt(0)}</div>
                        <span className="font-medium text-gray-900">{sub.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[sub.plan]}`}>{sub.plan}</span></td>
                    <td className="px-6 py-4 font-semibold">{sub.amount > 0 ? `₹${sub.amount}` : 'Free'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[sub.status]?.color}`}>
                        <StatusIcon className="w-3 h-3" /> {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sub.startDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sub.endDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${sub.autoRenew ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {sub.autoRenew ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
