'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Download, ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { ViewState, FilterState, CompanyProfile } from '@/lib/types/assessment'
import FilterPanel from '@/components/dashboard/FilterPanel'
import OverviewDashboard from '@/components/dashboard/OverviewDashboard'
import SentimentHeatmap from '@/components/sentiment/SentimentHeatmap'
import ProblemCategoriesView from '@/components/sentiment/ProblemCategoriesView'
import InterventionsView from '@/components/sentiment/InterventionsView'
import CapabilityOverview from '@/components/capability/CapabilityOverview'
import DimensionDrilldown from '@/components/capability/DimensionDrilldown'
import OpenEndedSummary from '@/components/capability/OpenEndedSummary'
import { generatePDF } from '@/lib/utils/pdfExport'

export default function AssessmentPage() {
  const { session, company, isAuthenticated, logout } = useAuth()
  
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'overview' })
  const [sentimentData, setSentimentData] = useState<any[]>([])
  const [capabilityData, setCapabilityData] = useState<any[]>([])
  const [filters, setFilters] = useState<FilterState>({})
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock company profile (replace with actual data)
  const companyProfile: CompanyProfile = {
    id: company?.id || 'demo',
    name: company?.display_name || 'Demo Company',
    displayName: company?.display_name || 'Demo Company',
    industry: 'Financial Services', // TODO: Get from company data
    size: '1000-5000',
    aiMaturity: 'early_adoption'
  }

  const benchmarks: Record<number, number> = {
    1: 4.3, // Strategy
    2: 5.5, // Data
    3: 4.1, // Technology
    4: 3.7, // Talent
    5: 4.6, // Org Processes
    6: 4.3, // Innovation
    7: 4.1, // Adaptation
    8: 4.9  // Ethics
  }

  useEffect(() => {
    // Only load data once we have a valid company ID
    if (company?.id) {
      loadData()
    }
  }, [company?.id])

  const loadData = async () => {
    if (!company?.id) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/data/respondents', {
        headers: {
          'x-company-id': company.id
        }
      })

      if (!response.ok) throw new Error('Failed to load data')

      const result = await response.json()
      setSentimentData(result.data)

      // Generate sample capability data (TODO: Load from API)
      const sampleCapabilityData = generateSampleCapabilityData(result.data.length)
      setCapabilityData(sampleCapabilityData)
    } catch (error) {
      console.error('Data load error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate sample capability data matching respondent count
  const generateSampleCapabilityData = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const respondent: any = {
        RespondentID: `R${i + 1}`,
        Region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
        Department: ['Finance', 'IT', 'Operations', 'Sales'][Math.floor(Math.random() * 4)],
        Employment_type: ['Full-time', 'Part-time', 'Contract'][Math.floor(Math.random() * 3)],
        Age: ['18-25', '26-35', '36-45', '46-55', '56+'][Math.floor(Math.random() * 5)],
        UserLanguage: 'EN'
      }

      // Add 32 construct scores (Q1-Q32 mapped to construct_1-construct_32)
      for (let j = 1; j <= 32; j++) {
        // Generate scores between 1-10 with variation
        // Make some dimensions naturally higher/lower for realism
        let basescore = 5.0
        if (j <= 4) basescore = 4.5 // Strategy
        if (j >= 5 && j <= 8) basescore = 6.2 // Data
        if (j >= 9 && j <= 12) basescore = 5.8 // Technology
        if (j >= 13 && j <= 16) basescore = 4.1 // Talent
        if (j >= 17 && j <= 20) basescore = 5.5 // Org Processes
        if (j >= 21 && j <= 24) basescore = 4.7 // Innovation
        if (j >= 25 && j <= 28) basescore = 5.3 // Adaptation
        if (j >= 29 && j <= 32) basescore = 6.5 // Ethics

        respondent[`construct_${j}`] = Math.min(10, Math.max(1, basescore + (Math.random() * 2 - 1)))
      }

      return respondent
    })
  }

  const handleExportPDF = async () => {
    try {
      await generatePDF({
        companyName: companyProfile.displayName,
        sentimentData,
        capabilityData,
        selectedFlow: currentView.type.includes('sentiment') ? 'sentiment' : 'capability',
        filters
      })
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to generate PDF')
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4 mx-auto">
            <Sparkles className="w-12 h-12 text-teal-400" />
          </div>
          <p className="text-gray-400">Loading assessment data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0" />
      
      {/* Header */}
      <header className="relative border-b border-white/5 backdrop-blur-xl z-40 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <img 
                  src="/LeadingwithAI-removebg-preview.png" 
                  alt="AI Navigator" 
                  className="w-7 h-7 object-contain"
                />
                <span className="font-semibold">AI Navigator</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-4">
                <div className="h-6 w-px bg-white/10" />
                <div>
                  <p className="text-sm font-medium">{companyProfile.displayName}</p>
                  <p className="text-xs text-gray-500">{companyProfile.industry}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-lg transition-colors ${
                  showFilters ? 'glass bg-blue-500/10 text-blue-400' : 'glass hover:glass-hover'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
              <button
                onClick={handleExportPDF}
                className="p-2.5 rounded-lg glass hover:glass-hover"
                title="Export PDF Report"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative flex h-[calc(100vh-65px)] z-10">
        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 border-r border-white/5 glass-dark h-full overflow-y-auto scrollbar-thin z-20"
            >
              <FilterPanel
                sentimentData={sentimentData}
                capabilityData={capabilityData}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="relative flex-1 overflow-y-auto scrollbar-thin z-10">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            
            <AnimatePresence mode="wait">
              {/* OVERVIEW */}
              {currentView.type === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <OverviewDashboard
                    companyName={companyProfile.displayName}
                    userName={session?.user?.fullName?.split(' ')[0] || 'there'}
                    sentimentData={sentimentData}
                    capabilityData={capabilityData}
                    onNavigate={(view) => {
                      if (view === 'sentiment') {
                        setCurrentView({ type: 'sentiment_heatmap' })
                      } else {
                        setCurrentView({ type: 'capability_overview' })
                      }
                    }}
                  />
                </motion.div>
              )}

              {/* SENTIMENT HEATMAP */}
              {currentView.type === 'sentiment_heatmap' && (
                <motion.div
                  key="sentiment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button
                    onClick={() => setCurrentView({ type: 'overview' })}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Overview
                  </button>
                  
                  <SentimentHeatmap
                    data={sentimentData}
                    filters={filters}
                    onAnalyzeProblemAreas={(lowestCells) =>
                      setCurrentView({ type: 'sentiment_problem_categories', lowestCells })
                    }
                  />
                </motion.div>
              )}

              {/* PROBLEM CATEGORIES */}
              {currentView.type === 'sentiment_problem_categories' && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ProblemCategoriesView
                    lowestCells={currentView.lowestCells}
                    companyContext={companyProfile}
                    filters={filters}
                    onBack={() => setCurrentView({ type: 'sentiment_heatmap' })}
                    onViewInterventions={(category) =>
                      setCurrentView({ type: 'sentiment_interventions', problemCategory: category })
                    }
                  />
                </motion.div>
              )}

              {/* INTERVENTIONS */}
              {currentView.type === 'sentiment_interventions' && (
                <motion.div
                  key="interventions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <InterventionsView
                    problemCategory={currentView.problemCategory}
                    companyContext={companyProfile}
                    onBack={() =>
                      setCurrentView({
                        type: 'sentiment_problem_categories',
                        lowestCells: [] // Would need to preserve this
                      })
                    }
                  />
                </motion.div>
              )}

              {/* CAPABILITY OVERVIEW */}
              {currentView.type === 'capability_overview' && (
                <motion.div
                  key="capability"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button
                    onClick={() => setCurrentView({ type: 'overview' })}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Overview
                  </button>
                  
                  <CapabilityOverview
                    data={capabilityData}
                    benchmarks={benchmarks}
                    filters={filters}
                    onDimensionClick={(dimensionId) =>
                      setCurrentView({ type: 'capability_dimension', dimensionId })
                    }
                    onViewSummary={() => setCurrentView({ type: 'capability_summary' })}
                  />
                </motion.div>
              )}

              {/* DIMENSION DRILLDOWN */}
              {currentView.type === 'capability_dimension' && (
                <motion.div
                  key="dimension"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Would need to calculate dimension data here */}
                  <div className="text-center py-12">
                    <p className="text-gray-400">Dimension drilldown view (implementing...)</p>
                    <button
                      onClick={() => setCurrentView({ type: 'capability_overview' })}
                      className="btn-secondary mt-4"
                    >
                      Back to Overview
                    </button>
                  </div>
                </motion.div>
              )}

              {/* OPEN-ENDED SUMMARY */}
              {currentView.type === 'capability_summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <OpenEndedSummary
                    openEndedResponses={[]} // TODO: Extract from capability data
                    companyContext={companyProfile}
                    onBack={() => setCurrentView({ type: 'capability_overview' })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

