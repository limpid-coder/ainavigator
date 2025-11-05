'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts'
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, Info, Lightbulb, Sparkles } from 'lucide-react'
import { getDimensionById, getConstructsForDimension } from '@/lib/constants/capability-metadata'
import { DimensionScore } from '@/lib/calculations/capability-analysis'
import { useTheme } from '@/lib/contexts/theme-context'
import { InterventionDetail } from '@/components/interventions/InterventionDetail'

interface DimensionDrilldownProps {
  dimensionId: number
  data: any[]
  benchmark: number
  filters: any
  onBack: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export default function DimensionDrilldown({
  dimensionId,
  data,
  benchmark,
  filters,
  onBack,
  onNext,
  onPrevious
}: DimensionDrilldownProps) {

  const { theme } = useTheme()
  const dimensionMeta = getDimensionById(dimensionId)
  const constructsMeta = getConstructsForDimension(dimensionId)

  // Intervention state
  const [interventions, setInterventions] = useState<any[]>([])
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)
  const [interventionsLoading, setInterventionsLoading] = useState(false)

  // Fetch interventions for this dimension
  useEffect(() => {
    const fetchInterventions = async () => {
      setInterventionsLoading(true)
      try {
        const response = await fetch(`/api/interventions/capability?dimension=${dimensionId}`)
        const data = await response.json()
        setInterventions(data.interventions || [])
      } catch (error) {
        console.error('Failed to fetch interventions:', error)
        setInterventions([])
      } finally {
        setInterventionsLoading(false)
      }
    }
    fetchInterventions()
  }, [dimensionId])

  // Calculate dimension scores from data
  const dimension = useMemo(() => {
    // Calculate scores for each construct in this dimension
    const constructScores = constructsMeta.map(construct => {
      const scores = data.map(d => d[`construct_${construct.id}`]).filter((s): s is number => typeof s === 'number' && !isNaN(s))
      const avg = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0
      const max = scores.length > 0 ? Math.max(...scores) : 0
      const min = scores.length > 0 ? Math.min(...scores) : 0
      return { name: construct.name, score: avg, max, min }
    })
    
    const avgScore = constructScores.reduce((sum, c) => sum + c.score, 0) / constructScores.length
    const status = avgScore >= benchmark ? 'above' : avgScore < benchmark - 1 ? 'significantly_below' : 'below'
    
    return {
      dimensionId,
      name: dimensionMeta?.name || '',
      average: avgScore,
      benchmark,
      status,
      constructs: constructScores
    }
  }, [data, dimensionId, benchmark, constructsMeta, dimensionMeta])

  const radarData = useMemo(() =>
    dimension.constructs.map((construct) => ({
      construct: construct.name,
      score: construct.score,
      benchmark: benchmark / 2 // Rough estimate for constructs
    })),
    [dimension, benchmark]
  )

  const getStatusDisplay = () => {
    const diff = dimension.average - dimension.benchmark
    if (dimension.status === 'significantly_below') {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
        text: 'Significantly below benchmark',
        color: 'text-red-400'
      }
    } else if (dimension.status === 'below') {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
        text: 'Below benchmark',
        color: 'text-orange-400'
      }
    } else if (dimension.status === 'above') {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        text: 'Above benchmark',
        color: 'text-green-400'
      }
    }
    return {
      icon: <CheckCircle className="w-5 h-5 text-slate-600 dark:text-gray-400" />,
      text: 'At benchmark',
      color: 'text-slate-600 dark:text-gray-400'
    }
  }

  const status = getStatusDisplay()
  const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ')

  return (
    <>
    <div className="h-full grid grid-cols-12 grid-rows-12 gap-2 overflow-hidden">
      
      {/* TOP ROW: NAVIGATION & HEADER - Row 1-2 */}
      <div className="col-span-12 row-span-2 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="text-[10px] font-medium">Back</span>
          </button>
          
          <div className="h-5 w-px bg-white/10" />
          
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{dimension.name}</h2>
            {dimensionMeta?.description && (
              <p className="text-[9px] text-slate-600 dark:text-gray-400 line-clamp-1">{dimensionMeta.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 px-2 py-1 rounded bg-white/5">
            {status.icon && <div className="w-3 h-3">{status.icon}</div>}
            <span className={cn("text-[9px] font-semibold uppercase tracking-wide", status.color)}>
              {status.text.replace('benchmark', 'bench')}
            </span>
          </div>
          {onPrevious && (
            <button onClick={onPrevious} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px]">
              Prev
            </button>
          )}
          {onNext && (
            <button onClick={onNext} className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] flex items-center gap-1">
              Next <ArrowRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* KEY METRICS - Row 3 */}
      <div className="col-span-3 row-span-1 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg border border-blue-500/20 p-2 flex items-center justify-between">
        <div>
          <div className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">Your Score</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-blue-700 dark:text-blue-400 tabular-nums">{dimension.average.toFixed(1)}</span>
            <span className="text-[9px] text-gray-500">/10</span>
          </div>
        </div>
      </div>

      <div className="col-span-3 row-span-1 bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg border border-purple-500/20 p-2 flex items-center justify-between">
        <div>
          <div className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">Benchmark</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-purple-700 dark:text-purple-400 tabular-nums">{dimension.benchmark.toFixed(1)}</span>
            <span className="text-[9px] text-gray-500">/10</span>
          </div>
        </div>
      </div>

      <div className="col-span-3 row-span-1 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-2 flex items-center justify-between">
        <div>
          <div className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">Gap</div>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-xl font-bold tabular-nums",
              dimension.average >= dimension.benchmark ? "text-green-400" : "text-orange-400"
            )}>
              {dimension.average >= dimension.benchmark ? '+' : ''}{(dimension.average - dimension.benchmark).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="col-span-3 row-span-1 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-2 flex items-center justify-between">
        <div>
          <div className="text-[8px] text-gray-500 uppercase tracking-wide mb-0.5">Constructs</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{dimension.constructs.length}</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: RADAR & TABLE - Row 4-12 */}
      
      {/* Construct Radar Chart - Left */}
      <div className="col-span-5 row-span-9 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-2 flex flex-col">
        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
          <span className="text-[9px] font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider">4-Construct Analysis</span>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid
                stroke={theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}
                strokeWidth={0.5}
              />
              <PolarAngleAxis
                dataKey="construct"
                tick={{ fill: theme === 'light' ? '#374151' : '#9CA3AF', fontSize: 9 }}
              />
              <PolarRadiusAxis
                domain={[0, 10]}
                tick={{ fill: theme === 'light' ? '#6B7280' : '#6B7280', fontSize: 8 }}
                tickCount={6}
              />
              
              <Radar
                name="Score"
                dataKey="score"
                stroke="#0D7C7F"
                fill="#0D7C7F"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="#a855f7"
                fill="none"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-3 mt-1.5 pt-1.5 border-t border-white/5">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#0D7C7F]" />
            <span className="text-[8px] text-slate-600 dark:text-gray-400">Your Score</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-0.5 bg-[#a855f7]" style={{ width: '10px' }} />
            <span className="text-[8px] text-slate-600 dark:text-gray-400">Benchmark</span>
          </div>
        </div>
      </div>

      {/* Construct Details Table - Right */}
      <div className="col-span-7 row-span-9 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-2 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
          <span className="text-[9px] font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider">Construct Breakdown</span>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-[9px]">
            <thead className="sticky top-0 bg-[#0a0a0a]">
              <tr className="border-b border-white/5">
                <th className="text-left py-1 text-gray-500 font-medium uppercase tracking-wide">Construct</th>
                <th className="text-right py-1 text-gray-500 font-medium uppercase tracking-wide">Score</th>
                <th className="text-right py-1 text-gray-500 font-medium uppercase tracking-wide">Max</th>
                <th className="text-right py-1 text-gray-500 font-medium uppercase tracking-wide">Min</th>
                <th className="text-right py-1 text-gray-500 font-medium uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {dimension.constructs.map((construct: any, idx: number) => {
                const isWeak = construct.score < dimension.average - 0.5
                return (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-1.5 text-slate-900 dark:text-white font-medium">{construct.name}</td>
                    <td className="text-right tabular-nums">
                      <span className={cn(
                        "font-semibold",
                        construct.score >= dimension.average ? "text-green-400" : "text-orange-400"
                      )}>
                        {construct.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-right text-green-400 tabular-nums">{construct.max.toFixed(1)}</td>
                    <td className="text-right text-orange-400 tabular-nums">{construct.min.toFixed(1)}</td>
                    <td className="text-right">
                      <span className={cn(
                        "px-1 py-0.5 rounded text-[8px] font-medium",
                        isWeak ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                        construct.score >= dimension.average + 0.3 ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                      )}>
                        {isWeak ? 'WEAK' : construct.score >= dimension.average + 0.3 ? 'STRONG' : 'OK'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Key Insight */}
        {dimension.constructs.some((c: any) => c.score < dimension.average - 0.5) && (
          <div className="mt-1.5 pt-1.5 border-t border-white/5 bg-orange-500/5 rounded p-1.5">
            <div className="flex items-start gap-1">
              <AlertTriangle className="w-2.5 h-2.5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-[9px] font-semibold text-orange-400 uppercase tracking-wide mb-0.5">Focus Areas</div>
                <p className="text-[9px] text-slate-700 dark:text-gray-300 leading-relaxed">
                  {dimension.constructs
                    .filter((c: any) => c.score < dimension.average - 0.5)
                    .map((c: any) => c.name)
                    .join(', ')} need improvement
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Intervention Recommendations - Full Width Below Main Grid */}
      <div className="col-span-12 row-span-1 mt-2">
        <div className="bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg border border-purple-500/20 p-2">
          <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[9px] font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                Recommended Interventions
              </span>
            </div>
            {interventionsLoading && (
              <span className="text-[8px] text-gray-500">Loading...</span>
            )}
          </div>

          {!interventionsLoading && interventions.length === 0 && (
            <div className="text-[9px] text-gray-500 text-center py-2">
              No interventions available for this dimension
            </div>
          )}

          {!interventionsLoading && interventions.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {interventions.slice(0, 3).map((intervention: any, idx: number) => (
                <button
                  key={intervention.code}
                  onClick={() => setSelectedIntervention(intervention.code)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 rounded p-1.5 transition-all text-left group"
                >
                  <div className="flex items-start gap-1 mb-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                        {intervention.code}: {intervention.name}
                      </div>
                      <div className="text-[8px] text-gray-500 uppercase tracking-wide">
                        {intervention.level} • Priority {idx + 1}
                      </div>
                    </div>
                  </div>
                  <p className="text-[8px] text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {intervention.core_function}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>

    {/* Intervention Detail Modal */}
    <InterventionDetail
      isOpen={selectedIntervention !== null}
      interventionCode={selectedIntervention}
      onClose={() => setSelectedIntervention(null)}
      onSelectNextStep={(code) => setSelectedIntervention(code)}
    />
  </>
  )
}


