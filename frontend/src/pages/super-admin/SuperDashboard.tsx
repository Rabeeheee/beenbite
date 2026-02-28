import { motion } from 'framer-motion';
import { Building2, Users, CreditCard, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';

const monthlyRevenue = [
  { month: 'Jan', revenue: 42000 }, { month: 'Feb', revenue: 48000 }, { month: 'Mar', revenue: 55000 },
  { month: 'Apr', revenue: 51000 }, { month: 'May', revenue: 63000 }, { month: 'Jun', revenue: 72000 },
];

const companyGrowth = [
  { month: 'Jan', companies: 12 }, { month: 'Feb', companies: 18 }, { month: 'Mar', companies: 25 },
  { month: 'Apr', companies: 31 }, { month: 'May', companies: 38 }, { month: 'Jun', companies: 47 },
];

const planDistribution = [
  { name: 'Starter', value: 35, color: '#818cf8' },
  { name: 'Professional', value: 42, color: '#6366f1' },
  { name: 'Enterprise', value: 23, color: '#4338ca' },
];

const recentCompanies = [
  { name: 'Brew House', plan: 'Professional', status: 'active', users: 234, joinedAt: '2024-03-12' },
  { name: 'Fresh Bites', plan: 'Starter', status: 'trial', users: 56, joinedAt: '2024-03-10' },
  { name: 'Sushi Express', plan: 'Enterprise', status: 'active', users: 890, joinedAt: '2024-03-08' },
  { name: 'Pizza Palace', plan: 'Professional', status: 'active', users: 412, joinedAt: '2024-03-05' },
  { name: 'Café Mocha', plan: 'Starter', status: 'pending', users: 0, joinedAt: '2024-03-03' },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700', trial: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700', suspended: 'bg-red-100 text-red-700',
};

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function SuperDashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Companies', value: '47', change: '+12%', up: true, icon: Building2, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Total Users', value: '12,847', change: '+18%', up: true, icon: Users, color: 'bg-blue-50 text-blue-600' },
          { label: 'Monthly Revenue', value: '₹7,20,000', change: '+24%', up: true, icon: CreditCard, color: 'bg-green-50 text-green-600' },
          { label: 'Platform MRR', value: '₹3,45,000', change: '-2%', up: false, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon className="w-5 h-5" /></div>
              <span className={`flex items-center text-xs font-medium ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="card lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Platform Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="card">
          <h3 className="font-bold text-gray-900 mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {planDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v} companies`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {planDistribution.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-gray-500">{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Company Growth + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="card">
          <h3 className="font-bold text-gray-900 mb-4">Company Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={companyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="companies" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="card">
          <h3 className="font-bold text-gray-900 mb-4">Recent Companies</h3>
          <div className="space-y-3">
            {recentCompanies.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">{c.name.charAt(0)}</div>
                  <div>
                    <p className="font-medium text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.plan} • {c.users} users</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
