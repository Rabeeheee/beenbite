import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Plus, Search, Edit2, Trash2, X, Tag, Percent, DollarSign, Award, Ticket, Star } from 'lucide-react';

const rewardTypeIcons: Record<string, any> = {
  points: Star, discount: Percent, cashback: DollarSign, freebie: Gift, coupon: Ticket, badge: Award,
};

const rewardTypeColors: Record<string, string> = {
  points: 'bg-blue-100 text-blue-700', discount: 'bg-green-100 text-green-700',
  cashback: 'bg-purple-100 text-purple-700', freebie: 'bg-pink-100 text-pink-700',
  coupon: 'bg-orange-100 text-orange-700', badge: 'bg-indigo-100 text-indigo-700',
};

const mockRewards = [
  { id: '1', name: '10% Off Next Purchase', type: 'discount', value: 10, minPoints: 100, minVisits: 5, isActive: true, redemptions: 234, createdAt: '2024-01-10' },
  { id: '2', name: 'Free Coffee', type: 'freebie', value: 0, minPoints: 200, minVisits: 10, isActive: true, redemptions: 156, createdAt: '2024-01-15' },
  { id: '3', name: '₹50 Cashback', type: 'cashback', value: 50, minPoints: 300, minVisits: 0, isActive: true, redemptions: 89, createdAt: '2024-02-01' },
  { id: '4', name: 'Double Points Week', type: 'points', value: 2, minPoints: 0, minVisits: 3, isActive: false, redemptions: 512, createdAt: '2024-02-10' },
  { id: '5', name: 'Birthday Coupon', type: 'coupon', value: 25, minPoints: 0, minVisits: 0, isActive: true, redemptions: 78, createdAt: '2024-03-01' },
  { id: '6', name: 'Loyalty Badge', type: 'badge', value: 0, minPoints: 500, minVisits: 20, isActive: true, redemptions: 45, createdAt: '2024-03-05' },
];

interface RewardForm {
  name: string; type: string; value: string; minPoints: string; minVisits: string; description: string;
}

const emptyForm: RewardForm = { name: '', type: 'discount', value: '', minPoints: '', minVisits: '', description: '' };

export default function RewardsPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<RewardForm>(emptyForm);

  const filtered = mockRewards.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType ? r.type === filterType : true;
    return matchSearch && matchType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call would go here
    setShowModal(false);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
          <p className="text-gray-500">Create and manage your loyalty rewards</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Create Reward
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Rewards', value: '24', icon: Gift, color: 'text-primary-600' },
          { label: 'Active', value: '18', icon: Tag, color: 'text-green-600' },
          { label: 'Total Redemptions', value: '1,114', icon: Star, color: 'text-orange-600' },
          { label: 'Avg. Redemptions', value: '186', icon: Award, color: 'text-purple-600' },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gray-50 ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search rewards..." className="input-field pl-10 text-sm" />
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field w-auto text-sm">
          <option value="">All Types</option>
          {Object.keys(rewardTypeColors).map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>

      {/* Reward Cards Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((reward) => {
            const Icon = rewardTypeIcons[reward.type] || Gift;
            return (
              <motion.div
                key={reward.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${rewardTypeColors[reward.type]}`}><Icon className="w-5 h-5" /></div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{reward.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span className={`px-2 py-0.5 rounded-full ${rewardTypeColors[reward.type]} text-xs`}>{reward.type}</span>
                  {reward.value > 0 && <span>Value: {reward.type === 'cashback' ? `₹${reward.value}` : reward.type === 'discount' ? `${reward.value}%` : `${reward.value}x`}</span>}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 text-center text-xs">
                  <div><p className="text-gray-400">Min Points</p><p className="font-semibold">{reward.minPoints || '-'}</p></div>
                  <div><p className="text-gray-400">Min Visits</p><p className="font-semibold">{reward.minVisits || '-'}</p></div>
                  <div><p className="text-gray-400">Redeemed</p><p className="font-semibold">{reward.redemptions}</p></div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-full ${reward.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {reward.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-gray-400">Created {reward.createdAt}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Create Reward Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Create Reward</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" placeholder="e.g. 10% Off Next Purchase" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field text-sm">
                    {Object.keys(rewardTypeColors).map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="input-field text-sm" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Points</label>
                    <input type="number" value={form.minPoints} onChange={(e) => setForm({ ...form, minPoints: e.target.value })} className="input-field text-sm" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Visits</label>
                  <input type="number" value={form.minVisits} onChange={(e) => setForm({ ...form, minVisits: e.target.value })} className="input-field text-sm" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm resize-none" placeholder="Describe the reward..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary text-sm">Create Reward</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
