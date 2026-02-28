import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Star, Zap, Shield, BarChart3, Smartphone, Gift, Users, TrendingUp,
  ChevronRight, Check, ArrowRight, Sparkles, Globe, Heart
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">BeenBite</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Pricing</a>
            <a href="#industries" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">Industries</a>
            <a href="#faq" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
          <div className="absolute top-40 -right-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>The #1 Reward Management Platform for Businesses</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Turn Every Customer Into a{' '}
              <span className="gradient-text">Loyal Fan</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Powerful reward programs, beautiful loyalty cards, and smart analytics — all in one platform.
              Boost retention by <span className="text-primary-600 font-semibold">40%</span> and watch your business grow.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg py-4 px-8 flex items-center gap-2 justify-center">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#demo" className="btn-secondary text-lg py-4 px-8 flex items-center gap-2 justify-center">
                Watch Demo <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="flex items-center justify-center gap-8 mt-10 text-sm text-gray-400">
              <div className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> 14-day free trial</div>
              <div className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> No credit card</div>
              <div className="flex items-center gap-1"><Check className="w-4 h-4 text-green-500" /> Cancel anytime</div>
            </motion.div>
          </motion.div>

          {/* Hero mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="glass rounded-3xl p-2 max-w-5xl mx-auto shadow-2xl">
              <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-purple-900 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
                  {/* Mock dashboard cards */}
                  <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-white">
                    <TrendingUp className="w-8 h-8 mb-3 text-green-400" />
                    <p className="text-3xl font-bold">2,847</p>
                    <p className="text-white/60 text-sm">Active Users</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-white">
                    <Gift className="w-8 h-8 mb-3 text-accent-400" />
                    <p className="text-3xl font-bold">12,409</p>
                    <p className="text-white/60 text-sm">Rewards Redeemed</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-white">
                    <Star className="w-8 h-8 mb-3 text-yellow-400" />
                    <p className="text-3xl font-bold">94%</p>
                    <p className="text-white/60 text-sm">Retention Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Grow</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-xl text-gray-500 max-w-2xl mx-auto">
              Comprehensive tools to create, manage, and scale your reward programs effortlessly.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Gift, title: 'Smart Rewards', desc: 'Points, discounts, cashback, coupons, badges — choose from 6+ reward types.', color: 'bg-primary-100 text-primary-600' },
              { icon: Smartphone, title: 'QR Scanner', desc: 'Customers scan, earn, and redeem — all from their phone. Zero friction.', color: 'bg-green-100 text-green-600' },
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time dashboards with customer insights, trends, and ROI tracking.', color: 'bg-blue-100 text-blue-600' },
              { icon: Shield, title: 'Multi-Tenant Security', desc: 'Each business gets isolated data with role-based access controls.', color: 'bg-red-100 text-red-600' },
              { icon: Zap, title: 'Theme Customization', desc: 'Full white-label UI with custom colors, fonts, and branding.', color: 'bg-accent-100 text-accent-600' },
              { icon: Globe, title: 'Industry Templates', desc: 'Pre-built reward templates for restaurants, salons, gyms, and more.', color: 'bg-purple-100 text-purple-600' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="card-hover group"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-xl text-gray-500">
              Start free for 14 days. No credit card required.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter', price: '₹999', period: '/mo', desc: 'Perfect for small businesses',
                features: ['QR Scanner', 'Up to 500 users', '4 reward types', 'Basic analytics', 'Email support', '50 products'],
                popular: false,
              },
              {
                name: 'Professional', price: '₹1,499', period: '/mo', desc: 'For growing businesses',
                features: ['Everything in Starter', 'Up to 2,000 users', '7 reward types', 'Advanced analytics', 'Social rewards & badges', '200 products', 'Priority support'],
                popular: true,
              },
              {
                name: 'Enterprise', price: '₹1,999', period: '/mo', desc: 'For large businesses',
                features: ['Everything in Professional', 'Unlimited users', 'All reward types', 'WhatsApp notifications', 'Google Review rewards', 'Custom domain', 'Dedicated support'],
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className={`relative rounded-3xl p-8 ${plan.popular
                  ? 'bg-gradient-to-br from-primary-600 to-purple-700 text-white shadow-2xl scale-105 z-10'
                  : 'bg-white border-2 border-gray-100 hover:border-primary-200'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>{plan.desc}</p>
                <div className="mb-8">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className={`text-lg ${plan.popular ? 'text-white/70' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.popular
                    ? 'bg-white text-primary-700 hover:bg-gray-100'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-4">
              Built for <span className="gradient-text">Every Industry</span>
            </motion.h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: '🍽️', name: 'Restaurants' },
              { icon: '☕', name: 'Cafes' },
              { icon: '💇', name: 'Salons' },
              { icon: '🏋️', name: 'Gyms' },
              { icon: '🛍️', name: 'Retail' },
              { icon: '🏨', name: 'Hotels' },
              { icon: '🏥', name: 'Healthcare' },
              { icon: '📚', name: 'Education' },
              { icon: '🎬', name: 'Entertainment' },
              { icon: '🏢', name: 'More...' },
            ].map((ind, i) => (
              <motion.div
                key={ind.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="card-hover text-center py-8"
              >
                <span className="text-4xl mb-3 block">{ind.icon}</span>
                <p className="font-semibold text-gray-700">{ind.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-bg rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-50" />
            <div className="relative">
              <Heart className="w-12 h-12 mx-auto mb-4 text-white/80" />
              <h2 className="text-4xl font-bold mb-4">Ready to Grow Your Business?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of businesses using BeenBite to boost customer loyalty and revenue.
              </p>
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105">
                Start Your Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">BeenBite</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Support</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
          </div>
          <p className="text-sm text-gray-400">© 2024 BeenBite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
