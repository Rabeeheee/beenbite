import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Bell, Shield, CreditCard, Globe, Save, Eye } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [companyName, setCompanyName] = useState('BeenBite Café');
  const [companyEmail, setCompanyEmail] = useState('admin@beenbitecafe.com');
  const [companyPhone, setCompanyPhone] = useState('+91 98765 43210');
  const [website, setWebsite] = useState('https://beenbitecafe.com');
  const [address, setAddress] = useState('123 MG Road, Bangalore, KA 560001');

  // Theme
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#f97316');
  const [logoUrl, setLogoUrl] = useState('');
  const [fontFamily, setFontFamily] = useState('Inter');

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(false);
  const [welcomeEmail, setWelcomeEmail] = useState(true);
  const [rewardEmail, setRewardEmail] = useState(true);

  // Security
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your company preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="card p-2 lg:sticky lg:top-6 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50'}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card">

            {/* General */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">General Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className="input-field text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input value={website} onChange={(e) => setWebsite(e.target.value)} className="input-field text-sm pl-10" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="input-field text-sm resize-none" />
                </div>
                <button className="btn-primary flex items-center gap-2 text-sm"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            )}

            {/* Theme */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Theme Customization</h2>
                <p className="text-sm text-gray-500">Customize the look and feel of your loyalty portal</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                      <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="input-field text-sm flex-1" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                      <input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="input-field text-sm flex-1" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="input-field text-sm" placeholder="https://example.com/logo.png" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                    <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="input-field text-sm">
                      {['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat'].map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                {/* Live Preview */}
                <div className="p-6 rounded-xl border-2 border-dashed border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Live Preview</h3>
                  <div className="rounded-xl overflow-hidden shadow-sm" style={{ fontFamily }}>
                    <div className="p-4" style={{ backgroundColor: primaryColor }}>
                      <h4 className="text-white font-bold">Your Loyalty Portal</h4>
                      <p className="text-white/80 text-sm">Welcome back!</p>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-gray-600 text-sm mb-2">Earn points with every purchase</p>
                      <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: accentColor }}>View Rewards</button>
                    </div>
                  </div>
                </div>
                <button className="btn-primary flex items-center gap-2 text-sm"><Save className="w-4 h-4" /> Save Theme</button>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Email Notifications', desc: 'Send notifications via email', checked: emailNotifs, onChange: setEmailNotifs },
                    { label: 'Push Notifications', desc: 'Send browser push notifications', checked: pushNotifs, onChange: setPushNotifs },
                    { label: 'WhatsApp Notifications', desc: 'Send notifications via WhatsApp', checked: whatsappNotifs, onChange: setWhatsappNotifs },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                      <div><p className="font-medium text-sm">{n.label}</p><p className="text-xs text-gray-500">{n.desc}</p></div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={n.checked} onChange={() => n.onChange(!n.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <h3 className="font-semibold text-sm pt-4">Email Templates</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Welcome Email', desc: 'Send when a new user registers', checked: welcomeEmail, onChange: setWelcomeEmail },
                    { label: 'Reward Notification', desc: 'Send when a reward is earned/redeemed', checked: rewardEmail, onChange: setRewardEmail },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                      <div><p className="font-medium text-sm">{t.label}</p><p className="text-xs text-gray-400">{t.desc}</p></div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={t.checked} onChange={() => t.onChange(!t.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <button className="btn-primary flex items-center gap-2 text-sm"><Save className="w-4 h-4" /> Save Preferences</button>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Security Settings</h2>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                  <div>
                    <p className="font-medium text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                  <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="input-field text-sm w-auto">
                    {['15', '30', '60', '120'].map((v) => <option key={v} value={v}>{v} min</option>)}
                  </select>
                </div>
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <h3 className="font-semibold text-sm text-red-700">Danger Zone</h3>
                  <p className="text-xs text-red-500 mt-1 mb-3">These actions are irreversible</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">Reset API Keys</button>
                    <button className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-xl hover:bg-red-200 transition-colors">Delete Account</button>
                  </div>
                </div>
                <button className="btn-primary flex items-center gap-2 text-sm"><Save className="w-4 h-4" /> Save Security Settings</button>
              </div>
            )}

            {/* Billing */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Billing & Subscription</h2>
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-primary-600 font-medium uppercase tracking-wide">Current Plan</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">Professional</p>
                      <p className="text-sm text-gray-500">₹1,499/month • Billed monthly</p>
                    </div>
                    <button className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors">Upgrade Plan</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500">Next Billing Date</p>
                    <p className="font-bold mt-1">15 Apr 2024</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="font-bold mt-1">₹14,990</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-3">Recent Invoices</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'INV-001', date: 'Mar 15, 2024', amount: '₹1,499', status: 'Paid' },
                      { id: 'INV-002', date: 'Feb 15, 2024', amount: '₹1,499', status: 'Paid' },
                      { id: 'INV-003', date: 'Jan 15, 2024', amount: '₹1,499', status: 'Paid' },
                    ].map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{inv.id}</p>
                            <p className="text-xs text-gray-400">{inv.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm">{inv.amount}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}
