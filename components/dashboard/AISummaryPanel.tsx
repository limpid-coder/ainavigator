'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, RefreshCw, TrendingUp, AlertCircle } from 'lucide-react'

interface AISummaryPanelProps {
  sentimentData: any[]
  capabilityData: any[]
  activeView: 'sentiment' | 'capability'
  filters: any
}

export default function AISummaryPanel({ 
  sentimentData, 
  capabilityData, 
  activeView,
  filters 
}: AISummaryPanelProps) {
  const [summary, setSummary] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    generateSummary()
  }, [activeView, sentimentData, capabilityData, filters])

  const generateSummary = () => {
    setIsLoading(true)
    
    // Simulate AI processing delay
    setTimeout(() => {
      let summaryText = ''
      
      if (activeView === 'sentiment' && sentimentData.length > 0) {
        const filterText = Object.keys(filters).length > 0 
          ? ` within the ${Object.values(filters).filter(Boolean).join(', ')} segment`
          : ''
          
        summaryText = `Analysis of ${sentimentData.length} responses${filterText} reveals a mixed readiness landscape. Key findings include significant concerns around job security and understanding gaps, particularly among operational teams. Technical barriers and cultural resistance appear moderate, suggesting targeted interventions could accelerate adoption. Leadership visibility and clear communication emerge as critical enablers, with early adopters showing strong enthusiasm that could be leveraged for peer influence.`
      } else if (activeView === 'capability' && capabilityData.length > 0) {
        const filterText = Object.keys(filters).length > 0 
          ? ` for the ${Object.values(filters).filter(Boolean).join(', ')} segment`
          : ''
          
        summaryText = `Capability assessment${filterText} indicates foundational strengths in strategic vision and innovation culture, but reveals critical gaps in data infrastructure and technical readiness. Skills development emerges as a high-priority area, with notable deficiencies in AI-specific competencies across most departments. Organizational processes show promise but lack the structure needed for scaled AI implementation. Ethics and governance frameworks require immediate attention to support responsible deployment.`
      } else {
        summaryText = 'Upload data or select a view to generate AI-powered insights about your organization\'s AI readiness.'
      }
      
      setSummary(summaryText)
      setIsLoading(false)
    }, 800)
  }

  if (!summary && !isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark rounded-xl p-5 mb-4 relative overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Insights</h3>
              <p className="text-xs text-gray-400">Generated from current data and filters</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateSummary}
            disabled={isLoading}
            className="p-2 rounded-lg glass hover:glass-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Regenerate insights"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-4/6 rounded" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-gray-300 leading-relaxed">
              {summary}
            </p>
            
            {/* Key indicators */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <span className="text-gray-400">High Confidence</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-gray-400">
                  {activeView === 'sentiment' ? '3 Priority Areas' : '2 Critical Gaps'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

