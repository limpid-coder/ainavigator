'use client'

import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/hooks/useAuth'
import { cn } from '@/lib/utils'

interface AssessmentPeriod {
  id: string
  survey_wave: string
  assessment_date: string
  name: string
  description?: string
  interventions_applied?: string[]
  sentiment_respondents: number
  capability_respondents: number
  status: 'draft' | 'active' | 'archived'
}

interface AssessmentPeriodSelectorProps {
  selectedWave?: string
  onWaveChange: (wave: string | undefined) => void
  showComparison?: boolean
  onComparisonChange?: (enabled: boolean) => void
}

export function AssessmentPeriodSelector({
  selectedWave,
  onWaveChange,
  showComparison = false,
  onComparisonChange
}: AssessmentPeriodSelectorProps) {
  const { company } = useAuth()
  const [periods, setPeriods] = useState<AssessmentPeriod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPeriods()
  }, [company?.id])

  const loadPeriods = async () => {
    if (!company?.id) return

    try {
      setLoading(true)
      const response = await fetch('/api/data/assessment-periods', {
        headers: {
          'x-company-id': company.id
        }
      })

      if (response.ok) {
        const result = await response.json()
        setPeriods(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load assessment periods:', error)
    } finally {
      setLoading(false)
    }
  }

  const latestPeriod = periods[0] // Periods are ordered by date DESC
  const selectedPeriod = periods.find(p => p.survey_wave === selectedWave)

  if (loading) {
    return (
      <div className="p-3 text-center">
        <RefreshCw className="w-4 h-4 animate-spin mx-auto text-slate-400" />
      </div>
    )
  }

  if (periods.length === 0) {
    return null // No temporal tracking available
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Assessment Period</h3>
        </div>
        {periods.length > 1 && onComparisonChange && (
          <button
            onClick={() => onComparisonChange(!showComparison)}
            className={cn(
              "px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors",
              showComparison
                ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400"
                : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10"
            )}
          >
            <TrendingUp className="w-3 h-3" />
            Compare
          </button>
        )}
      </div>

      {/* Period Selection */}
      <div className="space-y-1.5">
        {/* Latest/All Data option */}
        <motion.button
          onClick={() => onWaveChange(undefined)}
          className={cn(
            "w-full p-2.5 rounded-lg border transition-all text-left",
            !selectedWave
              ? "bg-teal-50 dark:bg-teal-500/10 border-teal-500/30 dark:border-teal-500/20"
              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
          )}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className={cn(
                  "text-sm font-semibold truncate",
                  !selectedWave ? "text-teal-700 dark:text-teal-400" : "text-slate-900 dark:text-white"
                )}>
                  {latestPeriod?.name || 'Latest Data'}
                </p>
                {!selectedWave && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-teal-500 text-white uppercase tracking-wide">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                {latestPeriod?.assessment_date ? new Date(latestPeriod.assessment_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'All available data'}
              </p>
            </div>
            {latestPeriod && (
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
                  {latestPeriod.sentiment_respondents || 0}
                </div>
                <div className="text-[9px] text-slate-600 dark:text-gray-500 uppercase">
                  responses
                </div>
              </div>
            )}
          </div>
        </motion.button>

        {/* Previous periods */}
        {periods.length > 1 && (
          <div className="pt-2 border-t border-slate-200 dark:border-white/10">
            <p className="text-[10px] font-semibold text-slate-600 dark:text-gray-500 uppercase tracking-wide mb-2 px-1">
              Previous Assessments
            </p>
            <div className="space-y-1.5">
              {periods.slice(1).map((period) => (
                <motion.button
                  key={period.id}
                  onClick={() => onWaveChange(period.survey_wave)}
                  className={cn(
                    "w-full p-2.5 rounded-lg border transition-all text-left",
                    selectedWave === period.survey_wave
                      ? "bg-purple-50 dark:bg-purple-500/10 border-purple-500/30 dark:border-purple-500/20"
                      : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate mb-0.5",
                        selectedWave === period.survey_wave ? "text-purple-700 dark:text-purple-400" : "text-slate-900 dark:text-white"
                      )}>
                        {period.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-gray-400">
                        {new Date(period.assessment_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      {period.interventions_applied && period.interventions_applied.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[9px] text-slate-600 dark:text-gray-500">After:</span>
                          <div className="flex gap-0.5">
                            {period.interventions_applied.map((code, idx) => (
                              <span key={idx} className="px-1 py-0.5 rounded text-[8px] font-mono bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-400">
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
                        {period.sentiment_respondents || 0}
                      </div>
                      <div className="text-[9px] text-slate-600 dark:text-gray-500 uppercase">
                        responses
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info about temporal tracking */}
      {periods.length === 1 && (
        <div className="p-2 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-lg">
          <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed">
            <strong>Track progress:</strong> Upload new assessment data to compare results over time and measure intervention impact.
          </p>
        </div>
      )}
    </div>
  )
}
