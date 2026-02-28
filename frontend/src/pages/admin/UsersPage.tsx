import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, MoreVertical, Mail, Phone, Star, Filter } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@email.com', phone: '+91 98765 43210', points: 1240, tier: 'Gold', visits: 34, status: 'active', joinedAt: '2024-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@email.com', phone: '+91 98765 43211', points: 890, tier: 'Silver', visits: 22, status: 'active', joinedAt: '2024-02-20' },
  { id: '3', name: 'Carol White', email: 'carol@email.com', phone: '+91 98765 43212', points: 2100, tier: 'Platinum', visits: 56, status: 'active', joinedAt: '2024-01-05' },
  { id: '4', name: 'Dave Brown', email: 'dave@email.com', phone: '+91 98765 43213', points: 340, tier: 'Bronze', visits: 8, status: 'inactive', joinedAt: '2024-03-10' },
  { id: '5', name: 'Eve Davis', email: 'eve@email.com', phone: '+91 98765 43214', points: 670, tier: 'Silver', visits: 18, status: 'active', joinedAt: '2024-02-01' },
  { id: '6', name: 'Frank Wilson', email: 'frank@email.com', phone: '+91 98765 43215', points: 1560, tier: 'Gold', visits: 42, status: 'active', joinedAt: '2024-01-22' },
];

const tierColors: Record<string, string> = {
  Bronze: 'bg-amber-100 text-amber-700', Silver: 'bg-gray-100 text-gray-700',
  Gold: 'bg-yellow-100 text-yellow-700', Platinum: 'bg-purple-100 text-purple-700',
};

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('');

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier ? u.tier === filterTier : true;
    return matchSearch && matchTier;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500">Manage your loyalty program members</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '2,847', color: 'bg-blue-50 text-blue-600' },
          { label: 'Active', value: '2,612', color: 'bg-green-50 text-green-600' },
          { label: 'New This Month', value: '184', color: 'bg-purple-50 text-purple-600' },
          { label: 'Avg. Points', value: '680', color: 'bg-orange-50 text-orange-600' },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color.split(' ')[1]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-10 text-sm" />
        </div>
        <select value={filterTier} onChange={(e) => setFilterTier(e.target.value)} className="input-field w-auto text-sm">
          <option value="">All Tiers</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Points</th>
                <th className="px-6 py-3 font-medium">Tier</th>
                <th className="px-6 py-3 font-medium">Visits</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Joined</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-500"><Mail className="w-3 h-3" /> {user.email}</div>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-1"><Phone className="w-3 h-3" /> {user.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">{user.points.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${tierColors[user.tier]}`}>{user.tier}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.visits}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{user.joinedAt}</td>
                  <td className="px-6 py-4">
                    <button className="p-1 rounded-lg hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
