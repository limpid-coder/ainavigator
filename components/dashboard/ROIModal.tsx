'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  TrendingUp, 
  DollarSign,
  Clock,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Download
} from 'lucide-react'
import { DEMO_INTERVENTIONS } from '@/lib/constants'

interface ROIModalProps {
  isOpen: boolean
  onClose: () => void
  interventionId: string | null
  onExportPDF: () => void
}

export default function ROIModal({
  isOpen,
  onClose,
  interventionId,
  onExportPDF
}: ROIModalProps) {
  const intervention = DEMO_INTERVENTIONS.find(i => i.id === interventionId)

  if (!isOpen || !intervention) return null

  // Calculate projected ROI metrics
  const projectedMetrics = {
    efficiencyGain: `${intervention.roiEstimate.min}-${intervention.roiEstimate.max}%`,
    timeToValue: intervention.implementation.duration,
    peopleImpacted: intervention.impactArea === 'both' ? '500+' : intervention.impactArea === 'sentiment' ? '300+' : '200+',
    costSavings: intervention.roiEstimate.max > 30 ? '$250K-$500K' : '$100K-$250K'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden glass-dark rounded-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500/20 to-blue-500/20">
                  <BarChart3 className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">ROI Impact Analysis</h2>
                  <p className="text-sm text-gray-400">{intervention.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin">
            <div className="p-6 space-y-6">
              {/* Hero Metric */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-dark rounded-2xl p-8 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-blue-500/10" />
                <div className="relative z-10">
                  <div className="inline-flex p-3 rounded-full bg-teal-500/20 mb-4">
                    <TrendingUp className="w-8 h-8 text-teal-300" />
                  </div>
                  <h3 className="text-5xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                    {projectedMetrics.efficiencyGain}
                  </h3>
                  <p className="text-xl text-gray-300 mb-2">Projected Impact</p>
                  <p className="text-sm text-gray-400 max-w-lg mx-auto">
                    {intervention.roiEstimate.description}
                  </p>
                </div>
              </motion.div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <DollarSign className="w-5 h-5 text-purple-300" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{projectedMetrics.costSavings}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Annual Savings</p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Clock className="w-5 h-5 text-blue-300" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{projectedMetrics.timeToValue}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Time to Value</p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-teal-500/20">
                      <Users className="w-5 h-5 text-teal-300" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">{projectedMetrics.peopleImpacted}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">People Impacted</p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="glass rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <TrendingUp className="w-5 h-5 text-green-300" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mb-1">
                    {intervention.priority === 'high' ? 'High' : 'Medium'}
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Confidence Level</p>
                </motion.div>
              </div>

              {/* Impact Breakdown */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-dark rounded-xl p-6"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  Expected Outcomes
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Productivity Improvement</span>
                      <span className="text-sm font-medium text-teal-400">{intervention.roiEstimate.min}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${intervention.roiEstimate.min}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Employee Readiness</span>
                      <span className="text-sm font-medium text-blue-400">{intervention.roiEstimate.max}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${intervention.roiEstimate.max}%` }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Risk Reduction</span>
                      <span className="text-sm font-medium text-purple-400">85%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Timeline */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-dark rounded-xl p-6"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Impact Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-teal-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">Weeks 1-2: Quick Wins</p>
                      <p className="text-xs text-gray-400">Initial training completed, early adopters identified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">Weeks 3-6: Momentum Building</p>
                      <p className="text-xs text-gray-400">Team engagement increases, first measurable improvements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-purple-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">Weeks 7-12: Full Impact</p>
                      <p className="text-xs text-gray-400">Organization-wide adoption, sustained improvements visible</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Disclaimer */}
              <div className="glass rounded-lg p-4 border border-amber-500/20">
                <p className="text-xs text-gray-400">
                  <strong className="text-amber-400">Note:</strong> These are directional estimates based on industry benchmarks and similar implementations. Actual results may vary based on organizational context, execution quality, and market conditions.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onExportPDF}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export Full Report
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

