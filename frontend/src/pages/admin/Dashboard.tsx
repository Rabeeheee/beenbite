import { motion } from 'framer-motion';
import { Users, Gift, TrendingUp, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const stats = [
  { label: 'Total Users', value: '2,847', change: '+12.5%', up: true, icon: Users, color: 'bg-blue-100 text-blue-600' },
  { label: 'Active Rewards', value: '24', change: '+3', up: true, icon: Gift, color: 'bg-purple-100 text-purple-600' },
  { label: 'Redemptions', value: '12,409', change: '+8.2%', up: true, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
  { label: 'Page Views', value: '48.2K', change: '-2.1%', up: false, icon: Eye, color: 'bg-orange-100 text-orange-600' },
];

const monthlyData = [
  { month: 'Jan', users: 400, redemptions: 240 },
  { month: 'Feb', users: 530, redemptions: 380 },
  { month: 'Mar', users: 620, redemptions: 520 },
  { month: 'Apr', users: 780, redemptions: 650 },
  { month: 'May', users: 890, redemptions: 810 },
  { month: 'Jun', users: 1100, redemptions: 940 },
];

const rewardTypes = [
  { name: 'Points', value: 40, color: '#6366f1' },
  { name: 'Discount', value: 25, color: '#f97316' },
  { name: 'Cashback', value: 20, color: '#22c55e' },
  { name: 'Freebie', value: 15, color: '#ec4899' },
];

const recentUsers = [
  { name: 'Alice Johnson', email: 'alice@email.com', points: 1240, tier: 'Gold' },
  { name: 'Bob Smith', email: 'bob@email.com', points: 890, tier: 'Silver' },
  { name: 'Carol White', email: 'carol@email.com', points: 2100, tier: 'Platinum' },
  { name: 'Dave Brown', email: 'dave@email.com', points: 340, tier: 'Bronze' },
  { name: 'Eve Davis', email: 'eve@email.com', points: 670, tier: 'Silver' },
];

const tierColors: Record<string, string> = {
  Bronze: 'bg-amber-100 text-amber-700',
  Silver: 'bg-gray-100 text-gray-700',
  Gold: 'bg-yellow-100 text-yellow-700',
  Platinum: 'bg-purple-100 text-purple-700',
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your business.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial="hidden" animate="visible" variants={fadeUp} custom={i} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Monthly Trend */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Monthly Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="redemptions" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Reward Distribution */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="card">
          <h3 className="text-lg font-semibold mb-4">Reward Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={rewardTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {rewardTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {rewardTypes.map((rt) => (
              <div key={rt.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rt.color }} />
                {rt.name} ({rt.value}%)
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Users */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Points</th>
                <th className="pb-3 font-medium">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentUsers.map((user) => (
                <tr key={user.email} className="hover:bg-gray-50/50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-gray-700">{user.points.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${tierColors[user.tier]}`}>
                      {user.tier}
                    </span>
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
