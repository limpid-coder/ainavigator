'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain,
  ChevronRight,
  FileUp,
  Database,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle,
  BarChart3,
  Target,
  Lightbulb,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

// Smooth animated background
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-purple-950/20" />
    <div className="absolute inset-0 data-grid opacity-[0.02]" />
    
    {/* Subtle gradient animation */}
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
          'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
        ]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />
  </div>
)

// Feature card component
const FeatureCard = ({ feature, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -4 }}
    className="card-interactive group"
  >
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.gradient} glow-sm group-hover:glow-md transition-all`}>
        {feature.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-blue-400">
          <CheckCircle className="w-3 h-3" />
          <span>{feature.metric}</span>
        </div>
      </div>
    </div>
  </motion.div>
)

// Stats counter animation
const AnimatedStat = ({ value, suffix, label, delay }: any) => {
  const [count, setCount] = useState(0)
  const numValue = parseInt(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0
      const duration = 2000
      const increment = numValue / (duration / 16)
      
      const counter = setInterval(() => {
        start += increment
        if (start >= numValue) {
          setCount(numValue)
          clearInterval(counter)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(counter)
    }, delay)

    return () => clearTimeout(timer)
  }, [numValue, delay])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-3xl font-bold text-white">
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </motion.div>
  )
}

export default function Home() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: 'Culture Heatmap',
      description: 'Visualize organizational sentiment across 25 key dimensions with interactive insights',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      metric: '25-zone matrix'
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: 'Capability Diamond',
      description: 'Assess AI readiness across 8 capability dimensions with drill-down analytics',
      gradient: 'from-purple-500/20 to-pink-500/20',
      metric: '32 constructs'
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      title: 'Smart Interventions',
      description: 'Get AI-powered recommendations tailored to your organization\'s specific gaps',
      gradient: 'from-amber-500/20 to-orange-500/20',
      metric: 'Real-time insights'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: 'ROI Predictions',
      description: 'Understand the potential impact of interventions with directional value estimates',
      gradient: 'from-green-500/20 to-emerald-500/20',
      metric: 'Data-driven'
    }
  ]

  const stats = [
    { value: '67', suffix: '%', label: 'AI initiatives fail' },
    { value: '500', suffix: '+', label: 'Organizations analyzed' },
    { value: '3', suffix: 'min', label: 'Time to insights' },
    { value: '94', suffix: '%', label: 'Accuracy rate' }
  ]

  return (
    <div className="min-h-screen bg-black relative">
      <AnimatedBackground />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-7 h-7 text-blue-400" />
              <span className="font-semibold text-lg">AI Navigator</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</a>
              <a href="#demo" className="text-sm text-gray-400 hover:text-white transition-colors">Demo</a>
              <Link href="/upload" className="btn-primary text-sm">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>AI-Powered Analytics Platform</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="text-gradient">Transform Your</span>
              <br />
              <span className="text-white">AI Readiness</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-gray-400 mb-10 leading-relaxed"
            >
              Assess, understand, and accelerate your organization's AI adoption
              <br className="hidden md:block" />
              with data-driven insights and actionable recommendations
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/demo" className="group">
                <button className="btn-primary flex items-center gap-2 w-full sm:w-auto">
                  <Play className="w-4 h-4" />
                  Watch Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/upload">
                <button className="btn-secondary flex items-center gap-2 w-full sm:w-auto">
                  <FileUp className="w-4 h-4" />
                  Start Assessment
                </button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500"
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Enterprise Ready
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                SOC 2 Compliant
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                GDPR Ready
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedStat
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4"
            >
              <span className="text-gradient">Powerful Features</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg"
            >
              Everything you need to understand and improve AI readiness
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4"
            >
              <span className="text-gradient">Simple Process</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg"
            >
              Get insights in minutes, not months
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Upload Data', desc: 'Import your assessment data via CSV', icon: <Database className="w-6 h-6" /> },
              { step: '02', title: 'Analyze Insights', desc: 'Explore interactive visualizations', icon: <BarChart3 className="w-6 h-6" /> },
              { step: '03', title: 'Take Action', desc: 'Get targeted recommendations', icon: <Sparkles className="w-6 h-6" /> }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary text-white glow-sm">
                  {item.icon}
                </div>
                <div className="text-sm text-blue-400 font-mono mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4"
            >
              <span className="text-gradient">See it in Action</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-lg"
            >
              Watch a 2-minute overview of AI Navigator
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-video rounded-xl overflow-hidden glass-premium group cursor-pointer"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
          >
            {!isVideoPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-950/50 to-purple-950/50">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </motion.div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <p className="text-gray-400">Demo video would play here</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-premium rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your AI Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join leading organizations using data-driven insights for AI success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload">
                <button className="btn-primary flex items-center gap-2">
                  Get Started Now
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/demo">
                <button className="btn-secondary">
                  Explore Demo Data
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-400" />
              <span className="font-semibold">AI Navigator</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2025 AI Navigator. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}