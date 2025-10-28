'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft, FileText, TrendingUp, AlertCircle, Target, Info, CheckCircle } from 'lucide-react'
import { OpenEndedSummary as SummaryData } from '@/lib/ai/gpt-service'

interface OpenEndedSummaryProps {
  openEndedResponses: string[]
  companyContext: any
  onBack: () => void
}

export default function OpenEndedSummary({
  openEndedResponses,
  companyContext,
  onBack
}: OpenEndedSummaryProps) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateSummary()
  }, [])

  const generateSummary = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/gpt/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'open_ended',
          open_ended_responses: openEndedResponses,
          dimension_context: null
        })
      })

      if (!response.ok) throw new Error('Failed to generate summary')

      const result = await response.json()
      setSummary(result.data)
    } catch (err: any) {
      setError(err.message)
      console.error('Summary generation failed:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-6"
        >
          <Sparkles className="w-12 h-12 text-blue-400" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Analyzing Open-Ended Responses...</h3>
        <p className="text-gray-400 text-center max-w-md">
          Our AI is synthesizing insights from {openEndedResponses.length} employee responses
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-dark rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={generateSummary} className="btn-primary">
            Retry Analysis
          </button>
          <button onClick={onBack} className="btn-secondary">
            Back to Overview
          </button>
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-dark rounded-xl p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Capability Overview
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <FileText className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Overall Capability Assessment Summary</h2>
            <p className="text-gray-400">
              AI-generated synthesis from {openEndedResponses.length} employee responses
            </p>
          </div>
        </div>
      </div>

      {/* Overall Picture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-dark rounded-xl p-8"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-teal-400" />
          Overall Picture
        </h3>
        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
          {summary.overall_picture}
        </p>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-dark rounded-xl p-8"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-400" />
          Achievements
        </h3>
        <div className="text-gray-300 leading-relaxed whitespace-pre-line">
          {summary.achievements}
        </div>
      </motion.div>

      {/* Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-dark rounded-xl p-8"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-400" />
          Challenges
        </h3>
        <div className="text-gray-300 leading-relaxed whitespace-pre-line">
          {summary.challenges}
        </div>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-dark rounded-xl p-8"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-400" />
          Milestones & Future Vision
        </h3>
        <div className="text-gray-300 leading-relaxed whitespace-pre-line">
          {summary.milestones}
        </div>
      </motion.div>

      {/* Footer Note */}
      <div className="glass rounded-lg p-4 border border-blue-500/20">
        <p className="text-xs text-gray-400 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <span>
            This summary was generated by our AI from employee open-ended responses. 
            It synthesizes qualitative themes and perspectives across your organization.
          </span>
        </p>
      </div>
    </div>
  )
}

