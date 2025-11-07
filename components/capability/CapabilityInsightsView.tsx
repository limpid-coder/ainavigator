'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Zap, Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CapabilityInsight {
  dimension: string
  priority: 'critical' | 'high' | 'medium'
  gap_analysis: string
  business_impact: string
  recommended_interventions: string[]  // Intervention codes (A1, B2, etc.)
  intervention_rationale: string       // Why these interventions address the gap
  quick_wins: string[]
  long_term_strategy: string
  estimated_effort: 'low' | 'medium' | 'high'
  estimated_timeline: string
}

interface CapabilityInsightsViewProps {
  weakDimensions: any[]
  companyContext: any
  filters: any
  onBack: () => void
}

export default function CapabilityInsightsView({
  weakDimensions,
  companyContext,
  filters,
  onBack
}: CapabilityInsightsViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [insights, setInsights] = useState<CapabilityInsight[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    analyzeWithGPT()
  }, [])

  const useMockData = () => {
    setTimeout(() => {
      const mockInsights: CapabilityInsight[] = [
        {
          dimension: 'Strategy & Vision',
          priority: 'critical',
          gap_analysis: 'Limited strategic alignment between AI initiatives and business objectives. Lack of clear AI roadmap and executive sponsorship.',
          business_impact: 'Fragmented AI efforts, missed opportunities for strategic value creation, difficulty securing budget and resources for AI projects.',
          recommended_interventions: ['A1', 'A2', 'A3'],
          intervention_rationale: 'Strategy & Governance interventions (A1 Roadmap Workshop, A2 Dialectics, A3 Playbook) directly address the strategic alignment gap by building shared vision, clarifying direction, and establishing governance frameworks with executive buy-in.',
          quick_wins: [
            'Conduct AI opportunity assessment workshop',
            'Define top 3 strategic AI priorities'
          ],
          long_term_strategy: 'Build AI center of excellence with dedicated leadership, establish governance framework, and integrate AI into strategic planning cycles.',
          estimated_effort: 'high',
          estimated_timeline: '6-12 months for foundation'
        },
        {
          dimension: 'Data',
          priority: 'high',
          gap_analysis: 'Data quality and accessibility issues limiting AI model effectiveness. Siloed data across systems without centralized governance.',
          business_impact: 'Poor AI model performance, increased development time, compliance risks, inability to leverage data for insights.',
          recommended_interventions: ['A3', 'C1', 'C2'],
          intervention_rationale: 'Data challenges require both governance (A3 Playbook for data policies) and experimentation (C1 Kickstart to prototype with existing data, C2 ROI Retrospective to evaluate what data delivers value).',
          quick_wins: [
            'Audit critical data sources for AI use cases',
            'Document data lineage for priority datasets'
          ],
          long_term_strategy: 'Build modern data platform with unified access, implement automated quality checks, and establish data mesh architecture for scalability.',
          estimated_effort: 'high',
          estimated_timeline: '9-18 months'
        },
        {
          dimension: 'Talent & Skills',
          priority: 'high',
          gap_analysis: 'Insufficient AI expertise across organization. Skills gap in both technical AI capabilities and business understanding of AI potential.',
          business_impact: 'Dependence on external consultants, slow AI adoption, missed innovation opportunities, competitive disadvantage.',
          recommended_interventions: ['B2', 'B4', 'B5'],
          intervention_rationale: 'Adoption & Behaviour interventions (B2 Learning Week for intensive skill-building, B4 Ambassadors for peer support, B5 Nudging for reinforcement) systematically build AI literacy and create a learning culture.',
          quick_wins: [
            'Identify AI champions in each department',
            'Provide basic AI literacy training to leadership'
          ],
          long_term_strategy: 'Build internal AI academy, create career paths for AI roles, and establish mentorship programs to retain and develop AI talent.',
          estimated_effort: 'medium',
          estimated_timeline: '3-9 months for initial program'
        }
      ]

      setInsights(mockInsights)
      setIsAnalyzing(false)
    }, 1500)
  }

  const analyzeWithGPT = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/gpt/capability-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weak_dimensions: weakDimensions,
          company_context: companyContext,
          filters
        })
      })

      if (!response.ok) {
        const result = await response.json()
        if (result.suggestion?.includes('OpenAI API key')) {
          console.warn('OpenAI API key not configured, using mock data')
          useMockData()
          return
        }
        throw new Error(result.error || 'Failed to analyze')
      }

      const result = await response.json()
      setInsights(result.data.insights)
      setIsAnalyzing(false)
    } catch (err: any) {
      console.error('GPT Capability Insights failed, falling back to mock data:', err)
      useMockData()
    }
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', icon: AlertTriangle }
      case 'high':
        return { color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', icon: TrendingUp }
      default:
        return { color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30', icon: Lightbulb }
    }
  }

  const getEffortConfig = (effort: string) => {
    switch (effort) {
      case 'low':
        return { label: 'Low Effort', color: 'text-green-400', bgColor: 'bg-green-500/10' }
      case 'medium':
        return { label: 'Medium Effort', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' }
      default:
        return { label: 'High Effort', color: 'text-red-400', bgColor: 'bg-red-500/10' }
    }
  }

  const getInterventionLevelColor = (code: string) => {
    const level = code.charAt(0)
    switch (level) {
      case 'A':
        return 'from-purple-600 to-purple-700'
      case 'B':
        return 'from-blue-600 to-blue-700'
      case 'C':
        return 'from-teal-600 to-teal-700'
      default:
        return 'from-gray-600 to-gray-700'
    }
  }

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent rounded-lg border border-teal-500/20 p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-4"
        >
          <Brain className="w-16 h-16 text-teal-700 dark:text-teal-400" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span>Analyzing Capability Gaps</span>
        </h3>
        <p className="text-sm text-gray-400 text-center max-w-md">
          AI is analyzing {weakDimensions.length} dimensions with below-benchmark performance to generate actionable insights...
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Overview
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Capability Insights</h2>
            <p className="text-sm text-gray-400">
              {insights.length} strategic recommendations for {weakDimensions.length} weak dimensions
            </p>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin space-y-4">
        <AnimatePresence mode="popLayout">
          {insights.map((insight, index) => {
            const priorityConfig = getPriorityConfig(insight.priority)
            const effortConfig = getEffortConfig(insight.estimated_effort)
            const PriorityIcon = priorityConfig.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-xl border border-white/10 p-6 hover:border-teal-500/30 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", priorityConfig.bgColor)}>
                      <PriorityIcon className={cn("w-5 h-5", priorityConfig.color)} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{insight.dimension}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn("px-2 py-0.5 rounded text-xs font-semibold uppercase", priorityConfig.color, priorityConfig.bgColor, priorityConfig.borderColor, "border")}>
                          {insight.priority} Priority
                        </span>
                        <span className={cn("px-2 py-0.5 rounded text-xs", effortConfig.color, effortConfig.bgColor)}>
                          {effortConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{insight.estimated_timeline}</span>
                  </div>
                </div>

                {/* Gap Analysis */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    Gap Analysis
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{insight.gap_analysis}</p>
                </div>

                {/* Business Impact */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    Business Impact
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{insight.business_impact}</p>
                </div>

                {/* Recommended Strategic Interventions */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-teal-400" />
                    Recommended Strategic Interventions
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {insight.recommended_interventions.map((code, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg bg-gradient-to-r text-white font-bold text-sm shadow-md hover:shadow-lg transition-all",
                          getInterventionLevelColor(code)
                        )}
                        onClick={() => {
                          // TODO: Open intervention detail modal
                          console.log('View intervention:', code)
                        }}
                      >
                        {code}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed italic">
                    {insight.intervention_rationale}
                  </p>
                </div>

                {/* Quick Wins */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Quick Wins
                  </h4>
                  <ul className="space-y-1.5">
                    {insight.quick_wins.map((win, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="text-yellow-400">•</span>
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Long-term Strategy */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-teal-500/10 border border-purple-500/20">
                  <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Long-term Strategy
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{insight.long_term_strategy}</p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
