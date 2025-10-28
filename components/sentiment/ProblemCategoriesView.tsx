'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Users, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { ProblemCategory } from '@/lib/ai/gpt-service'

interface ProblemCategoriesViewProps {
  lowestCells: any[]
  companyContext: any
  filters: any
  onBack: () => void
  onViewInterventions: (category: ProblemCategory) => void
}

export default function ProblemCategoriesView({
  lowestCells,
  companyContext,
  filters,
  onBack,
  onViewInterventions
}: ProblemCategoriesViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [problemCategories, setProblemCategories] = useState<ProblemCategory[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    analyzeWithGPT()
  }, [])

  const analyzeWithGPT = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/gpt/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lowest_cells: lowestCells,
          company_context: companyContext,
          filters
        })
      })

      if (!response.ok) throw new Error('Failed to analyze')

      const result = await response.json()
      setProblemCategories(result.data.problem_categories)
    } catch (err: any) {
      setError(err.message)
      console.error('GPT Analysis failed:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-6"
        >
          <Sparkles className="w-12 h-12 text-teal-400" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Analyzing with our AI...</h3>
        <p className="text-gray-400 text-center max-w-md">
          AI is analyzing your lowest scoring areas and generating personalized problem categories
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-dark rounded-xl p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={analyzeWithGPT} className="btn-primary">
            Retry Analysis
          </button>
          <button onClick={onBack} className="btn-secondary">
            Back to Heatmap
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-dark rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Top Sentiment Challenges</h2>
            <p className="text-gray-400">
              AI-generated problem categories from your lowest scoring areas
            </p>
          </div>
          <button onClick={onBack} className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Heatmap
          </button>
        </div>
      </div>

      {/* Problem Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {problemCategories.map((category, idx) => (
            <motion.div
              key={category.category_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-dark rounded-xl p-6 border border-white/10 hover:border-orange-400/50 transition-all cursor-pointer group"
              onClick={() => onViewInterventions(category)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`
                  px-3 py-1 rounded-lg text-xs font-bold uppercase
                  ${category.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                    category.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-yellow-500/20 text-yellow-300'}
                `}>
                  {category.severity}
                </div>
                <div className="text-right text-xs text-gray-400">
                  Rank #{category.rank}
                </div>
              </div>

              {/* Category Name */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-teal-300 transition-colors">
                {category.category_name}
              </h3>

              {/* Context */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Reason:</span>
                  <span className="text-gray-300">{category.reason}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Level:</span>
                  <span className="text-gray-300">{category.level}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-gray-400">Score</div>
                  <div className="text-xl font-bold text-red-400">{category.score.toFixed(2)}</div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-gray-400">Affected</div>
                  <div className="text-xl font-bold flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {category.affected_count}
                  </div>
                </div>
              </div>

              {/* Description Preview */}
              <p className="text-sm text-gray-400 line-clamp-4 mb-4">
                {category.description}
              </p>

              {/* CTA */}
              <button className="w-full btn-primary flex items-center justify-center gap-2 group-hover:bg-teal-500">
                View 3 Recommended Actions
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {problemCategories.length === 0 && !isAnalyzing && (
        <div className="glass-dark rounded-xl p-12 text-center">
          <p className="text-gray-400">No problem categories generated. Please try again.</p>
        </div>
      )}
    </div>
  )
}


