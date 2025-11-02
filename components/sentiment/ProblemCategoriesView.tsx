'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Users, ArrowRight, ArrowLeft, Sparkles, Activity, Info, TrendingDown, Brain, Target } from 'lucide-react'
import { ProblemCategory } from '@/lib/ai/gpt-service'
import { cn } from '@/lib/utils'

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
    // Try GPT first, fall back to mock if API key not configured
    analyzeWithGPT()
  }, [])

  const useMockData = () => {
    // Simulate API delay
    setTimeout(() => {
      const mockCategories: ProblemCategory[] = [
        {
          category_id: "CAT001",
          category_name: "The Opaque AI",
          reason: "AI is too Opaque",
          level: "Level 3 - Professional Trust & Fairness",
          score: 2.77,
          affected_count: 156,
          rank: 23,
          severity: "high",
          description: "Employees feel AI systems are black boxes—decisions lack transparency, making it difficult to trust or validate AI recommendations. This creates anxiety around accountability and potential errors.",
          business_impact: "Reduced adoption rates, compliance risks, employee resistance to AI-driven decisions",
          examples: ["Can't explain AI hiring recommendations", "Black box credit decisions", "Unclear performance evaluation criteria"]
        },
        {
          category_id: "CAT002",
          category_name: "The Autonomous Threat",
          reason: "AI is too Autonomous",
          level: "Level 4 - Career Security & Job Redefinition",
          score: 2.42,
          affected_count: 134,
          rank: 25,
          severity: "critical",
          description: "Concerns about AI replacing human decision-making entirely. Employees worry they'll lose control over their work processes and professional judgment.",
          business_impact: "High turnover risk, talent retention challenges, decreased morale",
          examples: ["Fears of job displacement", "Loss of professional autonomy", "Reduced human oversight"]
        },
        {
          category_id: "CAT003",
          category_name: "The Inflexible System",
          reason: "AI is too Inflexible",
          level: "Level 2 - Collaboration & Role Adjustments",
          score: 2.99,
          affected_count: 98,
          rank: 18,
          severity: "medium",
          description: "Frustration with AI that can't adapt to context or exceptions. Employees feel constrained by rigid AI processes that don't account for nuanced situations.",
          business_impact: "Process inefficiencies, workaround creation, reduced productivity",
          examples: ["Can't handle edge cases", "Rigid workflow constraints", "No customization options"]
        }
      ]
      
      setProblemCategories(mockCategories)
      setIsAnalyzing(false)
    }, 1500) // 1.5 second delay to show loading state
  }

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

      if (!response.ok) {
        // If GPT not configured, fall back to mock data
        const result = await response.json()
        if (result.suggestion?.includes('OpenAI API key')) {
          console.warn('OpenAI API key not configured, using mock data')
          useMockData()
          return
        }
        throw new Error(result.error || 'Failed to analyze')
      }

      const result = await response.json()
      setProblemCategories(result.data.problem_categories)
      setIsAnalyzing(false)
    } catch (err: any) {
      console.error('GPT Analysis failed, falling back to mock data:', err)
      // Fall back to mock data gracefully
      useMockData()
    }
  }

  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent rounded-lg border border-teal-500/20 p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-4"
        >
          <Brain className="w-16 h-16 text-teal-700 dark:text-teal-400" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-700 dark:text-teal-400" />
          AI Analysis in Progress
        </h3>
        <p className="text-sm text-slate-600 dark:text-gray-400 text-center max-w-md">
          Analyzing {lowestCells.length} problem areas • Generating insights • ~15 seconds
        </p>
        <div className="mt-4 flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-teal-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-teal-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 rounded-full bg-teal-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-500/5 to-transparent rounded-lg border border-red-500/20 p-8">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Analysis Failed</h3>
        <p className="text-slate-600 dark:text-gray-400 mb-6 text-center max-w-md">{error}</p>
        <div className="flex gap-3">
          <button 
            onClick={analyzeWithGPT}
            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-900 dark:text-white text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Retry Analysis
          </button>
          <button 
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:text-white text-sm font-semibold transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Heatmap
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full grid grid-cols-12 grid-rows-12 gap-2 overflow-hidden">
      
      {/* TOP ROW: HEADER & BACK - Row 1-2 */}
      <div className="col-span-9 row-span-2 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-slate-900 dark:text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">AI-Generated Problem Categories</div>
            <div className="text-[9px] text-slate-600 dark:text-gray-400">
              Analyzed {lowestCells.length} lowest-scoring areas • Identified {problemCategories.length} key challenges
            </div>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Heatmap
        </button>
      </div>

      {/* TOP RIGHT: STATS - Row 1-2 */}
      <div className="col-span-3 row-span-2 grid grid-cols-1 gap-1.5">
        <div className="bg-gradient-to-br from-red-500/5 to-transparent rounded-lg border border-red-500/20 p-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[8px] text-gray-500 uppercase tracking-wide">Critical</div>
            <div className="text-lg font-bold text-red-400 tabular-nums">
              {problemCategories.filter(c => c.severity === 'critical').length}
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/5 to-transparent rounded-lg border border-orange-500/20 p-2 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-orange-700 dark:text-orange-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[8px] text-gray-500 uppercase tracking-wide">High</div>
            <div className="text-lg font-bold text-orange-700 dark:text-orange-400 tabular-nums">
              {problemCategories.filter(c => c.severity === 'high').length}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: PROBLEM CATEGORIES GRID - Row 3-12 */}
      <div className="col-span-12 row-span-10 overflow-y-auto scrollbar-thin">
        {problemCategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 p-1">
            <AnimatePresence>
              {problemCategories.map((category, idx) => (
                <motion.button
                  key={category.category_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onViewInterventions(category)}
                  className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 hover:border-orange-400/30 transition-all p-3 text-left group cursor-pointer"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className={cn(
                      "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase",
                      category.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      category.severity === 'high' ? 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    )}>
                      {category.severity}
                    </div>
                    <div className="text-[8px] text-gray-500 font-medium">
                      Rank #{category.rank}
                    </div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-sm font-bold mb-2 text-slate-900 dark:text-white group-hover:text-teal-700 dark:text-teal-300 transition-colors line-clamp-2">
                    {category.category_name}
                  </h3>

                  {/* Context */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-start gap-1 text-[9px]">
                      <span className="text-gray-500 flex-shrink-0">Reason:</span>
                      <span className="text-slate-600 dark:text-gray-400 line-clamp-1">{category.reason}</span>
                    </div>
                    <div className="flex items-start gap-1 text-[9px]">
                      <span className="text-gray-500 flex-shrink-0">Level:</span>
                      <span className="text-slate-600 dark:text-gray-400 line-clamp-1">{category.level}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <div className="bg-white/5 rounded p-1.5">
                      <div className="text-[8px] text-gray-500 uppercase tracking-wide">Score</div>
                      <div className="text-base font-bold text-red-400 tabular-nums">{category.score.toFixed(1)}</div>
                    </div>
                    <div className="bg-white/5 rounded p-1.5">
                      <div className="text-[8px] text-gray-500 uppercase tracking-wide">Affected</div>
                      <div className="text-base font-bold flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="tabular-nums">{category.affected_count}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <p className="text-[9px] text-slate-600 dark:text-gray-400 line-clamp-3 mb-3 leading-relaxed">
                    {category.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center justify-between px-2 py-1.5 rounded bg-teal-500/10 border border-teal-500/20 group-hover:bg-teal-500/20 transition-all">
                    <span className="text-[9px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wide">View Actions</span>
                    <ArrowRight className="w-3 h-3 text-teal-700 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Info className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-slate-600 dark:text-gray-400">No problem categories generated</p>
              <button 
                onClick={analyzeWithGPT}
                className="mt-4 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-900 dark:text-white text-sm font-semibold transition-all"
              >
                Retry Analysis
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
