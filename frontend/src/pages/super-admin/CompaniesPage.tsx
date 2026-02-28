import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, Eye, Shield, Ban, CheckCircle, X, Globe, Users, CreditCard } from 'lucide-react';

const mockCompanies = [
  { id: '1', name: 'Brew House', email: 'admin@brewhouse.com', industry: 'Café', plan: 'Professional', status: 'active', users: 234, revenue: 12500, createdAt: '2024-01-10', verified: true },
  { id: '2', name: 'Fresh Bites', email: 'hi@freshbites.com', industry: 'Restaurant', plan: 'Starter', status: 'trial', users: 56, revenue: 0, createdAt: '2024-03-01', verified: false },
  { id: '3', name: 'Sushi Express', email: 'info@sushiexpress.com', industry: 'Restaurant', plan: 'Enterprise', status: 'active', users: 890, revenue: 45000, createdAt: '2024-01-05', verified: true },
  { id: '4', name: 'Pizza Palace', email: 'admin@pizzapalace.com', industry: 'Restaurant', plan: 'Professional', status: 'active', users: 412, revenue: 22000, createdAt: '2024-02-15', verified: true },
  { id: '5', name: 'Café Mocha', email: 'mocha@cafe.com', industry: 'Café', plan: 'Starter', status: 'pending', users: 0, revenue: 0, createdAt: '2024-03-12', verified: false },
  { id: '6', name: 'Green Leaf', email: 'info@greenleaf.com', industry: 'Health Food', plan: 'Professional', status: 'suspended', users: 178, revenue: 8500, createdAt: '2024-01-20', verified: true },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700', trial: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700', suspended: 'bg-red-100 text-red-700',
};

const planColors: Record<string, string> = {
  Starter: 'bg-gray-100 text-gray-700', Professional: 'bg-indigo-100 text-indigo-700', Enterprise: 'bg-purple-100 text-purple-700',
};

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<typeof mockCompanies[0] | null>(null);

  const filtered = mockCompanies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? c.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
        <p className="text-gray-500">Manage registered companies on the platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: '47', color: 'text-indigo-600' },
          { label: 'Active', value: '38', color: 'text-green-600' },
          { label: 'On Trial', value: '6', color: 'text-blue-600' },
          { label: 'Pending', value: '3', color: 'text-yellow-600' },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search companies..." className="input-field pl-10 text-sm" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto text-sm">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Company</th>
                <th className="px-6 py-3 font-medium">Industry</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Users</th>
                <th className="px-6 py-3 font-medium">Revenue</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Verified</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold">{company.name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <p className="text-xs text-gray-400">{company.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{company.industry}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[company.plan]}`}>{company.plan}</span></td>
                  <td className="px-6 py-4 text-sm font-medium">{company.users.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium">₹{company.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[company.status]}`}>{company.status}</span></td>
                  <td className="px-6 py-4">
                    {company.verified ? <CheckCircle className="w-5 h-5 text-green-500" /> : <span className="text-xs text-gray-400">Not verified</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedCompany(company)} className="p-1.5 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4 text-gray-400" /></button>
                      {company.status !== 'suspended' ? (
                        <button className="p-1.5 rounded-lg hover:bg-red-50"><Ban className="w-4 h-4 text-red-400" /></button>
                      ) : (
                        <button className="p-1.5 rounded-lg hover:bg-green-50"><CheckCircle className="w-4 h-4 text-green-500" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Company Detail Drawer */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="bg-white w-full max-w-md shadow-xl overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold">Company Details</h2>
                <button onClick={() => setSelectedCompany(null)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">{selectedCompany.name.charAt(0)}</div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedCompany.name}</h3>
                    <p className="text-sm text-gray-500">{selectedCompany.industry}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Plan', value: selectedCompany.plan, icon: CreditCard },
                    { label: 'Users', value: selectedCompany.users.toLocaleString(), icon: Users },
                    { label: 'Revenue', value: `₹${selectedCompany.revenue.toLocaleString()}`, icon: CreditCard },
                    { label: 'Joined', value: selectedCompany.createdAt, icon: Globe },
                  ].map((d) => (
                    <div key={d.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><d.icon className="w-3.5 h-3.5" /><span className="text-xs">{d.label}</span></div>
                      <p className="font-semibold text-sm">{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                  <span className="text-sm font-medium">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedCompany.status]}`}>{selectedCompany.status}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                  <span className="text-sm font-medium">Verified</span>
                  {selectedCompany.verified ? <CheckCircle className="w-5 h-5 text-green-500" /> : <button className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors">Verify Now</button>}
                </div>
                <div className="flex gap-3 pt-4">
                  {selectedCompany.status !== 'suspended' ? (
                    <button className="flex-1 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">Suspend</button>
                  ) : (
                    <button className="flex-1 py-2.5 text-sm font-medium text-green-600 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">Reactivate</button>
                  )}
                  <button className="flex-1 btn-primary text-sm">Message</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
