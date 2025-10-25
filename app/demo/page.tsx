'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Users, 
  Globe, 
  TrendingUp, 
  Brain,
  Home,
  ArrowRight,
  Check,
  Loader2,
  Activity,
  Shield,
  Database,
} from 'lucide-react'
import Link from 'next/link'
import GradualBlur from '@/components/ui/gradual-blur'
import Header from '@/components/shared/Header'
import { 
  generateDemoSentimentData, 
  generateDemoCapabilityData,
  DEMO_DATASETS 
} from '@/lib/data/demo-data'

export default function DemoPage() {
  const router = useRouter()
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadDemo = async (datasetId: string) => {
    setIsLoading(true)
    setSelectedDataset(datasetId)
    
    // Generate demo data
    const sentimentData = generateDemoSentimentData()
    const capabilityData = generateDemoCapabilityData()
    
    // Store in session storage
    const sessionData = {
      id: `demo-${datasetId}-${Date.now()}`,
      isDemo: true,
      datasetId,
      sentimentData,
      capabilityData,
      uploadedAt: new Date().toISOString()
    }
    
    sessionStorage.setItem('aiNavigatorSession', JSON.stringify(sessionData))
    
    // Smooth transition to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  }

  const iconMap = {
    'tech-company': <Activity className="w-5 h-5" />,
    'financial-services': <TrendingUp className="w-5 h-5" />,
    'manufacturing': <Globe className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-950/5 via-transparent to-transparent" />
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title Section */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            >
              <span className="text-white">Select Demo</span>
              <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Industry Dataset
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Explore AI Navigator with pre-built datasets representing real organizational patterns
            </motion.p>
          </div>

          {/* Dataset Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {DEMO_DATASETS.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => setSelectedDataset(dataset.id)}
                className={`
                  relative p-8 rounded-2xl cursor-pointer transition-all group
                  ${selectedDataset === dataset.id 
                    ? 'bg-gradient-to-b from-blue-500/10 to-transparent border-blue-500/30' 
                    : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5 hover:border-white/10'}
                  border backdrop-blur-sm
                `}
              >
                {/* Icon */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`
                    p-3 rounded-xl transition-colors
                    ${selectedDataset === dataset.id 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'}
                  `}>
                    {iconMap[dataset.id as keyof typeof iconMap]}
                  </div>
                  {selectedDataset === dataset.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">{dataset.name}</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  {dataset.description}
                </p>

                {/* Stats */}
                <div className="space-y-2 pb-6 border-b border-white/5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Responses</span>
                    <span className="font-medium text-gray-300">
                      {dataset.sentimentResponses + dataset.capabilityResponses}
                    </span>
                  </div>
                </div>

                {/* Key Insights */}
                <div className="mt-6 space-y-2">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Key Focus Areas</p>
                  {dataset.highlights.slice(0, 2).map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-500 mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-gray-400 leading-relaxed">{highlight}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={() => selectedDataset && handleLoadDemo(selectedDataset)}
              disabled={!selectedDataset || isLoading}
              className={`
                px-8 py-4 rounded-xl font-medium transition-all
                ${!selectedDataset 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                  : isLoading
                  ? 'bg-blue-600/50 text-white/75'
                  : 'bg-blue-600 hover:bg-blue-500 text-white transform hover:scale-105'}
              `}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading Dataset
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue with Dataset
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
            
            <div className="mt-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-white/5 w-24" />
                <span className="text-sm text-gray-500">or</span>
                <div className="h-px bg-white/5 w-24" />
              </div>
              
              <Link href="/upload">
                <button className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl font-medium hover:bg-white/10 transition-all">
                  Upload Your Own Data
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="relative p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white">Synthetic Data</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    AI-generated patterns that mirror real organizational behavior
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold text-white">Privacy Safe</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    No real organizational or personal information included
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <h4 className="font-semibold text-white">Full Features</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Experience all analytics capabilities with realistic data
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient blur */}
      <GradualBlur 
        position="bottom" 
        height="8rem" 
        strength={2} 
        divCount={6}
        curve="ease-out"
        opacity={0.8}
      />
    </div>
  )
}