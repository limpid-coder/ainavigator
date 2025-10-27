'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Info, 
  AlertCircle, 
  ChevronRight, 
  Lightbulb,
  Activity,
  TrendingDown,
  TrendingUp,
  Grid3x3
} from 'lucide-react'
import { SentimentResponse, FilterState } from '@/lib/types'
import { calculateSentimentHeatmap, getHeatmapColor } from '@/lib/utils/calculations'
import { SENTIMENT_LEVELS, SENTIMENT_REASONS } from '@/lib/constants'

interface HeatmapViewProps {
  data: Partial<SentimentResponse>[]
  filters: FilterState
}

// Premium heatmap cell component with Apple-level polish
const HeatmapCell = ({ cellData, isSelected, onClick }: {
  cellData: { value: number; count: number } | null;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const intensity = cellData?.value || 0
  const hasData = cellData ? cellData.count > 0 : false
  const color = getHeatmapColor(intensity)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={hasData ? {
        scale: 1.05,
        zIndex: 10
      } : {}}
      onClick={hasData ? onClick : undefined}
      className={`
        relative aspect-square rounded-lg transition-all duration-300
        ${hasData ? 'cursor-pointer' : 'cursor-default'}
        ${isSelected ? 'ring-1 ring-white/80 ring-offset-1 ring-offset-black' : ''}
      `}
      style={{
        background: hasData
          ? `linear-gradient(135deg,
              ${color} 0%,
              ${color}f0 40%,
              ${color}cc 100%)`
          : 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)',
        opacity: hasData ? 1 : 0.25,
        boxShadow: hasData && intensity > 0
          ? `
            0 4px 12px ${color}30,
            0 8px 24px ${color}20,
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.2)
          `
          : '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >

      {hasData ? (
        <>
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="text-white font-bold text-sm">
              {cellData?.count || 0}
            </div>
            <div className="text-white/70 text-xs">
              {cellData?.value?.toFixed(1) || '0.0'}
            </div>
          </div>
          {cellData && cellData.count > 20 && (
            <div className="absolute top-2 right-2 z-10">
              <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/15 text-xs font-medium">—</div>
        </div>
      )}
    </motion.div>
  )
}

export default function HeatmapView({ data, filters }: HeatmapViewProps) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  
  const heatmapData = useMemo(() => 
    calculateSentimentHeatmap(data as SentimentResponse[], filters),
    [data, filters]
  )

  const cellDataMap = useMemo(() => {
    const map: Record<string, typeof heatmapData[0]> = {}
    heatmapData.forEach(cell => {
      // cell.y is row (0-4), convert to level (5-1)
      const level = 5 - cell.y
      const key = `L${level}_R${cell.x + 1}`
      map[key] = cell
    })
    return map
  }, [heatmapData])

  const selectedCellData = selectedCell ? cellDataMap[selectedCell] : null

  const totalResponses = heatmapData.reduce((sum, cell) => sum + cell.count, 0)
  const averageSentiment = totalResponses > 0
    ? heatmapData.reduce((sum, cell) => sum + (cell.value * cell.count), 0) / totalResponses
    : 0

  const stats = {
    highRisk: heatmapData.filter(c => c.value < 2.5 && c.count > 0).length,
    neutral: heatmapData.filter(c => c.value >= 2.5 && c.value < 3.5 && c.count > 0).length,
    ready: heatmapData.filter(c => c.value >= 3.5 && c.count > 0).length
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="glass-dark rounded-xl p-3 relative overflow-hidden">

        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/20">
                <Grid3x3 className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">
                  Culture Heatmap
                </h2>
                <p className="text-gray-400 text-xs">
                  Organizational sentiment across 25 key dimensions
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="px-3 py-2 rounded-lg glass-dark bg-teal-500/10">
              <div className="text-xl font-bold text-teal-400">
                {averageSentiment.toFixed(1)}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                Avg
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        {/* Heatmap Visualization */}
        <div className="lg:col-span-2 glass-dark rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-md font-bold tracking-tight flex items-center gap-2">
              Sentiment Matrix
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Activity className="w-4 h-4" />
              <span>Live Data</span>
            </div>
          </div>
          
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute -left-16 top-0 h-full flex flex-col justify-around py-2">
              {Object.entries(SENTIMENT_LEVELS).reverse().map(([level, label]) => (
                <div key={level} className="text-right pr-1">
                  <div className="text-xs text-gray-400 truncate">{label.slice(0, 6)}</div>
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="ml-2">
              {/* Column headers */}
              <div className="grid grid-cols-5 gap-1 mb-1">
                {SENTIMENT_REASONS.map((reason, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xs text-gray-500 truncate">{reason.slice(0,8)}</div>
                  </div>
                ))}
              </div>

              {/* Cells */}
              <div className="grid grid-cols-5 gap-1">
                {[5, 4, 3, 2, 1].map(level => (
                  SENTIMENT_REASONS.map((_, reasonIdx) => {
                    const cellId = `L${level}_R${reasonIdx + 1}`
                    const cellData = cellDataMap[cellId]
                    
                    return (
                      <HeatmapCell
                        key={cellId}
                        cellData={cellData}
                        isSelected={selectedCell === cellId}
                        onClick={() => setSelectedCell(cellId)}
                      />
                    )
                  })
                ))}
              </div>

              {/* Legend */}
              <div className="mt-3 flex items-center justify-between glass rounded p-2 text-xs">
                <span className="text-xs text-gray-400 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-orange-400" />
                  Resistance
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div
                      key={level}
                      className="w-8 h-4 rounded"
                      style={{ backgroundColor: getHeatmapColor(level) }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-2">
                  Readiness
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-3">
          {/* Selected Cell Details */}
          <div className="glass-dark rounded-lg p-3">
            <AnimatePresence mode="wait">
              {selectedCellData && selectedCellData.count > 0 ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="font-semibold text-lg mb-3">{selectedCellData.label}</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {selectedCellData.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Responses</span>
                      <span className="font-semibold">{selectedCellData.count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Score</span>
                      <span className="font-semibold">{selectedCellData.value.toFixed(2)}/5</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedCellData.value / 5) * 100}%` }}
                        className="h-full gradient-primary"
                      />
                    </div>
                  </div>

                  <button className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    View Interventions
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <Info className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">Select a cell to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Statistics */}
          <div className="glass-dark rounded-lg p-3">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              Stats
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">High Risk</span>
                <span className="text-lg font-bold text-orange-400">{stats.highRisk}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Neutral</span>
                <span className="text-lg font-bold text-purple-400">{stats.neutral}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Ready</span>
                <span className="text-lg font-bold text-teal-400">{stats.ready}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}