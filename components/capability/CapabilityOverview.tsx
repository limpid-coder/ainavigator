'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { ChevronRight, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { calculateCapabilityAssessment } from '@/lib/calculations/capability-analysis'
import { CAPABILITY_DIMENSIONS } from '@/lib/constants/capability-metadata'
import { FilterState } from '@/lib/types/assessment'

interface CapabilityOverviewProps {
  data: any[]
  benchmarks: Record<number, number>
  filters: FilterState
  onDimensionClick: (dimensionId: number) => void
  onViewSummary: () => void
}

export default function CapabilityOverview({
  data,
  benchmarks,
  filters,
  onDimensionClick,
  onViewSummary
}: CapabilityOverviewProps) {
  
  const assessment = useMemo(() =>
    calculateCapabilityAssessment(data, benchmarks, filters),
    [data, benchmarks, filters]
  )
  
  const radarData = useMemo(() => 
    assessment.dimensions.map(dim => ({
      dimension: dim.name,
      average: dim.average,
      max: dim.max,
      min: dim.min,
      benchmark: dim.benchmark
    })),
    [assessment.dimensions]
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'above': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'significantly_below': return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'below': return <AlertTriangle className="w-4 h-4 text-orange-400" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'above': return 'Above benchmark'
      case 'significantly_below': return 'Significantly below'
      case 'below': return 'Below benchmark'
      default: return 'At benchmark'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-dark rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">AI Capability Assessment</h2>
        <p className="text-gray-400">
          Organizational maturity across 8 key dimensions (32 constructs)
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="glass-dark rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Capability Radar</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  domain={[0, 10]}
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                />
                
                {/* Max (outer bound) */}
                <Radar
                  name="Max"
                  dataKey="max"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                
                {/* Average (main line) */}
                <Radar
                  name="Average"
                  dataKey="average"
                  stroke="#0D7C7F"
                  fill="#0D7C7F"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                
                {/* Min (inner bound) */}
                <Radar
                  name="Min"
                  dataKey="min"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.1}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                
                {/* Benchmark */}
                <Radar
                  name="Benchmark"
                  dataKey="benchmark"
                  stroke="#a855f7"
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              <span>Max</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0D7C7F]" />
              <span>Average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span>Min</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-[#a855f7]" style={{ width: '12px' }} />
              <span>Benchmark</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="space-y-4">
          <div className="glass-dark rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Overall Maturity</span>
                <span className="text-2xl font-bold text-teal-400">
                  {assessment.overall.average.toFixed(1)}/10
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Highest</span>
                <span className="font-semibold text-green-400">
                  {assessment.overall.highest?.name} ({assessment.overall.highest?.average.toFixed(1)})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Lowest</span>
                <span className="font-semibold text-red-400">
                  {assessment.overall.lowest?.name} ({assessment.overall.lowest?.average.toFixed(1)})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Biggest Variability</span>
                <span className="font-semibold text-orange-400">
                  {assessment.overall.biggestGap?.name} (±{assessment.overall.biggestGap?.spread.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onViewSummary}
            className="w-full btn-secondary flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            View Open-Ended Summary
          </button>
        </div>
      </div>

      {/* Dimension Details Table */}
      <div className="glass-dark rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Dimension Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-400 border-b border-white/10">
                <th className="p-3 text-left">Dimension</th>
                <th className="p-2 text-center">Avg</th>
                <th className="p-2 text-center">Max</th>
                <th className="p-2 text-center">Min</th>
                <th className="p-2 text-center">Spread</th>
                <th className="p-2 text-center">Benchmark</th>
                <th className="p-2 text-center">Status</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {assessment.dimensions.map((dim) => (
                <motion.tr
                  key={dim.dimensionId}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="border-b border-white/5 cursor-pointer"
                  onClick={() => onDimensionClick(dim.dimensionId)}
                >
                  <td className="p-3 font-medium">{dim.name}</td>
                  <td className="p-2 text-center font-semibold">{dim.average.toFixed(1)}</td>
                  <td className="p-2 text-center text-green-400">{dim.max.toFixed(1)}</td>
                  <td className="p-2 text-center text-red-400">{dim.min.toFixed(1)}</td>
                  <td className="p-2 text-center">{dim.spread.toFixed(1)}</td>
                  <td className="p-2 text-center text-purple-400">{dim.benchmark.toFixed(1)}</td>
                  <td className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getStatusIcon(dim.status)}
                      <span className="text-xs">{getStatusText(dim.status)}</span>
                    </div>
                  </td>
                  <td className="p-2 text-right">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Click any dimension to view 4-construct breakdown and detailed analysis
        </p>
      </div>
    </div>
  )
}

