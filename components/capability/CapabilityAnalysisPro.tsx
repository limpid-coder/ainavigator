'use client'

import { useMemo, useState } from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import {
  ChevronRight, TrendingUp, TrendingDown,
  Target, Info, BarChart3, Layers, Eye
} from 'lucide-react'
import { calculateCapabilityAssessment } from '@/lib/calculations/capability-analysis'
import { FilterState } from '@/lib/types/assessment'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/contexts/theme-context'

interface CapabilityAnalysisProProps {
  data: any[]
  benchmarks: Record<number, number>
  filters: FilterState
  onDimensionClick: (dimensionId: number) => void
  onViewSummary: () => void
}

type ChartView = 'comparison' | 'variance' | 'performance'
type BenchmarkType = 'industry' | 'region' | 'all'

export default function CapabilityAnalysisPro({
  data,
  benchmarks,
  filters,
  onDimensionClick,
  onViewSummary
}: CapabilityAnalysisProProps) {

  const { theme } = useTheme()
  const [chartView, setChartView] = useState<ChartView>('comparison')
  const [benchmarkType, setBenchmarkType] = useState<BenchmarkType>('industry')

  // Mock benchmark data (replace with actual database queries)
  const benchmarkComparisons = useMemo(() => ({
    all: { label: 'All Companies', avg: 4.3, count: 150 },
    industry: { label: 'Financial Services', avg: 4.5, count: 42 },
    region: { label: 'North America', avg: 4.2, count: 68 },
  }), [])

  // Adjust benchmarks based on selected benchmark type
  const adjustedBenchmarks = useMemo(() => {
    // Industry is the baseline (what was passed in as the default benchmarks prop)
    const baselineAvg = benchmarkComparisons['industry'].avg
    const targetAvg = benchmarkComparisons[benchmarkType].avg
    const scaleFactor = targetAvg / baselineAvg

    // Scale all benchmark values proportionally
    const adjusted: Record<number, number> = {}
    Object.keys(benchmarks).forEach(dimId => {
      adjusted[Number(dimId)] = benchmarks[Number(dimId)] * scaleFactor
    })
    return adjusted
  }, [benchmarks, benchmarkType, benchmarkComparisons])

  const assessment = useMemo(() =>
    calculateCapabilityAssessment(data, adjustedBenchmarks, filters),
    [data, adjustedBenchmarks, filters]
  )
  
  // Chart 1: Your Score vs Benchmark
  const comparisonData = useMemo(() => 
    assessment.dimensions.map(dim => ({
      dimension: dim.name.split(' ')[0],
      yourScore: dim.average,
      benchmark: dim.benchmark,
      fullName: dim.name
    })),
    [assessment.dimensions]
  )

  // Chart 2: Max/Min/Avg Variance
  const varianceData = useMemo(() => 
    assessment.dimensions.map(dim => ({
      dimension: dim.name.split(' ')[0],
      max: dim.max,
      average: dim.average,
      min: dim.min,
      fullName: dim.name
    })),
    [assessment.dimensions]
  )

  // Chart 3: Performance vs Target
  const performanceData = useMemo(() => 
    assessment.dimensions.map(dim => ({
      dimension: dim.name.split(' ')[0],
      actual: dim.average,
      target: 7.0, // Full maturity
      gap: Math.max(0, 7.0 - dim.average),
      fullName: dim.name
    })),
    [assessment.dimensions]
  )


  const chartViews = [
    { id: 'comparison' as ChartView, icon: Target, label: 'vs Benchmark', description: 'Compare to industry' },
    { id: 'variance' as ChartView, icon: BarChart3, label: 'Variance', description: 'Max/Min/Avg spread' },
    { id: 'performance' as ChartView, icon: Layers, label: 'Maturity', description: 'Progress to full maturity' },
  ]

  const aboveBenchmark = assessment.dimensions.filter(d => d.status === 'above').length
  const belowBenchmark = assessment.dimensions.filter(d => d.status === 'below' || d.status === 'significantly_below').length

  return (
    <div className="h-full flex flex-col md:flex-row gap-3 md:gap-4 overflow-hidden">
      
      {/* LEFT: MULTI-VIEW RADAR CHARTS */}
      <div className="md:w-5/12 flex flex-col gap-3">
        
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Capability Assessment</h2>
          <p className="text-sm text-slate-600 dark:text-gray-400">
            8 dimensions • {data.length} respondents analyzed
          </p>
        </div>

        {/* Chart View Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-lg border border-white/10">
          {chartViews.map((view) => {
            const Icon = view.icon
            return (
              <button
                key={view.id}
                onClick={() => setChartView(view.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md transition-all text-sm font-medium",
                  chartView === view.id
                    ? "bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-500/30 shadow-lg"
                    : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            )
          })}
        </div>

        {/* Benchmark Selector */}
        <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-lg border border-white/10">
          {(['all', 'industry', 'region'] as BenchmarkType[]).map((type) => (
            <button
              key={type}
              onClick={() => setBenchmarkType(type)}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-md transition-all text-sm font-medium",
                benchmarkType === type
                  ? "bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-500/30"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/5"
              )}
            >
              {benchmarkComparisons[type].label}
            </button>
          ))}
        </div>
        
        {/* Benchmark Info */}
        <div className="px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-gray-400">Comparing to {benchmarkComparisons[benchmarkType].count} companies</span>
            <span className="text-purple-400 font-semibold">
              Avg: {benchmarkComparisons[benchmarkType].avg.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="flex-1 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-4 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-600 dark:text-gray-400">{chartViews.find(v => v.id === chartView)?.description}</span>
            <span className="text-xs text-purple-400 font-medium">{benchmarkComparisons[benchmarkType].label}</span>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                data={
                  chartView === 'comparison' ? comparisonData :
                  chartView === 'variance' ? varianceData :
                  performanceData
                }
                margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
              >
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'light' ? '#ffffff' : '#1f2937',
                    border: theme === 'light' ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '8px 12px',
                    color: theme === 'light' ? '#1f2937' : '#ffffff'
                  }}
                />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: theme === 'light' ? '#1f2937' : '#ffffff', fontSize: 12, fontWeight: 700 }}
                />
                <PolarRadiusAxis
                  domain={[0, 10]}
                  tick={{ fill: theme === 'light' ? '#6b7280' : '#9ca3af', fontSize: 10 }}
                  tickCount={6}
                />
                <PolarGrid
                  stroke={theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={1}
                  radialLines={chartView !== 'variance'}
                />
                
                {chartView === 'comparison' && (
                  <>
                    <Radar
                      name="Industry Benchmark"
                      dataKey="benchmark"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.15}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Radar
                      name="Your Organization"
                      dataKey="yourScore"
                      stroke="#14b8a6"
                      fill="#14b8a6"
                      fillOpacity={0.25}
                      strokeWidth={3}
                    />
                  </>
                )}

                {chartView === 'variance' && (
                  <>
                    <Radar
                      name="Max Score"
                      dataKey="max"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                    <Radar
                      name="Average"
                      dataKey="average"
                      stroke="#14b8a6"
                      fill="#14b8a6"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                    <Radar
                      name="Min Score"
                      dataKey="min"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  </>
                )}

                {chartView === 'performance' && (
                  <>
                    <Radar
                      name="Target (Full Maturity)"
                      dataKey="target"
                      stroke="#6b7280"
                      fill="none"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fillOpacity={0}
                    />
                    <Radar
                      name="Current Level"
                      dataKey="actual"
                      stroke="#14b8a6"
                      fill="#14b8a6"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                  </>
                )}
                
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="flex items-center justify-center gap-4 pt-3 border-t border-white/5">
            {chartView === 'comparison' && (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                  <span className="text-xs text-slate-700 dark:text-gray-400">Your Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-purple-400" style={{ borderTop: '2px dashed #a855f7' }} />
                  <span className="text-xs text-slate-700 dark:text-gray-400">Benchmark</span>
                </div>
              </>
            )}
            {chartView === 'variance' && (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-green-400" style={{ borderTop: '2px dashed #10b981' }} />
                  <span className="text-xs text-slate-700 dark:text-gray-400">Max</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                  <span className="text-xs text-slate-700 dark:text-gray-400">Average</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-red-400" style={{ borderTop: '2px dashed #ef4444' }} />
                  <span className="text-xs text-slate-700 dark:text-gray-400">Min</span>
                </div>
              </>
            )}
            {chartView === 'performance' && (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                  <span className="text-xs text-slate-700 dark:text-gray-400">Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-0.5 bg-gray-500" style={{ borderTop: '2px dashed #6b7280' }} />
                  <span className="text-xs text-slate-700 dark:text-gray-400">Target (7.0)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-teal-500/10 to-transparent rounded-lg border border-teal-500/20 p-2.5 text-center">
            <div className="text-2xl font-bold text-teal-700 dark:text-teal-400 tabular-nums mb-0.5">
              {assessment.overall.average.toFixed(1)}
            </div>
            <div className="text-xs text-slate-700 dark:text-gray-400">Overall</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-lg border border-green-500/20 p-2.5 text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400 tabular-nums mb-0.5">
              {aboveBenchmark}
            </div>
            <div className="text-xs text-slate-700 dark:text-gray-400">Above</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-transparent rounded-lg border border-orange-500/20 p-2.5 text-center">
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400 tabular-nums mb-0.5">
              {belowBenchmark}
            </div>
            <div className="text-xs text-slate-700 dark:text-gray-400">Below</div>
          </div>
        </div>
      </div>

      {/* RIGHT: DIMENSION TABLE */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dimension Breakdown</h2>
            <p className="text-sm text-slate-600 dark:text-gray-400">Click any row for 4-construct drill-down</p>
          </div>
          <button 
            onClick={onViewSummary}
            className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 hover:border-purple-500/30 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2 transition-all font-medium"
          >
            <Eye className="w-4 h-4" />
            Open-Ended Summary <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="sticky top-0 bg-black/90 backdrop-blur-xl z-10">
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Dimension</th>
                  <th className="text-center py-3 px-3 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Score</th>
                  <th className="text-center py-3 px-3 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Max</th>
                  <th className="text-center py-3 px-3 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Min</th>
                  <th className="text-center py-3 px-3 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Benchmark</th>
                  <th className="text-center py-3 px-3 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Gap</th>
                  <th className="text-right py-3 px-4 text-slate-600 dark:text-gray-400 font-semibold uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {assessment.dimensions.map((dim, index) => {
                  const delta = ((dim.average - dim.benchmark) / dim.benchmark) * 100
                  return (
                    <tr 
                      key={dim.dimensionId} 
                      className={cn(
                        "border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group",
                        index % 2 === 0 ? "bg-white/[0.02]" : ""
                      )}
                      onClick={() => onDimensionClick(dim.dimensionId)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">{dim.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </td>
                      <td className="text-center px-3 tabular-nums">
                        <span className={cn(
                          "font-bold text-base",
                          dim.average >= dim.benchmark ? "text-green-700 dark:text-green-400" : "text-orange-700 dark:text-orange-400"
                        )}>
                          {dim.average.toFixed(1)}
                        </span>
                        <span className="text-slate-500 dark:text-gray-600 text-sm ml-0.5">/10</span>
                      </td>
                      <td className="text-center px-3 text-green-700 dark:text-green-400 tabular-nums font-medium">{dim.max.toFixed(1)}</td>
                      <td className="text-center px-3 text-orange-700 dark:text-orange-400 tabular-nums font-medium">{dim.min.toFixed(1)}</td>
                      <td className="text-center px-3 text-purple-700 dark:text-purple-400 tabular-nums font-medium">{dim.benchmark.toFixed(1)}</td>
                      <td className="text-center px-3 tabular-nums">
                        <span className={cn(
                          "inline-flex items-center gap-1 font-semibold",
                          delta > 0 ? "text-green-700 dark:text-green-400" : "text-orange-700 dark:text-orange-400"
                        )}>
                          {delta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {Math.abs(delta).toFixed(0)}%
                        </span>
                      </td>
                      <td className="text-right px-4">
                        <span className={cn(
                          "inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider",
                          dim.status === 'above' ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20" :
                          dim.status === 'below' ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                          "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20"
                        )}>
                          {dim.status === 'above' ? 'EXCEEDS' : dim.status === 'below' ? 'BELOW' : 'CRITICAL'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="flex-shrink-0 px-4 py-2.5 border-t border-white/5 bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="text-gray-500">
                Industry benchmark: <span className="text-slate-600 dark:text-gray-400 font-medium">Financial Services (1000-5000 employees)</span>
              </span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="text-gray-500">
                Scale: <span className="text-slate-600 dark:text-gray-400 font-medium">1-10 Capability Maturity</span>
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
