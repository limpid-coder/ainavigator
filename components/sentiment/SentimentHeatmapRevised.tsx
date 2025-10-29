'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, TrendingUp, TrendingDown, Sparkles, ArrowRight, Users, AlertTriangle, X } from 'lucide-react'
import { calculateSentimentHeatmap, getLowestScoringCells } from '@/lib/calculations/sentiment-ranking'
import { SENTIMENT_LEVELS, SENTIMENT_CATEGORIES } from '@/lib/constants/sentiment-metadata'
import { FilterState } from '@/lib/types/assessment'
import { cn } from '@/lib/utils'

interface SentimentHeatmapRevisedProps {
  data: any[]
  filters: FilterState
  onAnalyzeProblemAreas: (lowestCells: any[]) => void
}

export default function SentimentHeatmapRevised({ data, filters, onAnalyzeProblemAreas }: SentimentHeatmapRevisedProps) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  
  const { cells, stats } = useMemo(() => 
    calculateSentimentHeatmap(data, filters),
    [data, filters]
  )
  
  const lowestCells = useMemo(() =>
    getLowestScoringCells(cells, 5),
    [cells]
  )
  
  const selectedCellData = cells.find(c => c.cellId === selectedCell)

  return (
    <div className="h-full flex flex-col gap-3 md:gap-4 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-3 md:gap-0 mb-3">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-1">Sentiment Analysis Heatmap</h2>
          <p className="text-sm text-gray-400 mb-2">
            How {stats.totalRespondents} employees feel about AI across 25 dimensions
          </p>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/30 transition-all"
          >
            <Info className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-300 font-medium">
              {showExplanation ? 'Hide' : 'Show'} Heatmap Guide
            </span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
            <div className="text-xs text-gray-400 mb-0.5">Overall Score</div>
            <div className="flex items-baseline gap-1">
              <div className="text-2xl font-bold text-teal-400 tabular-nums">{stats.overallAverage.toFixed(2)}</div>
              <span className="text-sm text-gray-500">/4.0</span>
            </div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="text-xs text-gray-400 mb-0.5">Priority Areas</div>
            <div className="text-2xl font-bold text-orange-400 tabular-nums">{lowestCells.length}</div>
          </div>
        </div>
      </div>

      {/* HEATMAP EXPLANATION - Collapsible */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg border border-blue-500/20 p-4 mb-3">
              <div className="grid md:grid-cols-2 gap-6 text-xs">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">Y</span>
                    Rows: 5 Concern Levels
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">L1</span>
                      <div><span className="text-white font-semibold">Personal Workflow Preferences</span> - How AI affects individual work</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">L2</span>
                      <div><span className="text-white font-semibold">Collaboration & Role Adjustments</span> - Team dynamics and responsibilities</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">L3</span>
                      <div><span className="text-white font-semibold">Professional Trust & Fairness</span> - Ethical concerns and bias</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">L4</span>
                      <div><span className="text-white font-semibold">Career Security & Job Redefinition</span> - Long-term employment anxiety</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold flex-shrink-0">L5</span>
                      <div><span className="text-white font-semibold">Organizational Stability at Risk</span> - Company-wide transformation concerns</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">X</span>
                    Columns: 5 Sentiment Categories (Why They're Concerned)
                  </h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold flex-shrink-0">C1</span>
                      <div><span className="text-white font-semibold">AI is too Autonomous</span> - Loss of human control</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold flex-shrink-0">C2</span>
                      <div><span className="text-white font-semibold">AI is too Inflexible</span> - Can't handle exceptions</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold flex-shrink-0">C3</span>
                      <div><span className="text-white font-semibold">AI is Emotionless</span> - Lacks empathy and understanding</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold flex-shrink-0">C4</span>
                      <div><span className="text-white font-semibold">AI is too Opaque</span> - Black box, no transparency</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold flex-shrink-0">C5</span>
                      <div><span className="text-white font-semibold">People Prefer Human Interaction</span> - Value personal touch</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className="text-teal-400 font-semibold">How to interpret:</span> Each cell represents one of 25 "AI Taboos"—unspoken concerns employees have about AI adoption. 
                  Scores are measured on a 1-4 scale (<span className="text-green-400">1 = least resistance</span>, <span className="text-red-400">4 = most resistance</span>). 
                  <span className="text-white font-medium"> Colors show relative ranking</span> within your organization to quickly identify priority areas.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEATMAP GRID */}
      <div className="flex-1 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-3 md:p-5 flex flex-col overflow-hidden">
        
        {/* Grid Container */}
        <div className="flex-1 flex gap-2 md:gap-4 overflow-auto">
          
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-around py-8 flex-shrink-0">
            {SENTIMENT_LEVELS.map(level => (
              <div key={level.id} className="flex items-center justify-end pr-4 h-16">
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">{level.name}</div>
                  <div className="text-xs text-gray-500">Level {level.id}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Grid + X-Axis Labels */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Heatmap Grid */}
            <div className="flex-1 grid grid-cols-5 gap-2 mb-4">
              {SENTIMENT_LEVELS.map((level) => (
                SENTIMENT_CATEGORIES.map((cat) => {
                  const cellId = `L${level.id}_C${cat.id}`
                  const cell = cells.find(c => c.cellId === cellId)

                  return (
                    <motion.button
                      key={cellId}
                      onClick={() => cell && cell.count > 0 ? setSelectedCell(cellId) : null}
                      className={cn(
                        "relative rounded-lg transition-all border-2",
                        selectedCell === cellId ? 'ring-4 ring-white/30 scale-105 z-20' : 'ring-0',
                        cell && cell.count > 0 ? 'cursor-pointer hover:scale-105 hover:z-10' : 'cursor-default opacity-40'
                      )}
                      style={{
                        backgroundColor: cell?.color || '#374151',
                        borderColor: selectedCell === cellId ? '#fff' : 'transparent'
                      }}
                      whileHover={cell && cell.count > 0 ? { scale: 1.05 } : {}}
                      whileTap={cell && cell.count > 0 ? { scale: 0.98 } : {}}
                    >
                      {cell && cell.count > 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          <div className="text-2xl font-bold text-white drop-shadow-lg mb-1">
                            {cell.score.toFixed(1)}
                          </div>
                          <div className="text-xs text-white/80 font-medium">
                            n={cell.count}
                          </div>
                          <div className="text-xs text-white/60 font-semibold mt-1">
                            #{cell.rank}
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl text-white/20">—</span>
                        </div>
                      )}
                    </motion.button>
                  )
                })
              ))}
            </div>

            {/* X-Axis Labels */}
            <div className="grid grid-cols-5 gap-2">
              {SENTIMENT_CATEGORIES.map(cat => (
                <div key={cat.id} className="text-center">
                  <div className="text-sm font-semibold text-white mb-0.5">{cat.shortName}</div>
                  <div className="text-xs text-gray-500">Category {cat.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#15803d' }} />
            <span className="text-xs text-gray-400 font-medium">Best 3</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }} />
            <span className="text-xs text-gray-400">Strong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fcd34d' }} />
            <span className="text-xs text-gray-400">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fb923c' }} />
            <span className="text-xs text-gray-400">Concerning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }} />
            <span className="text-xs text-gray-400 font-medium">Worst 3</span>
          </div>
        </div>
      </div>

      {/* CELL DETAIL MODAL */}
      <AnimatePresence>
        {selectedCellData && selectedCellData.count > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCell(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-6 max-w-2xl w-full mx-4 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold text-white"
                      style={{ backgroundColor: selectedCellData.color }}
                    >
                      {selectedCellData.score.toFixed(1)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedCellData.levelName}</h3>
                      <p className="text-sm text-gray-400">{selectedCellData.categoryName}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Score</div>
                  <div className="text-2xl font-bold text-white">{selectedCellData.score.toFixed(2)}<span className="text-sm text-gray-500">/5.0</span></div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Responses</div>
                  <div className="text-2xl font-bold text-white">{selectedCellData.count}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Ranking</div>
                  <div className="text-2xl font-bold text-white">#{selectedCellData.rank}<span className="text-sm text-gray-500">/25</span></div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">Description</div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedCellData.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTION BUTTON */}
      {lowestCells.length > 0 && (
        <div className="flex-shrink-0">
          <button
            onClick={() => onAnalyzeProblemAreas(lowestCells)}
            className="w-full bg-gradient-to-r from-teal-500/10 to-purple-500/10 hover:from-teal-500/15 hover:to-purple-500/15 rounded-lg border border-teal-500/30 hover:border-teal-400/50 transition-all p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-base font-bold text-white mb-1">Generate AI Insights</div>
                <div className="text-sm text-gray-400">
                  Analyze {lowestCells.length} priority concern areas with our AI • Get actionable recommendations
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  )
}
