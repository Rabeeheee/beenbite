import { motion } from 'framer-motion';
import { TrendingUp, Users, Building2, CreditCard, Gift, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const revenueByMonth = [
  { month: 'Jan', starter: 12000, professional: 28000, enterprise: 18000 },
  { month: 'Feb', starter: 14000, professional: 32000, enterprise: 20000 },
  { month: 'Mar', starter: 15000, professional: 35000, enterprise: 24000 },
  { month: 'Apr', starter: 18000, professional: 38000, enterprise: 22000 },
  { month: 'May', starter: 20000, professional: 42000, enterprise: 28000 },
  { month: 'Jun', starter: 22000, professional: 48000, enterprise: 30000 },
];

const userGrowth = [
  { month: 'Jan', users: 3200 }, { month: 'Feb', users: 4800 }, { month: 'Mar', users: 6100 },
  { month: 'Apr', users: 7900 }, { month: 'May', users: 9500 }, { month: 'Jun', users: 12847 },
];

const industryBreakdown = [
  { name: 'Restaurant', value: 42, color: '#6366f1' },
  { name: 'Café', value: 28, color: '#818cf8' },
  { name: 'Retail', value: 15, color: '#a5b4fc' },
  { name: 'Health Food', value: 8, color: '#c7d2fe' },
  { name: 'Other', value: 7, color: '#e0e7ff' },
];

const rewardTypeUsage = [
  { type: 'Discount', count: 1240 }, { type: 'Cashback', count: 890 }, { type: 'Points', count: 2100 },
  { type: 'Freebie', count: 560 }, { type: 'Coupon', count: 780 }, { type: 'Badge', count: 340 },
];

const topCompanies = [
  { name: 'Sushi Express', users: 890, revenue: 45000, rewards: 56 },
  { name: 'Pizza Palace', users: 412, revenue: 22000, rewards: 34 },
  { name: 'Brew House', users: 234, revenue: 12500, rewards: 28 },
  { name: 'Green Leaf', users: 178, revenue: 8500, rewards: 15 },
  { name: 'Taco Town', users: 156, revenue: 6200, rewards: 12 },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function AnalyticsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-gray-500">Comprehensive insights across the entire platform</p>
      </div>

      {/* KPI Cards */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Revenue', value: '₹10,00,000', change: '+24%', up: true, icon: CreditCard, color: 'bg-green-50 text-green-600' },
          { label: 'Companies', value: '47', change: '+12', up: true, icon: Building2, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'End Users', value: '12,847', change: '+18%', up: true, icon: Users, color: 'bg-blue-50 text-blue-600' },
          { label: 'Rewards Given', value: '5,910', change: '+32%', up: true, icon: Gift, color: 'bg-purple-50 text-purple-600' },
          { label: 'Conversion', value: '68%', change: '-3%', up: false, icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-xl ${s.color}`}><s.icon className="w-4 h-4" /></div>
              <span className={`flex items-center text-xs font-medium ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {s.change}
              </span>
            </div>
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Breakdown + User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="card">
          <h3 className="font-bold text-gray-900 mb-4">Revenue by Plan</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
              <Bar dataKey="starter" fill="#a5b4fc" radius={[4, 4, 0, 0]} name="Starter" />
              <Bar dataKey="professional" fill="#6366f1" radius={[4, 4, 0, 0]} name="Professional" />
              <Bar dataKey="enterprise" fill="#4338ca" radius={[4, 4, 0, 0]} name="Enterprise" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="card">
          <h3 className="font-bold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Users']} />
              <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fill="url(#userGrowthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Industry + Reward Type Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="card">
          <h3 className="font-bold text-gray-900 mb-4">Industry Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={industryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                {industryBreakdown.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {industryBreakdown.map((i) => (
              <div key={i.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: i.color }} />
                  <span className="text-gray-600">{i.name}</span>
                </div>
                <span className="font-semibold">{i.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <h3 className="font-bold text-gray-900 mb-4">Reward Type Usage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rewardTypeUsage} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 12 }} stroke="#9ca3af" width={70} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="card">
          <h3 className="font-bold text-gray-900 mb-4">Top Companies</h3>
          <div className="space-y-3">
            {topCompanies.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'}`}>
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.users} users • {c.rewards} rewards</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">₹{(c.revenue / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
