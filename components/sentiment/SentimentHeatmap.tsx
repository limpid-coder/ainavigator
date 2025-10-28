'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Info, TrendingUp, TrendingDown, Sparkles, ArrowRight } from 'lucide-react'
import { calculateSentimentHeatmap, getLowestScoringCells } from '@/lib/calculations/sentiment-ranking'
import { SENTIMENT_LEVELS, SENTIMENT_CATEGORIES } from '@/lib/constants/sentiment-metadata'
import { FilterState } from '@/lib/types/assessment'

interface SentimentHeatmapProps {
  data: any[]
  filters: FilterState
  onAnalyzeProblemAreas: (lowestCells: any[]) => void
}

export default function SentimentHeatmap({ data, filters, onAnalyzeProblemAreas }: SentimentHeatmapProps) {
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  
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
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="glass-dark rounded-xl p-6 border border-teal-500/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Employee Sentiment Heatmap</h2>
            <p className="text-gray-300">
              How your {stats.totalRespondents.toLocaleString()} employees feel about AI across 25 key areas
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Lower scores (red) indicate concerns • Higher scores (green) show readiness
            </p>
          </div>
          <div className="text-right">
            <div className="px-6 py-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <div className="text-4xl font-bold text-teal-400 mb-1">
                {stats.overallAverage.toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Overall Sentiment</div>
              <div className="text-xs text-gray-500 mt-1">out of 5.0</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="glass rounded-lg p-4 border border-white/5">
            <div className="text-gray-400 mb-1">Total Responses</div>
            <div className="text-2xl font-bold">{stats.totalRespondents.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">employees surveyed</div>
          </div>
          <div className="glass rounded-lg p-4 border border-white/5">
            <div className="text-gray-400 mb-1">Score Range</div>
            <div className="text-2xl font-bold">{stats.standardDeviation.toFixed(1)}</div>
            <div className="text-xs text-gray-500 mt-1">standard deviation</div>
          </div>
          <div className="glass rounded-lg p-4 border border-orange-500/20">
            <div className="text-gray-400 mb-1">Priority Areas</div>
            <div className="text-2xl font-bold text-orange-400">{lowestCells.length}</div>
            <div className="text-xs text-gray-500 mt-1">need attention</div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="glass-dark rounded-xl p-6 border border-white/10">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">Sentiment Matrix</h3>
          <p className="text-sm text-gray-400">
            Click any cell to see detailed insights • Colors represent relative ranking across all 25 areas
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 p-3 text-left text-sm font-semibold text-gray-300 border-b-2 border-white/20 bg-black/40 backdrop-blur-sm">
                  Concern Level
                </th>
                {SENTIMENT_CATEGORIES.map((cat) => (
                  <th
                    key={cat.id}
                    className="p-3 text-center text-xs font-medium text-gray-300 border-b-2 border-white/20 min-w-[100px]"
                    title={cat.description}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold">{cat.shortName}</span>
                      <span className="text-[10px] text-gray-500 font-normal">({cat.id})</span>
                    </div>
                  </th>
                ))}
                <th className="p-3 text-center text-sm font-semibold text-gray-300 border-b-2 border-white/20 bg-gradient-to-r from-teal-500/10 to-transparent">
                  Row Avg
                </th>
              </tr>
            </thead>
            <tbody>
              {SENTIMENT_LEVELS.map((level, levelIdx) => (
                <tr key={level.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td
                    className="sticky left-0 z-10 p-3 text-sm font-medium text-gray-300 max-w-[200px] bg-black/40 backdrop-blur-sm"
                    title={level.description}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-teal-400 font-bold">{level.id}</span>
                      <span className="line-clamp-2">{level.name}</span>
                    </div>
                  </td>
                  {SENTIMENT_CATEGORIES.map((cat, catIdx) => {
                    const cellId = `L${level.id}_C${cat.id}`
                    const cell = cells.find(c => c.cellId === cellId)

                    return (
                      <td key={cat.id} className="p-2 relative group">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedCell(cellId)}
                          className={`
                            w-full aspect-square rounded-lg p-3 text-center transition-all relative overflow-hidden
                            ${selectedCell === cellId ? 'ring-2 ring-white shadow-2xl z-20' : 'ring-1 ring-white/5'}
                            ${cell && cell.count > 0 ? 'cursor-pointer hover:shadow-xl hover:z-10' : 'cursor-default opacity-40'}
                          `}
                          style={{
                            backgroundColor: cell?.color || '#6b7280'
                          }}
                        >
                          {cell && cell.count > 0 ? (
                            <>
                              <div className="text-white font-bold text-xl drop-shadow-md">
                                {cell.score.toFixed(1)}
                              </div>
                              <div className="text-white/80 text-xs mt-1 font-medium">
                                {cell.count.toLocaleString()}
                              </div>

                              {/* Hover Tooltip */}
                              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center p-2 pointer-events-none">
                                <div className="text-[10px] text-white text-center leading-tight">
                                  <div className="font-bold mb-1">Rank #{cell.rank}</div>
                                  <div className="text-gray-300">Click for details</div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-white/30 text-xs">No data</div>
                          )}
                        </motion.button>
                      </td>
                    )
                  })}
                  <td className="p-3 text-center font-bold bg-gradient-to-r from-teal-500/5 to-transparent text-teal-400">
                    {stats.rowAverages[levelIdx]?.toFixed(1) || '-'}
                  </td>
                </tr>
              ))}
              {/* Column Averages Row */}
              <tr className="bg-gradient-to-r from-teal-500/10 to-transparent border-t-2 border-white/20">
                <td className="sticky left-0 z-10 p-3 text-sm font-bold text-gray-200 bg-black/40 backdrop-blur-sm">
                  Column Avg
                </td>
                {SENTIMENT_CATEGORIES.map((cat, idx) => (
                  <td key={cat.id} className="p-3 text-center font-bold text-teal-400">
                    {stats.columnAverages[idx]?.toFixed(1) || '-'}
                  </td>
                ))}
                <td className="p-3 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/20 border border-teal-500/30">
                    <span className="text-xs font-medium text-teal-300">Overall</span>
                    <span className="text-lg font-bold text-teal-400">
                      {stats.overallAverage.toFixed(1)}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-300">Score Key</h4>
            <p className="text-xs text-gray-500">
              Colors show relative ranking • Click any cell for details
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#15803d' }} />
              <span className="text-sm text-gray-300">Highest scores</span>
              <span className="text-xs text-gray-500">(top 3)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }} />
              <span className="text-sm text-gray-300">Strong</span>
              <span className="text-xs text-gray-500">(top 8)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fcd34d' }} />
              <span className="text-sm text-gray-300">Moderate</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fb923c' }} />
              <span className="text-sm text-gray-300">Needs attention</span>
              <span className="text-xs text-gray-500">(bottom 8)</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }} />
              <span className="text-sm text-gray-300">Critical concern</span>
              <span className="text-xs text-gray-500">(bottom 3)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cell Detail Panel */}
      {selectedCellData && selectedCellData.count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-xl p-6 border border-blue-500/20"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                {selectedCellData.levelName}
              </h3>
              <p className="text-sm text-gray-400">
                Concern: {selectedCellData.categoryName}
              </p>
            </div>
            {selectedCellData.rank <= 3 && (
              <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Strength Area
              </div>
            )}
            {selectedCellData.rank >= 23 && (
              <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Needs Attention
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Average Score</div>
              <div className="text-3xl font-bold">{selectedCellData.score.toFixed(1)}</div>
              <div className="text-xs text-gray-500">out of 5.0</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Employees</div>
              <div className="text-3xl font-bold">{selectedCellData.count.toLocaleString()}</div>
              <div className="text-xs text-gray-500">respondents</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-1">Priority Level</div>
              <div className={`text-2xl font-bold ${
                selectedCellData.rank >= 23 ? 'text-red-400' :
                selectedCellData.rank >= 20 ? 'text-orange-400' :
                selectedCellData.rank <= 5 ? 'text-green-400' :
                'text-gray-300'
              }`}>
                {selectedCellData.rank >= 23 ? 'Critical' :
                 selectedCellData.rank >= 20 ? 'High' :
                 selectedCellData.rank <= 5 ? 'Strength' :
                 'Moderate'}
              </div>
              <div className="text-xs text-gray-500">
                Ranked #{selectedCellData.rank} of 25
              </div>
            </div>
          </div>

          <div className="glass rounded-lg p-4 mb-4 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-2">What This Means</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedCellData.description}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedCell(null)}
            className="btn-secondary w-full"
          >
            Close Details
          </button>
        </motion.div>
      )}

      {/* Action Button */}
      {lowestCells.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-2xl p-8 border border-teal-500/20 text-center"
        >
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">Ready for Insights?</h3>
            <p className="text-gray-400">
              Our AI will analyze the {lowestCells.length} priority areas and provide
              actionable recommendations tailored to your organization
            </p>
          </div>
          <button
            onClick={() => onAnalyzeProblemAreas(lowestCells)}
            className="btn-primary px-8 py-4 text-lg flex items-center gap-3 mx-auto"
          >
            <Sparkles className="w-6 h-6" />
            Generate AI Recommendations
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Analysis takes 10-15 seconds • Powered by GPT-4
          </p>
        </motion.div>
      )}
    </div>
  )
}

