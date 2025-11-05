'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Lightbulb, ArrowRight, Search, Filter as FilterIcon } from 'lucide-react'
import { InterventionDetail } from './InterventionDetail'

interface Intervention {
  code: string
  name: string
  level: string
  core_function: string
  description?: string
}

export default function InterventionsBrowsePage() {
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [filteredInterventions, setFilteredInterventions] = useState<Intervention[]>([])
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllInterventions()
  }, [])

  useEffect(() => {
    filterInterventions()
  }, [interventions, searchQuery, levelFilter])

  const fetchAllInterventions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/interventions')
      const data = await response.json()
      setInterventions(data.interventions || [])
    } catch (error) {
      console.error('Failed to fetch interventions:', error)
      setInterventions([])
    } finally {
      setLoading(false)
    }
  }

  const filterInterventions = () => {
    let filtered = interventions

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (intervention) =>
          intervention.name.toLowerCase().includes(query) ||
          intervention.code.toLowerCase().includes(query) ||
          intervention.core_function.toLowerCase().includes(query)
      )
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter((intervention) =>
        intervention.level.toLowerCase().includes(levelFilter.toLowerCase())
      )
    }

    setFilteredInterventions(filtered)
  }

  const getLevelColor = (level: string) => {
    if (level.includes('Strategy')) return 'from-purple-600 to-purple-700'
    if (level.includes('Adoption')) return 'from-blue-600 to-blue-700'
    if (level.includes('Innovation')) return 'from-teal-600 to-teal-700'
    return 'from-gray-600 to-gray-700'
  }

  const getLevelBadgeColor = (level: string) => {
    if (level.includes('Strategy')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    if (level.includes('Adoption')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    if (level.includes('Innovation')) return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300'
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }

  // Group interventions by level
  const groupedInterventions = filteredInterventions.reduce((acc, intervention) => {
    const levelKey = intervention.level.split(' - ')[0]
    if (!acc[levelKey]) acc[levelKey] = []
    acc[levelKey].push(intervention)
    return acc
  }, {} as Record<string, Intervention[]>)

  const levels = Object.keys(groupedInterventions).sort()

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              Intervention Catalogue
            </h1>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Browse all available interventions to improve AI readiness
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search interventions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Level Filter */}
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500" />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="pl-10 pr-8 py-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="strategy">A - Strategy</option>
              <option value="adoption">B - Adoption</option>
              <option value="innovation">C - Innovation</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-xs text-slate-600 dark:text-gray-400">
          Showing {filteredInterventions.length} of {interventions.length} interventions
        </div>
      </div>

      {/* Interventions List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          </div>
        ) : filteredInterventions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-gray-400">
            <Sparkles className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm">No interventions found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-6 pb-6">
            {levels.map((levelKey) => (
              <div key={levelKey}>
                {/* Level Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelBadgeColor(levelKey)}`}>
                    {levelKey}
                  </div>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                </div>

                {/* Intervention Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedInterventions[levelKey].map((intervention, idx) => (
                    <motion.div
                      key={intervention.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() => setSelectedIntervention(intervention.code)}
                        className="w-full text-left group relative rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 p-4 transition-all hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600"
                      >
                        {/* Code Badge */}
                        <div className="flex items-start justify-between mb-2">
                          <span className={`px-2 py-1 rounded-lg text-lg font-bold bg-gradient-to-r ${getLevelColor(intervention.level)} text-white`}>
                            {intervention.code}
                          </span>
                          <ArrowRight className="w-5 h-5 text-slate-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                          {intervention.name}
                        </h3>

                        {/* Core Function */}
                        <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                          {intervention.core_function}
                        </p>

                        {/* Hover Indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Intervention Detail Modal */}
      <InterventionDetail
        isOpen={selectedIntervention !== null}
        interventionCode={selectedIntervention}
        onClose={() => setSelectedIntervention(null)}
        onSelectNextStep={(code) => setSelectedIntervention(code)}
      />
    </div>
  )
}
