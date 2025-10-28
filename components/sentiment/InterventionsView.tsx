'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Sparkles, 
  Target,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react'
import { ProblemCategory, Intervention } from '@/lib/ai/gpt-service'

interface InterventionsViewProps {
  problemCategory: ProblemCategory
  companyContext: any
  onBack: () => void
}

export default function InterventionsView({
  problemCategory,
  companyContext,
  onBack
}: InterventionsViewProps) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [expandedAction, setExpandedAction] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateInterventions()
  }, [])

  const generateInterventions = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/gpt/interventions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_category: problemCategory,
          company_context: companyContext
        })
      })

      if (!response.ok) throw new Error('Failed to generate interventions')

      const result = await response.json()
      setInterventions(result.data.interventions)
    } catch (err: any) {
      setError(err.message)
      console.error('Intervention generation failed:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-gray-400'
      default: return 'text-gray-400'
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
          <Sparkles className="w-12 h-12 text-purple-400" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Generating Interventions...</h3>
        <p className="text-gray-400 text-center max-w-md">
          Our AI is creating 3 specific, actionable recommendations for "{problemCategory.category_name}"
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-dark rounded-xl p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Failed to Generate Interventions</h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={generateInterventions} className="btn-primary">
            Retry
          </button>
          <button onClick={onBack} className="btn-secondary">
            Back to Categories
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-dark rounded-xl p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Problem Categories
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`
              inline-flex px-3 py-1 rounded-lg text-xs font-bold uppercase mb-3
              ${problemCategory.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                problemCategory.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                'bg-yellow-500/20 text-yellow-300'}
            `}>
              {problemCategory.severity} Priority
            </div>
            
            <h2 className="text-3xl font-bold mb-3">{problemCategory.category_name}</h2>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <span>{problemCategory.reason}</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <span>{problemCategory.level}</span>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4">
              {problemCategory.description}
            </p>

            {problemCategory.business_impact && (
              <div className="glass rounded-lg p-4 mb-4">
                <div className="text-sm font-semibold text-teal-400 mb-2">Business Impact</div>
                <p className="text-sm text-gray-300">{problemCategory.business_impact}</p>
              </div>
            )}
          </div>

          <div className="ml-6 flex-shrink-0">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-gray-400 text-xs mb-1">Affected</div>
              <div className="text-3xl font-bold text-orange-400 flex items-center gap-2">
                <Users className="w-6 h-6" />
                {problemCategory.affected_count}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interventions */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-purple-400" />
          Recommended Actions
        </h3>

        {interventions.map((intervention) => (
          <motion.div
            key={intervention.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: intervention.number * 0.1 }}
            className="glass-dark rounded-xl border border-white/10 overflow-hidden"
          >
            {/* Action Header */}
            <button
              onClick={() => setExpandedAction(
                expandedAction === intervention.number ? null : intervention.number
              )}
              className="w-full p-6 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center font-bold text-purple-300">
                      {intervention.number}
                    </div>
                    <h4 className="text-lg font-bold">{intervention.title}</h4>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Target className={`w-4 h-4 ${getEffortColor(intervention.effort)}`} />
                      <span className={getEffortColor(intervention.effort)}>
                        {intervention.effort} effort
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className={`w-4 h-4 ${getImpactColor(intervention.impact)}`} />
                      <span className={getImpactColor(intervention.impact)}>
                        {intervention.impact} impact
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{intervention.timeframe}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-teal-400">
                      <DollarSign className="w-4 h-4" />
                      <span>{intervention.budget_estimate}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2">
                    {intervention.what_to_do}
                  </p>
                </div>

                <div className="ml-4 flex-shrink-0">
                  {expandedAction === intervention.number ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedAction === intervention.number && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10"
                >
                  <div className="p-6 space-y-4">
                    {/* What to Do */}
                    <div>
                      <h5 className="text-sm font-semibold text-teal-400 mb-2">What to Do</h5>
                      <p className="text-sm text-gray-300">{intervention.what_to_do}</p>
                    </div>

                    {/* Why It Works */}
                    <div className="glass rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-purple-400 mb-2">Why It Works</h5>
                      <p className="text-sm text-gray-300">{intervention.why_it_works}</p>
                    </div>

                    {/* Resources & Stakeholders */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-semibold text-gray-400 mb-2">Required Resources</h5>
                        <ul className="space-y-1">
                          {intervention.required_resources.map((resource, idx) => (
                            <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-teal-400" />
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-xs font-semibold text-gray-400 mb-2">Key Stakeholders</h5>
                        <ul className="space-y-1">
                          {intervention.key_stakeholders.map((stakeholder, idx) => (
                            <li key={idx} className="text-xs text-gray-300 flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-purple-400" />
                              {stakeholder}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Success Metrics */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-400 mb-2">Success Metrics</h5>
                      <div className="flex flex-wrap gap-2">
                        {intervention.success_metrics.map((metric, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Wins */}
                    {intervention.quick_wins && intervention.quick_wins.length > 0 && (
                      <div className="glass rounded-lg p-4 bg-teal-500/5">
                        <h5 className="text-sm font-semibold text-teal-400 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Quick Wins (First 2-4 Weeks)
                        </h5>
                        <ul className="space-y-1">
                          {intervention.quick_wins.map((win, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-teal-400 mt-0.5">→</span>
                              {win}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {interventions.length === 0 && !isGenerating && (
        <div className="glass-dark rounded-xl p-12 text-center">
          <p className="text-gray-400">No interventions generated. Please try again.</p>
        </div>
      )}
    </div>
  )
}

