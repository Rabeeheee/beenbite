import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Save, Eye, RotateCcw } from 'lucide-react';

const fontOptions = ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Nunito', 'Lato'];
const borderRadiusOptions = ['None', 'Small', 'Medium', 'Large', 'Full'];

export default function ThemePage() {
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#f97316');
  const [backgroundColor, setBackgroundColor] = useState('#f9fafb');
  const [textColor, setTextColor] = useState('#111827');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [borderRadius, setBorderRadius] = useState('Medium');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const resetDefaults = () => {
    setPrimaryColor('#6366f1'); setAccentColor('#f97316'); setBackgroundColor('#f9fafb');
    setTextColor('#111827'); setFontFamily('Inter'); setBorderRadius('Medium');
    setLogoUrl(''); setBannerUrl(''); setDarkMode(false);
  };

  const radiusMap: Record<string, string> = { None: '0', Small: '0.375rem', Medium: '0.75rem', Large: '1rem', Full: '9999px' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theme Builder</h1>
          <p className="text-gray-500">Customize your loyalty portal appearance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetDefaults} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button className="btn-primary flex items-center gap-2 text-sm"><Save className="w-4 h-4" /> Publish Theme</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-4">
            <h3 className="font-semibold flex items-center gap-2"><Palette className="w-5 h-5 text-primary-600" /> Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Primary', value: primaryColor, onChange: setPrimaryColor },
                { label: 'Accent', value: accentColor, onChange: setAccentColor },
                { label: 'Background', value: backgroundColor, onChange: setBackgroundColor },
                { label: 'Text', value: textColor, onChange: setTextColor },
              ].map((c) => (
                <div key={c.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{c.label}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={c.value} onChange={(e) => c.onChange(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                    <input value={c.value} onChange={(e) => c.onChange(e.target.value)} className="input-field text-sm flex-1" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card space-y-4">
            <h3 className="font-semibold">Typography & Shape</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="input-field text-sm">
                  {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                <select value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="input-field text-sm">
                  {borderRadiusOptions.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div><p className="font-medium text-sm">Dark Mode</p><p className="text-xs text-gray-400">Enable dark theme</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card space-y-4">
            <h3 className="font-semibold">Branding</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="input-field text-sm" placeholder="https://example.com/logo.png" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
              <input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} className="input-field text-sm" placeholder="https://example.com/banner.jpg" />
            </div>
          </motion.div>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold">Live Preview</h3>
            </div>
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ fontFamily, backgroundColor: darkMode ? '#1f2937' : backgroundColor }}>
              {/* Header */}
              <div className="p-5" style={{ backgroundColor: primaryColor }}>
                <div className="flex items-center gap-3">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">B</div>
                  )}
                  <div>
                    <h4 className="text-white font-bold text-lg">Your Loyalty Portal</h4>
                    <p className="text-white/70 text-sm">Welcome back, User!</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Points Card */}
                <div className="p-4 rounded-xl" style={{ backgroundColor: primaryColor + '10', borderRadius: radiusMap[borderRadius] }}>
                  <p className="text-sm" style={{ color: darkMode ? '#d1d5db' : '#6b7280' }}>Your Points</p>
                  <p className="text-3xl font-bold" style={{ color: primaryColor }}>1,240</p>
                  <div className="w-full h-2 rounded-full mt-2" style={{ backgroundColor: primaryColor + '20' }}>
                    <div className="h-2 rounded-full w-3/4" style={{ backgroundColor: primaryColor }} />
                  </div>
                </div>

                {/* Reward Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {['10% Off', 'Free Coffee'].map((r) => (
                    <div key={r} className="p-3 border border-gray-100 text-center" style={{ borderRadius: radiusMap[borderRadius], backgroundColor: darkMode ? '#374151' : '#fff' }}>
                      <p className="text-sm font-medium" style={{ color: darkMode ? '#e5e7eb' : textColor }}>{r}</p>
                      <button className="mt-2 px-3 py-1 text-white text-xs font-medium" style={{ backgroundColor: accentColor, borderRadius: radiusMap[borderRadius] }}>Redeem</button>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button className="w-full py-3 text-white font-medium text-sm" style={{ backgroundColor: primaryColor, borderRadius: radiusMap[borderRadius] }}>
                  View All Rewards
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
