'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Target,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  BarChart3
} from 'lucide-react'
import { DEMO_INTERVENTIONS } from '@/lib/constants'

interface InterventionModalProps {
  isOpen: boolean
  onClose: () => void
  targetAreas?: string[]
  targetDimensions?: string[]
  onSelectIntervention: (interventionId: string) => void
}

export default function InterventionModal({
  isOpen,
  onClose,
  targetAreas = [],
  targetDimensions = [],
  onSelectIntervention
}: InterventionModalProps) {
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)

  // Find relevant interventions based on gaps
  const relevantInterventions = DEMO_INTERVENTIONS.filter(intervention => {
    const sentimentMatch = intervention.targetSentimentAreas?.some(area => 
      targetAreas.includes(area)
    )
    const capabilityMatch = intervention.targetDimensions?.some(dim => 
      targetDimensions.includes(dim)
    )
    return sentimentMatch || capabilityMatch
  })

  // If no specific matches, show top 3 high-priority interventions
  const displayInterventions = relevantInterventions.length > 0 
    ? relevantInterventions.slice(0, 3)
    : DEMO_INTERVENTIONS.filter(i => i.priority === 'high').slice(0, 3)

  const selected = displayInterventions.find(i => i.id === selectedIntervention)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  if (!isOpen) return null

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
          className="relative w-full max-w-5xl max-h-[85vh] overflow-hidden glass-dark rounded-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Lightbulb className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Recommended Interventions</h2>
                  <p className="text-sm text-gray-400">
                    {relevantInterventions.length > 0 
                      ? `${relevantInterventions.length} intervention${relevantInterventions.length > 1 ? 's' : ''} matched to your gaps`
                      : 'Top priority interventions for AI readiness'
                    }
                  </p>
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
            <div className="p-6">
              {!selectedIntervention ? (
                /* Intervention List */
                <div className="grid grid-cols-1 gap-4">
                  {displayInterventions.map((intervention) => (
                    <motion.div
                      key={intervention.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      className="glass rounded-xl p-5 cursor-pointer border border-white/5 hover:border-purple-400/30 transition-all group"
                      onClick={() => setSelectedIntervention(intervention.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`mt-1 px-2 py-1 rounded text-xs font-medium ${
                              intervention.priority === 'high' 
                                ? 'bg-orange-500/20 text-orange-300' 
                                : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {intervention.priority.toUpperCase()} PRIORITY
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors">
                            {intervention.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4">
                            {intervention.description}
                          </p>

                          <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{intervention.implementation.duration}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${getDifficultyColor(intervention.implementation.difficulty)}`}>
                              <Target className="w-4 h-4" />
                              <span className="capitalize">{intervention.implementation.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-2 text-teal-400">
                              <TrendingUp className="w-4 h-4" />
                              <span>{intervention.roiEstimate.min}-{intervention.roiEstimate.max}% impact</span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-300 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Detailed View */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <button
                    onClick={() => setSelectedIntervention(null)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to list
                  </button>

                  {selected && (
                    <>
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            selected.priority === 'high' 
                              ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30' 
                              : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                          }`}>
                            {selected.priority.toUpperCase()} PRIORITY
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">{selected.title}</h2>
                        <p className="text-gray-300 text-lg">{selected.description}</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="glass rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wide">Duration</span>
                          </div>
                          <p className="font-semibold">{selected.implementation.duration}</p>
                        </div>
                        <div className="glass rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Target className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wide">Difficulty</span>
                          </div>
                          <p className={`font-semibold capitalize ${getDifficultyColor(selected.implementation.difficulty)}`}>
                            {selected.implementation.difficulty}
                          </p>
                        </div>
                        <div className="glass rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs uppercase tracking-wide">Impact</span>
                          </div>
                          <p className="font-semibold text-teal-400">
                            {selected.roiEstimate.min}-{selected.roiEstimate.max}%
                          </p>
                        </div>
                      </div>

                      {/* Full Description */}
                      <div className="glass rounded-xl p-5">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-400" />
                          Overview
                        </h3>
                        <div className="text-gray-300 text-sm space-y-3">
                          {selected.fullDescription.split('\n\n').map((para, idx) => (
                            <p key={idx}>{para}</p>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div className="glass rounded-xl p-5">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          Required Resources
                        </h3>
                        <ul className="space-y-2">
                          {selected.implementation.resources.map((resource, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => onSelectIntervention(selected.id)}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <BarChart3 className="w-5 h-5" />
                          View ROI Impact
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

