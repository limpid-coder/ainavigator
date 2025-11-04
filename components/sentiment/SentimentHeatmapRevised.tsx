'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, TrendingUp, TrendingDown, Sparkles, ArrowRight, Users, AlertTriangle, X } from 'lucide-react'
import { calculateSentimentHeatmap, getLowestScoringCells } from '@/lib/calculations/sentiment-ranking'
import { SENTIMENT_LEVELS, SENTIMENT_CATEGORIES } from '@/lib/constants/sentiment-metadata'
import { FilterState } from '@/lib/types/assessment'
import { cn } from '@/lib/utils'
import { CategoryDataService } from '@/lib/services/category-data.service'
import CategoryDetailModal from './CategoryDetailModal'
import GamificationHint from './GamificationHint'

interface SentimentHeatmapRevisedProps {
  data: any[]
  filters: FilterState
  onAnalyzeProblemAreas: (lowestCells: any[]) => void
}

export default function SentimentHeatmapRevised({ data, filters, onAnalyzeProblemAreas }: SentimentHeatmapRevisedProps) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [categoryDataLoaded, setCategoryDataLoaded] = useState(false)
  const [showHint, setShowHint] = useState(true)

  // Load category data on mount
  useEffect(() => {
    CategoryDataService.loadData().then(() => {
      setCategoryDataLoaded(true)
    })
  }, [])
  
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
      <div className="flex flex-col gap-4 mb-3">
        {/* Title and description */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sentiment Analysis Heatmap</h2>
            {categoryDataLoaded && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                <span className="text-xs font-bold text-purple-700 dark:text-purple-700 dark:text-purple-300">Interactive Mode</span>
              </motion.div>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-gray-400 mb-2">
            How {stats.totalRespondents} employees feel about AI across 25 dimensions
            {categoryDataLoaded && (
              <span className="text-purple-600 dark:text-purple-700 dark:text-purple-400 font-medium"> • Click any cell for gamified solutions</span>
            )}
          </p>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/30 transition-all"
          >
            <Info className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <span className="text-xs text-blue-700 dark:text-blue-700 dark:text-blue-300 font-medium">
              {showExplanation ? 'Hide' : 'Show'} Heatmap Guide
            </span>
          </button>
        </div>

        {/* Stats - full width */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
            <div className="text-xs text-slate-600 dark:text-gray-400 mb-0.5">Overall Average</div>
            <div className="flex items-baseline gap-1">
              <div className="text-2xl font-bold text-teal-700 dark:text-teal-400 tabular-nums">{stats.overallAverage.toFixed(2)}</div>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {stats.overallAverage < 2.5 ? '✅ Low concern' :
               stats.overallAverage < 3.0 ? '⚠️ Moderate' :
               stats.overallAverage < 3.5 ? '🔶 High concern' : '🔴 Critical'}
            </div>
          </div>
          <div className="px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="text-xs text-slate-600 dark:text-gray-400 mb-0.5">Priority Areas</div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400 tabular-nums">{lowestCells.length}</div>
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
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-700 dark:text-blue-400 text-xs font-bold">Y</span>
                    Rows: 5 Concern Levels
                  </h3>
                  <div className="space-y-2 text-slate-700 dark:text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L1</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Personal Workflow Preferences</span> - How AI affects individual work</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L2</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Collaboration & Role Adjustments</span> - Team dynamics and responsibilities</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L3</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Professional Trust & Fairness</span> - Ethical concerns and bias</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L4</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Career Security & Job Redefinition</span> - Long-term employment anxiety</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-700 dark:text-blue-400 font-bold flex-shrink-0">L5</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">Organizational Stability at Risk</span> - Company-wide transformation concerns</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-700 dark:text-purple-400 text-xs font-bold">X</span>
                    Columns: 5 Sentiment Categories (Why They're Concerned)
                  </h3>
                  <div className="space-y-2 text-slate-700 dark:text-gray-300">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C1</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">AI is too Autonomous</span> - Loss of human control</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C2</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">AI is too Inflexible</span> - Can't handle exceptions</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C3</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">AI is Emotionless</span> - Lacks empathy and understanding</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C4</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">AI is too Opaque</span> - Black box, no transparency</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-purple-700 dark:text-purple-400 font-bold flex-shrink-0">C5</span>
                      <div><span className="text-slate-900 dark:text-white font-semibold">People Prefer Human Interaction</span> - Value personal touch</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="mb-3">
                  <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed mb-3">
                    <span className="text-teal-700 dark:text-teal-400 font-semibold">Understanding Your Heatmap:</span> Each cell represents how employees feel about a specific AI concern. Lower scores (green) indicate comfort and readiness. Higher scores (red) indicate resistance that needs attention.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-white/10">
                      <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center text-white text-xs">✓</span>
                        What the Scores Mean
                      </div>
                      <div className="text-slate-700 dark:text-gray-300 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400 font-bold">2.0-2.5:</span> 
                          <span>Ready to adopt AI</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 dark:text-yellow-400 font-bold">2.5-3.0:</span> 
                          <span>Some concerns, manageable</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600 dark:text-orange-400 font-bold">3.0-3.5:</span> 
                          <span>Significant resistance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 dark:text-red-400 font-bold">3.5-4.0:</span> 
                          <span>Critical - needs intervention</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-lg p-3 border border-white/10">
                      <div className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs">★</span>
                        What the Colors Show
                      </div>
                      <div className="text-slate-700 dark:text-gray-300 space-y-1.5">
                        <div><span className="inline-block w-4 h-4 bg-green-700 rounded mr-2"></span> <strong>Green:</strong> Your strongest areas</div>
                        <div><span className="inline-block w-4 h-4 bg-lime-500 rounded mr-2"></span> Doing well here</div>
                        <div><span className="inline-block w-4 h-4 bg-yellow-400 rounded mr-2"></span> Average performance</div>
                        <div><span className="inline-block w-4 h-4 bg-orange-500 rounded mr-2"></span> Needs improvement</div>
                        <div><span className="inline-block w-4 h-4 bg-red-600 rounded mr-2"></span> <strong>Red:</strong> Focus here first</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-2 mt-3 border border-blue-500/20">
                  <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                    <strong className="text-blue-700 dark:text-blue-400">💡 Quick Tip:</strong> Don't worry about absolute numbers—focus on the <strong>red cells</strong> (your priority areas) and <strong>green cells</strong> (your strengths). Use filters to see specific departments or regions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEATMAP GRID */}
      <div className="flex-1 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-3 md:p-5 flex flex-col overflow-hidden">
        
        {/* Grid Container with Averages */}
        <div className="flex-1 flex gap-2 md:gap-4 overflow-auto">
          
          {/* Y-Axis Labels */}
          <div className="flex flex-col flex-shrink-0 gap-2">
            {/* Row labels aligned with grid rows */}
            <div className="grid grid-rows-5 gap-2">
              {SENTIMENT_LEVELS.map(level => (
                <div key={level.id} className="flex items-center justify-end pr-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 mb-0.5">Level {level.id}</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{level.name}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Label for column averages row */}
            <div className="flex items-center justify-end pr-4 mt-2">
              <div className="text-xs font-bold text-slate-600 dark:text-gray-400">
                Column Avg
              </div>
            </div>
          </div>

          {/* Grid + Averages */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Main Grid with Row Averages */}
            <div className="flex-1 flex gap-2">
              {/* Heatmap Grid */}
              <div className="flex-1 grid grid-cols-5 grid-rows-5 gap-2">
                {SENTIMENT_LEVELS.map((level) => (
                  SENTIMENT_CATEGORIES.map((cat) => {
                    const cellId = `L${level.id}_C${cat.id}`
                    const cell = cells.find(c => c.cellId === cellId)

                    return (
                      <motion.button
                        key={cellId}
                        onClick={() => cell && cell.count > 0 ? setSelectedCell(cellId) : null}
                        className={cn(
                          "relative rounded-lg transition-all border-2 group aspect-square",
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
                          <>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                              <div className="text-3xl font-bold text-white drop-shadow-lg tabular-nums">
                                {cell.score.toFixed(2)}
                              </div>
                              <div className="text-[10px] text-white/80 font-medium mt-1">
                                n={cell.count}
                              </div>
                            </div>
                            {/* Sparkle indicator for interactive cells with category data */}
                            {categoryDataLoaded && CategoryDataService.getCategoryForCell(cellId) && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="absolute top-1 right-1"
                              >
                                <Sparkles className="w-4 h-4 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl text-white/30 font-light">—</span>
                          </div>
                        )}
                      </motion.button>
                    )
                  })
                ))}
              </div>

              {/* Row Averages */}
              <div className="grid grid-rows-5 gap-2 w-20 flex-shrink-0">
                {stats.rowAverages.map((avg, idx) => (
                  <div key={idx} className="flex items-center justify-center rounded-lg bg-slate-500/20 border border-slate-500/30">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{avg.toFixed(2)}</div>
                      <div className="text-[9px] text-slate-600 dark:text-gray-400">Row</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column Averages + Labels + Overall */}
            <div className="flex gap-2 mt-2 mb-4">
              <div className="flex-1 grid grid-cols-5 gap-2">
                {SENTIMENT_CATEGORIES.map((cat, idx) => (
                  <div key={cat.id} className="flex flex-col gap-1">
                    {/* Column Average */}
                    <div className="flex items-center justify-center rounded-lg bg-slate-500/20 border border-slate-500/30 py-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{stats.columnAverages[idx]?.toFixed(2) || '—'}</div>
                        <div className="text-[9px] text-slate-600 dark:text-gray-400">Col</div>
                      </div>
                    </div>
                    {/* Category Label */}
                    <div className="text-center">
                      <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{cat.shortName}</div>
                      <div className="text-[10px] text-gray-500">C{cat.id}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Average */}
              <div className="w-20 flex-shrink-0">
                <div className="flex items-center justify-center rounded-lg bg-teal-500/20 border-2 border-teal-500/40 py-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-teal-700 dark:text-teal-400 tabular-nums">{stats.overallAverage.toFixed(2)}</div>
                    <div className="text-[9px] text-teal-600 dark:text-teal-500">All</div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Legend - Simple and Business Friendly */}
        <div className="pt-4 border-t border-white/5">
          <div className="text-center mb-3">
            <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">How to Read the Colors</div>
            <div className="text-[11px] text-slate-600 dark:text-gray-400">Colors show relative performance within your organization</div>
          </div>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ backgroundColor: '#15803d' }}>✓</div>
              <div className="text-left">
                <div className="text-sm text-slate-900 dark:text-white font-semibold">Top 3</div>
                <div className="text-[10px] text-slate-600 dark:text-gray-400">Strongest areas</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ backgroundColor: '#84cc16' }}>+</div>
              <div className="text-left">
                <div className="text-sm text-slate-900 dark:text-white font-medium">Strong</div>
                <div className="text-[10px] text-slate-600 dark:text-gray-400">Doing well</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ backgroundColor: '#fcd34d' }}>○</div>
              <div className="text-left">
                <div className="text-sm text-slate-900 dark:text-white">Middle</div>
                <div className="text-[10px] text-slate-600 dark:text-gray-400">Average</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ backgroundColor: '#fb923c' }}>!</div>
              <div className="text-left">
                <div className="text-sm text-slate-900 dark:text-white font-medium">Attention</div>
                <div className="text-[10px] text-slate-600 dark:text-gray-400">Needs work</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ backgroundColor: '#dc2626' }}>⚠</div>
              <div className="text-left">
                <div className="text-sm text-slate-900 dark:text-white font-semibold">Priority</div>
                <div className="text-[10px] text-slate-600 dark:text-gray-400">Focus here</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENHANCED CELL DETAIL MODAL WITH GAMIFICATION */}
      <AnimatePresence>
        {selectedCellData && selectedCellData.count > 0 && (
          <CategoryDetailModal
            cellData={selectedCellData}
            categoryData={CategoryDataService.getCategoryForCell(selectedCellData.cellId)}
            onClose={() => setSelectedCell(null)}
          />
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

      {/* GAMIFICATION HINT - First-time users */}
      {categoryDataLoaded && showHint && (
        <GamificationHint onDismiss={() => setShowHint(false)} />
      )}
      </div>
    </div>
  )
}
