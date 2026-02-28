import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, Edit2, Trash2, X, Search, Building2, Gift, HelpCircle, Settings } from 'lucide-react';

// --- Tabs ---
const tabs = [
  { id: 'industries', label: 'Industries', icon: Building2 },
  { id: 'reward-templates', label: 'Reward Templates', icon: Gift },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'configs', label: 'Platform Config', icon: Settings },
];

const mockIndustries = [
  { id: '1', name: 'Restaurant', slug: 'restaurant', companiesCount: 42, isActive: true },
  { id: '2', name: 'Café', slug: 'cafe', companiesCount: 28, isActive: true },
  { id: '3', name: 'Retail', slug: 'retail', companiesCount: 15, isActive: true },
  { id: '4', name: 'Health Food', slug: 'health-food', companiesCount: 8, isActive: true },
  { id: '5', name: 'Gym & Fitness', slug: 'gym-fitness', companiesCount: 3, isActive: false },
];

const mockTemplates = [
  { id: '1', name: 'First Visit Bonus', type: 'points', description: 'Award extra points on first visit', defaultValue: 100, usedBy: 18 },
  { id: '2', name: 'Birthday Discount', type: 'discount', description: 'Special discount on birthday', defaultValue: 15, usedBy: 32 },
  { id: '3', name: 'Referral Reward', type: 'cashback', description: 'Cashback for successful referrals', defaultValue: 50, usedBy: 24 },
  { id: '4', name: 'Loyalty Badge', type: 'badge', description: 'Badge after 50 visits', defaultValue: 0, usedBy: 12 },
];

const mockFaqs = [
  { id: '1', question: 'How do I earn points?', answer: 'Points are earned automatically with each purchase at participating stores.', category: 'Points', order: 1 },
  { id: '2', question: 'How do I redeem rewards?', answer: 'Visit the Rewards section and choose an available reward to redeem.', category: 'Rewards', order: 2 },
  { id: '3', question: 'What are tiers?', answer: 'Tiers (Bronze, Silver, Gold, Platinum) unlock new benefits as you accumulate points.', category: 'Tiers', order: 3 },
];

const mockConfigs = [
  { id: '1', key: 'platform_name', value: 'BeenBite', description: 'Platform display name' },
  { id: '2', key: 'default_trial_days', value: '14', description: 'Default trial period in days' },
  { id: '3', key: 'max_users_starter', value: '500', description: 'Max users for Starter plan' },
  { id: '4', key: 'max_users_professional', value: '2000', description: 'Max users for Professional plan' },
  { id: '5', key: 'gst_rate', value: '18', description: 'GST percentage applied to invoices' },
  { id: '6', key: 'support_email', value: 'support@beenbite.com', description: 'Platform support email' },
];

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState('industries');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
        <p className="text-gray-500">Manage platform-wide master data and configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Industries */}
        {activeTab === 'industries' && (
          <motion.div key="industries" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search industries..." className="input-field pl-10 text-sm" />
              </div>
              <button className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Industry</button>
            </div>
            <div className="card overflow-hidden p-0">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Slug</th>
                    <th className="px-6 py-3 font-medium">Companies</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockIndustries.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())).map((ind) => (
                    <tr key={ind.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{ind.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-400">/{ind.slug}</td>
                      <td className="px-6 py-4 text-sm">{ind.companiesCount}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs ${ind.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{ind.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="px-6 py-4 flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Reward Templates */}
        {activeTab === 'reward-templates' && (
          <motion.div key="templates" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Pre-built reward templates that companies can use</p>
              <button className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add Template</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTemplates.map((t) => (
                <div key={t.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary-100 text-primary-600"><Gift className="w-5 h-5" /></div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t.type}</span>
                  </div>
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t.description}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>{t.defaultValue > 0 ? `Default: ${t.defaultValue}` : 'No value'}</span>
                    <span>Used by {t.usedBy} companies</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQs */}
        {activeTab === 'faqs' && (
          <motion.div key="faqs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Manage platform FAQs shown to end users</p>
              <button className="btn-primary flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Add FAQ</button>
            </div>
            <div className="space-y-3">
              {mockFaqs.map((faq) => (
                <div key={faq.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{faq.category}</span>
                        <span className="text-xs text-gray-400">#{faq.order}</span>
                      </div>
                      <h3 className="font-semibold">{faq.question}</h3>
                      <p className="text-sm text-gray-500 mt-1">{faq.answer}</p>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Platform Config */}
        {activeTab === 'configs' && (
          <motion.div key="configs" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
            <p className="text-sm text-gray-500">Platform-wide configuration values</p>
            <div className="card overflow-hidden p-0">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Key</th>
                    <th className="px-6 py-3 font-medium">Value</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockConfigs.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-primary-600">{c.key}</td>
                      <td className="px-6 py-4 font-semibold text-sm">{c.value}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{c.description}</td>
                      <td className="px-6 py-4"><button className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-400" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
