'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Sparkles, Zap, Shield, Dice6, ArrowRight,
  TrendingUp, Clock, Users, Target, Flame,
  CheckCircle2, ChevronRight, Info, Eye, AlertTriangle
} from 'lucide-react'
import { CategoryActionData } from '@/lib/services/category-data.service'
import { cn } from '@/lib/utils'
import { InterventionDetail } from '@/components/interventions/InterventionDetail'
import { CELL_TABOOS } from '@/lib/constants/sentiment-metadata'

interface CategoryDetailModalProps {
  cellData: {
    cellId: string
    levelName: string
    categoryName: string
    score: number
    count: number
    rank: number
    color: string
    description: string
  }
  categoryData: CategoryActionData | null
  onClose: () => void
}

interface Intervention {
  code: string
  name: string
  level: string
  core_function: string
  description: string | null
}

type SolutionFlavor = 'primary' | 'secondary' | 'tertiary' | 'lucky'

const FLAVOR_CONFIG = {
  primary: {
    icon: Flame,
    label: 'Primary Intervention',
    subtitle: 'Highest Impact',
    color: 'orange',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    description: 'Most recommended solution for this area'
  },
  secondary: {
    icon: Target,
    label: 'Secondary Intervention',
    subtitle: 'Strong Alternative',
    color: 'blue',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    description: 'Complementary approach'
  },
  tertiary: {
    icon: Shield,
    label: 'Tertiary Intervention',
    subtitle: 'Supporting Option',
    color: 'teal',
    gradient: 'from-teal-500 to-green-500',
    bgGradient: 'from-teal-500/10 to-green-500/10',
    borderColor: 'border-teal-500/30',
    textColor: 'text-teal-400',
    description: 'Additional reinforcement'
  },
  lucky: {
    icon: Dice6,
    label: "I'm Feeling Lucky",
    subtitle: 'Surprise Me!',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    description: 'Random selection - adventure awaits!'
  }
}

export default function CategoryDetailModal({
  cellData,
  categoryData,
  onClose
}: CategoryDetailModalProps) {
  const [selectedFlavor, setSelectedFlavor] = useState<SolutionFlavor | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInterventionCode, setSelectedInterventionCode] = useState<string | null>(null)
  const [showInterventionDetail, setShowInterventionDetail] = useState(false)

  // Parse cellId to get level and category (e.g., "L1_C3" -> level=1, category=3)
  const parseCellId = (cellId: string) => {
    const match = cellId.match(/L(\d+)_C(\d+)/)
    if (match) {
      return { level: parseInt(match[1]), category: parseInt(match[2]) }
    }
    return null
  }

  // Fetch interventions when modal opens
  useEffect(() => {
    const fetchInterventions = async () => {
      setLoading(true)
      const cellInfo = parseCellId(cellData.cellId)

      if (!cellInfo) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `/api/interventions/sentiment?level=${cellInfo.level}&category=${cellInfo.category}`
        )

        if (response.ok) {
          const data = await response.json()
          setInterventions(data.interventions || [])
        }
      } catch (error) {
        console.error('Error fetching interventions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInterventions()
    setSelectedFlavor(null)
    setShowSolution(false)
    setIsRolling(false)
  }, [cellData.cellId])

  const handleFlavorSelect = (flavor: SolutionFlavor) => {
    if (flavor === 'lucky') {
      // Roll the dice!
      setIsRolling(true)
      const flavors: SolutionFlavor[] = ['primary', 'secondary', 'tertiary']

      // Animate dice roll
      let rollCount = 0
      const rollInterval = setInterval(() => {
        const randomFlavor = flavors[Math.floor(Math.random() * flavors.length)]
        setSelectedFlavor(randomFlavor)
        rollCount++

        if (rollCount > 8) { // Roll 8 times
          clearInterval(rollInterval)
          // Final selection
          const finalFlavor = flavors[Math.floor(Math.random() * flavors.length)]
          setSelectedFlavor(finalFlavor)
          setIsRolling(false)
          setTimeout(() => setShowSolution(true), 300)
        }
      }, 150)
    } else {
      setSelectedFlavor(flavor)
      setShowSolution(true)
    }
  }

  const getSelectedIntervention = () => {
    if (!selectedFlavor || interventions.length === 0) return null
    const index = selectedFlavor === 'primary' ? 0 : selectedFlavor === 'secondary' ? 1 : 2
    return interventions[index]
  }

  const selectedIntervention = getSelectedIntervention()
  const flavorConfig = selectedFlavor ? FLAVOR_CONFIG[selectedFlavor] : null

  const handleViewInterventionDetail = () => {
    if (selectedIntervention) {
      setSelectedInterventionCode(selectedIntervention.code)
      setShowInterventionDetail(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-white/10 shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* HEADER */}
        <div className="flex-shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-xl"
                  style={{ backgroundColor: cellData.color }}
                >
                  {cellData.score.toFixed(1)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {categoryData?.category || cellData.levelName}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{cellData.levelName}</span>
                    <span>•</span>
                    <span>{cellData.categoryName}</span>
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-semibold text-white">{cellData.count}</span>
                  <span className="text-xs text-gray-500">affected</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-semibold text-white">#{cellData.rank}</span>
                  <span className="text-xs text-gray-500">priority</span>
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-lg border flex items-center gap-2",
                  cellData.rank <= 3 ? "bg-red-500/10 border-red-500/30" :
                  cellData.rank <= 8 ? "bg-orange-500/10 border-orange-500/30" :
                  "bg-yellow-500/10 border-yellow-500/30"
                )}>
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-semibold uppercase text-xs">
                    {cellData.rank <= 3 ? 'Critical' : cellData.rank <= 8 ? 'High' : 'Medium'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Category Description */}
          {categoryData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wide">
                      What This Means
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {categoryData.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Behavioral Indicators */}
              {categoryData.showsUpAs && (
                <div className="bg-gradient-to-r from-orange-500/5 to-transparent rounded-xl border border-orange-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-orange-400 mb-2 uppercase tracking-wide">
                        How It Shows Up
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {categoryData.showsUpAs}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Taboos - Things to Avoid */}
              {CELL_TABOOS[cellData.cellId] && (
                <div className="bg-gradient-to-r from-red-500/5 to-amber-500/5 rounded-xl border border-red-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wide">
                        Critical Things to Avoid
                      </h3>
                      <ul className="space-y-2">
                        {CELL_TABOOS[cellData.cellId].map((taboo, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed"
                          >
                            <span className="text-red-400 font-bold flex-shrink-0 mt-0.5">•</span>
                            <span>{taboo}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* LOADING STATE */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-4"></div>
              <p className="text-gray-400">Loading interventions...</p>
            </div>
          )}

          {/* SOLUTION FLAVOR SELECTOR */}
          {!loading && !showSolution && interventions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  Choose Your Solution Style
                </h3>
                <p className="text-sm text-gray-400">
                  Pick an approach that matches your organization's appetite for change
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(FLAVOR_CONFIG) as SolutionFlavor[]).map((flavor, idx) => {
                  const config = FLAVOR_CONFIG[flavor]
                  const Icon = config.icon
                  const isSelected = selectedFlavor === flavor && isRolling
                  
                  return (
                    <motion.button
                      key={flavor}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: isSelected ? 1.05 : 1,
                      }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleFlavorSelect(flavor)}
                      disabled={isRolling}
                      className={cn(
                        "relative group overflow-hidden rounded-xl border-2 transition-all p-6",
                        "hover:scale-105 hover:shadow-2xl",
                        isSelected 
                          ? `${config.borderColor} ring-4 ring-white/20`
                          : "border-white/10 hover:border-white/30",
                        isRolling && !isSelected && "opacity-40"
                      )}
                    >
                      {/* Animated Background */}
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br transition-opacity",
                        config.bgGradient,
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} />
                      
                      {/* Content */}
                      <div className="relative">
                        <div className="flex items-center justify-center mb-4">
                          <motion.div
                            animate={isSelected ? { rotate: 360 } : {}}
                            transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
                            className={cn(
                              "w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center",
                              config.gradient
                            )}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </motion.div>
                        </div>
                        
                        <h4 className="text-lg font-bold text-white mb-1">
                          {config.label}
                        </h4>
                        <p className={cn("text-sm font-medium mb-2", config.textColor)}>
                          {config.subtitle}
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {config.description}
                        </p>

                        {flavor === 'lucky' && (
                          <div className="mt-4 flex items-center justify-center gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-purple-400"
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: i * 0.2
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* SELECTED SOLUTION */}
          <AnimatePresence>
            {showSolution && selectedIntervention && flavorConfig && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {/* Solution Header */}
                <div className={cn(
                  "rounded-xl border-2 p-6 bg-gradient-to-br",
                  flavorConfig.bgGradient,
                  flavorConfig.borderColor
                )}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      flavorConfig.gradient
                    )}>
                      {(() => {
                        const Icon = flavorConfig.icon
                        return <Icon className="w-6 h-6 text-white" />
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className={cn("text-xs font-bold uppercase tracking-wide mb-1", flavorConfig.textColor)}>
                        {selectedIntervention.code} • {flavorConfig.label}
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {selectedIntervention.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {selectedIntervention.core_function}
                  </p>

                  {/* Level Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-400">
                      {selectedIntervention.level}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowSolution(false)
                      setSelectedFlavor(null)
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm font-semibold text-gray-300 hover:text-white"
                  >
                    Choose Different Intervention
                  </button>
                  <button
                    onClick={handleViewInterventionDetail}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-semibold flex items-center justify-center gap-2 group",
                      "bg-gradient-to-r text-white shadow-xl hover:shadow-2xl hover:scale-105",
                      flavorConfig.gradient,
                      flavorConfig.borderColor
                    )}
                  >
                    View Full Details & Next Steps
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No Data Fallback */}
          {!loading && interventions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                No interventions available for this cell yet.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* INTERVENTION DETAIL MODAL */}
      <InterventionDetail
        isOpen={showInterventionDetail}
        onClose={() => setShowInterventionDetail(false)}
        interventionCode={selectedInterventionCode}
        onSelectNextStep={(code) => {
          setSelectedInterventionCode(code)
        }}
      />
    </motion.div>
  )
}





