'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GitCompare, X, Calendar, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComparisonModeProps {
  isOpen: boolean
  onClose: () => void
  onCompare?: (config: ComparisonConfig) => void
}

interface ComparisonConfig {
  type: 'time' | 'segment' | 'benchmark'
  baseline: string
  comparison: string
}

export function DataComparisonMode({ isOpen, onClose, onCompare }: ComparisonModeProps) {
  const [compareType, setCompareType] = useState<'time' | 'segment' | 'benchmark'>('time')
  const [baseline, setBaseline] = useState('current')
  const [comparison, setComparison] = useState('previous')

  const handleCompare = () => {
    onCompare?.({ type: compareType, baseline, comparison })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-4 top-20 w-96 z-[91] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-teal-500/10 to-purple-500/10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                  <GitCompare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Compare Data</h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400">Side-by-side analysis</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-slate-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Comparison Type */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">
                  Comparison Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'time', label: 'Time Period', icon: Calendar },
                    { value: 'segment', label: 'Segments', icon: Users },
                    { value: 'benchmark', label: 'Benchmark', icon: TrendingUp }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setCompareType(value as any)}
                      className={cn(
                        'p-3 rounded-xl border transition-all text-center',
                        compareType === value
                          ? 'bg-teal-500/10 border-teal-500/30 dark:bg-teal-500/20'
                          : 'bg-slate-50 border-slate-200 dark:bg-white/5 dark:border-white/10'
                      )}
                    >
                      <Icon className={cn(
                        'w-5 h-5 mx-auto mb-1',
                        compareType === value
                          ? 'text-teal-600 dark:text-teal-400'
                          : 'text-slate-600 dark:text-gray-400'
                      )} />
                      <div className={cn(
                        'text-xs font-medium',
                        compareType === value
                          ? 'text-teal-700 dark:text-teal-300'
                          : 'text-slate-700 dark:text-gray-400'
                      )}>
                        {label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Baseline Selection */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">
                  Baseline
                </label>
                <select
                  value={baseline}
                  onChange={(e) => setBaseline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="current">Current Period</option>
                  <option value="q1-2024">Q1 2024</option>
                  <option value="q4-2023">Q4 2023</option>
                  <option value="year-2023">Year 2023</option>
                </select>
              </div>

              {/* Comparison Selection */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 block">
                  Compare With
                </label>
                <select
                  value={comparison}
                  onChange={(e) => setComparison(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="previous">Previous Period</option>
                  <option value="q4-2023">Q4 2023</option>
                  <option value="q3-2023">Q3 2023</option>
                  <option value="industry">Industry Average</option>
                </select>
              </div>

              {/* Preview */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-teal-500/5 to-purple-500/5 border border-teal-500/20">
                <div className="flex items-center justify-center gap-3 text-sm">
                  <span className="text-slate-700 dark:text-gray-300 font-medium">Q1 2024</span>
                  <ArrowRight className="w-4 h-4 text-teal-500" />
                  <span className="text-slate-700 dark:text-gray-300 font-medium">Q4 2023</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompare}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white font-medium transition-all shadow-lg"
                >
                  Compare
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


