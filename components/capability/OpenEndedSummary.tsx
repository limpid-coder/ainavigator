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
    // Only generate if we have responses
    if (openEndedResponses && openEndedResponses.length > 0) {
      generateSummary()
    } else {
      setIsGenerating(false)
      setError('No open-ended responses available to analyze')
    }
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to generate summary')
      }

      const result = await response.json()
      setSummary(result.data)
    } catch (err: any) {
      // Better error messaging
      const errorMessage = err.message || 'Failed to generate summary'
      setError(errorMessage)
      console.error('Summary generation failed:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 animate-ping opacity-20" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Analyzing Open-Ended Responses...</h3>
        <p className="text-gray-400 text-center max-w-md text-sm">
          Our AI is synthesizing insights from {openEndedResponses?.length || 0} employee responses
        </p>
        <div className="mt-6 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-teal-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-gradient-to-br from-orange-500/10 to-transparent rounded-xl border border-orange-500/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Analysis Unavailable</h3>
          <p className="text-sm text-gray-400 mb-6">
            {error === 'No open-ended responses available to analyze' 
              ? 'This feature requires open-ended survey responses. The current dataset does not include qualitative feedback.'
              : 'The AI analysis service is currently unavailable. This feature will be enabled when the backend API is configured.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {error !== 'No open-ended responses available to analyze' && (
              <button 
                onClick={generateSummary} 
                className="px-4 py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-300 text-sm font-semibold transition-all"
              >
                Retry Analysis
              </button>
            )}
            <button 
              onClick={onBack} 
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-semibold transition-all"
            >
              Back to Capability View
            </button>
          </div>
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

