'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'
import { Info, ChevronRight, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react'
import { CapabilityResponse, FilterState } from '@/lib/types'
import { calculateCapabilityDimensions, calculateConstructDetails } from '@/lib/utils/calculations'
import { CAPABILITY_DIMENSIONS, CONSTRUCT_LABELS } from '@/lib/constants'

interface CapabilityViewProps {
  data: Partial<CapabilityResponse>[]
  filters: FilterState
}

export default function CapabilityView({ data, filters }: CapabilityViewProps) {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'dimensions' | 'constructs'>('dimensions')

  const dimensions = useMemo(() => 
    calculateCapabilityDimensions(data as CapabilityResponse[], filters),
    [data, filters]
  )

  const radarData = useMemo(() => {
    if (viewMode === 'dimensions') {
      return dimensions.map(dim => ({
        dimension: dim.name,
        current: dim.averageScore,
        benchmark: dim.benchmarkScore || 3.5,
        min: dim.minScore,
        max: dim.maxScore
      }))
    } else if (selectedDimension) {
      const constructs = calculateConstructDetails(
        data as CapabilityResponse[], 
        selectedDimension, 
        filters
      )
      const labels = CONSTRUCT_LABELS[selectedDimension as keyof typeof CONSTRUCT_LABELS] || []
      return constructs.map((construct, idx) => ({
        dimension: labels[idx] || `Construct ${idx + 1}`,
        current: construct.averageScore,
        benchmark: construct.benchmarkScore || 3.5
      }))
    }
    return []
  }, [dimensions, viewMode, selectedDimension, data, filters])

  const selectedDimensionData = dimensions.find(d => d.dimensionId === selectedDimension)

  const weakestDimensions = [...dimensions]
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 3)

  const strongestDimensions = [...dimensions]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 3)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-lg shadow-xl border border-white/10">
          <p className="font-medium text-white mb-2">{payload[0].payload.dimension}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span className="text-gray-400">{entry.name}:</span>
              <span className={`ml-2 font-medium ${
                entry.dataKey === 'current' ? 'text-teal-400' : 'text-gray-300'
              }`}>
                {entry.value.toFixed(2)}
              </span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="glass-premium rounded-2xl p-8 relative overflow-hidden"
      >
        {/* Ambient background glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex items-center gap-4 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 glow-sm"
          >
            <Radar className="w-8 h-8 text-purple-300" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">
              Capability Diamond
            </h2>
            <p className="text-gray-400 text-base">
              AI maturity assessment across 8 key dimensions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Premium Radar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 30 }}
          className="lg:col-span-2 glass-premium rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold tracking-tight flex items-center gap-3 mb-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-indigo-400 rounded-full" />
                {viewMode === 'dimensions' ? 'Capability Dimensions' : 'Construct Analysis'}
              </h3>
              <p className="text-sm text-gray-400">
                {viewMode === 'dimensions'
                  ? 'Click on a dimension to drill down'
                  : `Analyzing: ${selectedDimensionData?.name}`
                }
              </p>
            </div>
            {viewMode === 'constructs' && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setViewMode('dimensions')
                  setSelectedDimension(null)
                }}
                className="px-5 py-2.5 glass-hover rounded-xl text-sm font-semibold transition-all border border-white/10 flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Overview
              </motion.button>
            )}
          </div>

          {/* Radar Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid 
                  gridType="polygon" 
                  stroke="rgba(255, 255, 255, 0.1)"
                />
                <PolarAngleAxis 
                  dataKey="dimension" 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  className="cursor-pointer"
                  onClick={(e: any) => {
                    if (viewMode === 'dimensions' && e && e.value) {
                      const dim = dimensions.find(d => d.name === e.value)
                      if (dim) {
                        setSelectedDimension(dim.dimensionId)
                        setViewMode('constructs')
                      }
                    }
                  }}
                />
                <PolarRadiusAxis 
                  domain={[0, 5]} 
                  tick={{ fill: '#6B7280', fontSize: 10 }}
                />
                <Radar 
                  name="Current" 
                  dataKey="current" 
                  stroke="#0D7C7F" 
                  fill="#0D7C7F" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar 
                  name="Benchmark" 
                  dataKey="benchmark" 
                  stroke="#14B8A6" 
                  fill="#14B8A6" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                {viewMode === 'dimensions' && (
                  <>
                    <Radar 
                      name="Min" 
                      dataKey="min" 
                      stroke="#FF6B35" 
                      fill="none" 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      opacity={0.5}
                    />
                    <Radar 
                      name="Max" 
                      dataKey="max" 
                      stroke="#14B8A6" 
                      fill="none" 
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      opacity={0.5}
                    />
                  </>
                )}
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ color: '#9CA3AF' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Dimension Selector (for mobile) */}
          <div className="mt-6 lg:hidden">
            <select
              value={selectedDimension || ''}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDimension(e.target.value)
                  setViewMode('constructs')
                }
              }}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal-500"
            >
              <option value="">Select a dimension to analyze</option>
              {dimensions.map(dim => (
                <option key={dim.dimensionId} value={dim.dimensionId}>
                  {dim.name} ({dim.averageScore.toFixed(1)}/5)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Premium Details Panel */}
        <div className="space-y-6">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
            className="glass-premium rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-400/20">
                <TrendingUp className="w-5 h-5 text-teal-300" />
              </div>
              <h3 className="font-bold text-lg tracking-tight">Strengths</h3>
            </div>
            <div className="space-y-3">
              {strongestDimensions.map((dim, idx) => (
                <div 
                  key={dim.dimensionId}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-white/5 rounded px-2 -mx-2 transition-colors"
                  onClick={() => {
                    setSelectedDimension(dim.dimensionId)
                    setViewMode('constructs')
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{idx + 1}.</span>
                    <span className="text-sm">{dim.name}</span>
                  </div>
                  <span className="text-sm font-medium text-teal-400">
                    {dim.averageScore.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 30 }}
            className="glass-premium rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-400/20">
                <TrendingDown className="w-5 h-5 text-orange-300" />
              </div>
              <h3 className="font-bold text-lg tracking-tight">Areas for Improvement</h3>
            </div>
            <div className="space-y-3">
              {weakestDimensions.map((dim, idx) => (
                <div 
                  key={dim.dimensionId}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-white/5 rounded px-2 -mx-2 transition-colors"
                  onClick={() => {
                    setSelectedDimension(dim.dimensionId)
                    setViewMode('constructs')
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{idx + 1}.</span>
                    <span className="text-sm">{dim.name}</span>
                  </div>
                  <span className="text-sm font-medium text-orange-400">
                    {dim.averageScore.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>


            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 btn-primary flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              Get Recommendations
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="glass-premium rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-400/20">
                <Info className="w-5 h-5 text-cyan-300" />
              </div>
              <h4 className="font-bold tracking-tight">Understanding Scores</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• 1-2: Initial/Ad-hoc</p>
              <p>• 2-3: Developing</p>
              <p>• 3-4: Established</p>
              <p>• 4-5: Advanced/Leading</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Overall Maturity</p>
          <p className="text-2xl font-bold">
            {(dimensions.reduce((sum, d) => sum + d.averageScore, 0) / dimensions.length).toFixed(1)}
            <span className="text-lg text-gray-500">/5</span>
          </p>
        </div>
        
        <div className="glass rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">vs Benchmark</p>
          <p className="text-2xl font-bold">
            {dimensions.reduce((sum, d) => sum + d.averageScore, 0) / dimensions.length >= 3.5 ? (
              <span className="text-teal-400">+{((dimensions.reduce((sum, d) => sum + d.averageScore, 0) / dimensions.length) - 3.5).toFixed(1)}</span>
            ) : (
              <span className="text-orange-400">{((dimensions.reduce((sum, d) => sum + d.averageScore, 0) / dimensions.length) - 3.5).toFixed(1)}</span>
            )}
          </p>
        </div>
        
        <div className="glass rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Dimensions Above 3.5</p>
          <p className="text-2xl font-bold">
            {dimensions.filter(d => d.averageScore >= 3.5).length}
            <span className="text-lg text-gray-500">/8</span>
          </p>
        </div>
        
        <div className="glass rounded-xl p-6">
          <p className="text-sm text-gray-400 mb-1">Critical Gaps</p>
          <p className="text-2xl font-bold text-orange-400">
            {dimensions.filter(d => d.averageScore < 2.5).length}
          </p>
        </div>
      </div>
    </div>
  )
}
