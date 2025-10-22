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
import { SENTIMENT_LEVELS, SENTIMENT_REASONS, HEATMAP_DESCRIPTIONS } from '@/lib/constants'

interface HeatmapViewProps {
  data: Partial<SentimentResponse>[]
  filters: FilterState
}

// Individual heatmap cell component
const HeatmapCell = ({ cellData, cellId, isSelected, onClick }: any) => {
  const intensity = cellData?.value || 0
  const hasData = cellData?.count > 0
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: Math.random() * 0.2,
        duration: 0.3,
        type: "spring",
        stiffness: 200
      }}
      whileHover={hasData ? { scale: 1.08, zIndex: 10 } : {}}
      whileTap={hasData ? { scale: 0.95 } : {}}
      onClick={hasData ? onClick : undefined}
      className={`
        relative aspect-square rounded-lg transition-all duration-200
        ${hasData ? 'cursor-pointer' : 'cursor-default'}
        ${isSelected ? 'ring-2 ring-white shadow-lg' : ''}
      `}
      style={{
        background: hasData 
          ? `linear-gradient(135deg, ${getHeatmapColor(intensity)} 0%, ${getHeatmapColor(intensity)}cc 100%)`
          : 'rgba(255, 255, 255, 0.02)',
        opacity: hasData ? 1 : 0.3,
        boxShadow: hasData && intensity > 0 
          ? `0 2px 8px ${getHeatmapColor(intensity)}22`
          : 'none'
      }}
    >
      {hasData ? (
        <>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-white font-semibold text-lg">
              {cellData.count}
            </div>
            <div className="text-white/70 text-xs">
              {cellData.value.toFixed(1)}
            </div>
          </div>
          {cellData.count > 20 && (
            <div className="absolute top-1 right-1">
              <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/20 text-xs">—</div>
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
      const key = `L${cell.y + 1}_R${cell.x + 1}`
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
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-premium rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Grid3x3 className="w-7 h-7 text-purple-400" />
              Culture Heatmap Analysis
            </h2>
            <p className="text-gray-400">
              Organizational sentiment across 25 key dimensions
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {averageSentiment.toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Average Score</div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Heatmap Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-premium rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Sentiment Matrix</h3>
          
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute -left-24 top-0 h-full flex flex-col justify-around py-6">
              {Object.entries(SENTIMENT_LEVELS).reverse().map(([level, label]) => (
                <div key={level} className="text-right pr-2">
                  <div className="text-sm font-medium text-white">{label}</div>
                  <div className="text-xs text-gray-500">Level {level}</div>
                </div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="ml-2">
              {/* Column headers */}
              <div className="grid grid-cols-5 gap-2 mb-2">
                {SENTIMENT_REASONS.map((reason, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xs text-gray-400 truncate px-1">{reason}</div>
                  </div>
                ))}
              </div>

              {/* Cells */}
              <div className="grid grid-cols-5 gap-2">
                {[5, 4, 3, 2, 1].map(level => (
                  SENTIMENT_REASONS.map((_, reasonIdx) => {
                    const cellId = `L${level}_R${reasonIdx + 1}`
                    const cellData = cellDataMap[cellId]
                    
                    return (
                      <HeatmapCell
                        key={cellId}
                        cellId={cellId}
                        cellData={cellData}
                        isSelected={selectedCell === cellId}
                        onClick={() => setSelectedCell(cellId)}
                      />
                    )
                  })
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-between glass rounded-lg p-3">
                <span className="text-xs text-gray-400 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
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
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Panel */}
        <div className="space-y-6">
          {/* Selected Cell Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-premium rounded-xl p-6"
          >
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
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-premium rounded-xl p-6"
          >
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Quick Stats
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">High Risk</span>
                <span className="text-lg font-bold text-red-400">{stats.highRisk}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Neutral</span>
                <span className="text-lg font-bold text-yellow-400">{stats.neutral}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Ready</span>
                <span className="text-lg font-bold text-green-400">{stats.ready}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}