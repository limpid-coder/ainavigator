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
  Loader2
} from 'lucide-react'
import Link from 'next/link'
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
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }

  const iconMap = {
    'tech-company': <Building2 className="w-8 h-8" />,
    'financial-services': <TrendingUp className="w-8 h-8" />,
    'manufacturing': <Globe className="w-8 h-8" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-400" />
              <span className="font-semibold text-white">AI Navigator</span>
            </Link>
            <Link href="/">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Home className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="text-gradient bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Demo Datasets
            </span>
          </h1>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Explore AI Navigator with pre-configured datasets representing different industries and organizational contexts
          </p>

          {/* Dataset Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {DEMO_DATASETS.map((dataset) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className={`glass rounded-xl p-6 cursor-pointer transition-all ${
                  selectedDataset === dataset.id 
                    ? 'ring-2 ring-blue-500 bg-blue-500/10' 
                    : 'hover:bg-white/5'
                }`}
                onClick={() => setSelectedDataset(dataset.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${
                    dataset.id === 'tech-company' 
                      ? 'from-blue-500/20 to-cyan-500/20 text-cyan-400'
                      : dataset.id === 'financial-services'
                      ? 'from-green-500/20 to-emerald-500/20 text-emerald-400'
                      : 'from-orange-500/20 to-red-500/20 text-orange-400'
                  }`}>
                    {iconMap[dataset.id as keyof typeof iconMap]}
                  </div>
                  {selectedDataset === dataset.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="p-1 rounded-full bg-blue-500"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-2">{dataset.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{dataset.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">
                      {dataset.sentimentResponses} sentiment responses
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-300">
                      {dataset.capabilityResponses} capability responses
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2">Key insights:</p>
                  <ul className="space-y-1">
                    {dataset.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx} className="text-xs text-gray-400 flex items-start gap-1">
                        <span className="text-blue-400 mt-0.5">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Section */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectedDataset && handleLoadDemo(selectedDataset)}
              disabled={!selectedDataset || isLoading}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                selectedDataset && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40'
                  : 'bg-white/5 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading Demo...
                </>
              ) : (
                <>
                  Load Selected Dataset
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
            
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px bg-white/10 w-24" />
              <span className="text-gray-500 text-sm">or</span>
              <div className="h-px bg-white/10 w-24" />
            </div>
            
            <Link href="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-6 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg font-medium text-white hover:bg-white/10 transition-all duration-300"
              >
                Upload Your Own Data
              </motion.button>
            </Link>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 glass rounded-xl p-6 max-w-2xl mx-auto"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              About Demo Datasets
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              These demo datasets are synthetically generated to represent realistic organizational 
              scenarios. Each dataset includes varied sentiment levels across different departments 
              and regions, along with capability assessments that reflect common organizational 
              patterns and challenges in AI adoption.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              The data demonstrates how AI Navigator can identify readiness gaps, surface key 
              concerns, and recommend targeted interventions based on your organization&apos;s 
              unique profile.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
