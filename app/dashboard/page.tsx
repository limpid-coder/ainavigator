'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain,
  Download,
  Filter,
  Target,
  Activity,
  Database,
  Grid3x3,
  Info,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { SentimentResponse, CapabilityResponse, FilterState } from '@/lib/types'
import { calculateReadinessScore } from '@/lib/utils/calculations'
import HeatmapView from '@/components/dashboard/HeatmapView'
import CapabilityView from '@/components/dashboard/CapabilityView'
import FilterPanel from '@/components/dashboard/FilterPanel'
import StatsCards from '@/components/dashboard/StatsCards'
import InterventionModal from '@/components/dashboard/InterventionModal'
import ROIModal from '@/components/dashboard/ROIModal'
import AISummaryPanel from '@/components/dashboard/AISummaryPanel'
import { useAuth } from '@/lib/hooks/useAuth'
import { generatePDF } from '@/lib/utils/pdfExport'

// Loading skeleton component
const DashboardSkeleton = () => (
  <div className="animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass rounded-xl p-6">
          <div className="skeleton h-12 w-12 rounded-lg mb-4" />
          <div className="skeleton h-4 w-24 mb-2" />
          <div className="skeleton h-8 w-32" />
        </div>
      ))}
    </div>
    <div className="glass rounded-xl p-6">
      <div className="skeleton h-96 w-full rounded-lg" />
    </div>
  </div>
)


export default function DashboardPage() {
  const { session, company, isAuthenticated, isLoading: authLoading, logout, requireAuth } = useAuth()
  const [activeView, setActiveView] = useState<'sentiment' | 'capability'>('sentiment')
  const [sentimentData, setSentimentData] = useState<Partial<SentimentResponse>[]>([])
  const [capabilityData, setCapabilityData] = useState<Partial<CapabilityResponse>[]>([])
  const [filters, setFilters] = useState<FilterState>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [dataStatus, setDataStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [showInterventions, setShowInterventions] = useState(false)
  const [showROI, setShowROI] = useState(false)
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)
  const [targetAreas, setTargetAreas] = useState<string[]>([])
  const [targetDimensions, setTargetDimensions] = useState<string[]>([])

  useEffect(() => {
    requireAuth()
  }, [authLoading, isAuthenticated])

  useEffect(() => {
    // Fetch data from Supabase via API
    const loadData = async () => {
      if (!company?.id) return

      setDataStatus('loading')
      
      try {
        const response = await fetch('/api/data/respondents', {
          headers: {
            'x-company-id': company.id,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }

        const result = await response.json()
        
        // Transform data: Include all sentiment scores from CSV
        const transformedSentiment: Partial<SentimentResponse>[] = result.data.map((item: any) => {
          const transformed = {
            id: item.id,
            responseId: item.responseId,
            region: item.region,
            department: item.department,
            role: item.role,
            ageGroup: item.ageGroup,
            timestamp: item.timestamp,
            // Map sentiment scores correctly
            sentiment_1: item.sentimentScores?.sentiment_1,
            sentiment_2: item.sentimentScores?.sentiment_2,
            sentiment_3: item.sentimentScores?.sentiment_3,
            sentiment_4: item.sentimentScores?.sentiment_4,
            sentiment_5: item.sentimentScores?.sentiment_5,
            sentiment_6: item.sentimentScores?.sentiment_6,
            sentiment_7: item.sentimentScores?.sentiment_7,
            sentiment_8: item.sentimentScores?.sentiment_8,
            sentiment_9: item.sentimentScores?.sentiment_9,
            sentiment_10: item.sentimentScores?.sentiment_10,
            sentiment_11: item.sentimentScores?.sentiment_11,
            sentiment_12: item.sentimentScores?.sentiment_12,
            sentiment_13: item.sentimentScores?.sentiment_13,
            sentiment_14: item.sentimentScores?.sentiment_14,
            sentiment_15: item.sentimentScores?.sentiment_15,
            sentiment_16: item.sentimentScores?.sentiment_16,
            sentiment_17: item.sentimentScores?.sentiment_17,
            sentiment_18: item.sentimentScores?.sentiment_18,
            sentiment_19: item.sentimentScores?.sentiment_19,
            sentiment_20: item.sentimentScores?.sentiment_20,
            sentiment_21: item.sentimentScores?.sentiment_21,
            sentiment_22: item.sentimentScores?.sentiment_22,
            sentiment_23: item.sentimentScores?.sentiment_23,
            sentiment_24: item.sentimentScores?.sentiment_24,
            sentiment_25: item.sentimentScores?.sentiment_25
          }
          return transformed
        })

        setSentimentData(transformedSentiment)
        setCapabilityData([]) // Empty for now until we add capability data
        setDataStatus('ready')
      } catch (error) {
        console.error('Error loading data:', error)
        setDataStatus('error')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [company?.id])

  const readinessScore = calculateReadinessScore(
    sentimentData as SentimentResponse[], 
    capabilityData as CapabilityResponse[]
  )

  const stats = {
    totalResponses: sentimentData.length + capabilityData.length,
    readinessScore,
    sentimentAverage: sentimentData.length > 0
      ? (sentimentData.reduce((sum, r) => sum + (r.sentimentLevel || 0), 0) / sentimentData.length).toFixed(1)
      : '0',
    capabilityAverage: '3.2'
  }

  const handleShowInterventions = (areas: string[] = [], dimensions: string[] = []) => {
    setTargetAreas(areas)
    setTargetDimensions(dimensions)
    setShowInterventions(true)
  }

  const handleSelectIntervention = (interventionId: string) => {
    setSelectedIntervention(interventionId)
    setShowInterventions(false)
    setShowROI(true)
  }

  const handleExportPDF = async () => {
    try {
      await generatePDF({
        companyName: company?.display_name || 'Demo Organization',
        sentimentData: sentimentData as SentimentResponse[],
        capabilityData: capabilityData as CapabilityResponse[],
        selectedFlow: activeView,
        selectedIntervention: selectedIntervention || undefined,
        filters
      })
    } catch (error) {
      console.error('PDF export failed:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black overflow-hidden">
        <div className="border-b border-white/5 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <img 
                src="/LeadingwithAI-removebg-preview.png" 
                alt="AI Navigator" 
                className="w-7 h-7 object-contain"
              />
              <span className="font-semibold">AI Navigator</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <DashboardSkeleton />
        </div>
      </div>
    )
  }

  if (dataStatus === 'error') {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
          <p className="text-gray-400 mb-6">Please upload your data or use demo data to get started</p>
          <div className="flex gap-4 justify-center">
            <Link href="/upload">
              <button className="btn-primary">Upload Data</button>
            </Link>
            <Link href="/demo">
              <button className="btn-secondary">Use Demo</button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Subtle gradient background - performance optimized */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0" />
      
      {/* Header */}
      <header className="relative border-b border-white/5 backdrop-blur-xl z-40 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
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
              {company && (
                <div className="hidden md:flex items-center gap-4">
                  <div className="h-6 w-px bg-white/10" />
                  <div>
                    <p className="text-sm font-medium text-white">{company.display_name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Live Dashboard</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-lg transition-colors ${
                  showFilters ? 'glass bg-blue-500/10 text-blue-400' : 'glass hover:glass-hover'
                }`}
              >
                <Filter className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPDF}
                className="p-2.5 rounded-lg glass hover:glass-hover"
                title="Export PDF Report"
              >
                <Download className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2.5 rounded-lg glass hover:glass-hover text-red-400 hover:bg-red-500/10"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
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
          <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <StatsCards stats={stats} />
            </motion.div>

            {/* AI Summary Panel */}
            {(sentimentData.length > 0 || capabilityData.length > 0) && (
              <AISummaryPanel
                sentimentData={sentimentData}
                capabilityData={capabilityData}
                activeView={activeView}
                filters={filters}
              />
            )}

            {/* View Tabs */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView('sentiment')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeView === 'sentiment'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-400/30'
                      : 'glass-dark hover:bg-white/5 text-gray-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Grid3x3 className="w-5 h-5" />
                    Culture Heatmap
                  </span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView('capability')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeView === 'capability'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                      : 'glass-dark hover:bg-white/5 text-gray-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Capability Diamond
                  </span>
                </motion.button>
              </div>

              <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  {stats.totalResponses} records
                </span>
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Processing
                </span>
              </div>
            </div>

            {/* Main Visualization */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {activeView === 'sentiment' ? (
                  <HeatmapView 
                    data={sentimentData} 
                    filters={filters}
                    onShowInterventions={handleShowInterventions}
                  />
                ) : (
                  <CapabilityView 
                    data={capabilityData} 
                    filters={filters}
                    onShowInterventions={handleShowInterventions}
                  />
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </main>
      </div>

      {/* Modals */}
      <InterventionModal
        isOpen={showInterventions}
        onClose={() => setShowInterventions(false)}
        targetAreas={targetAreas}
        targetDimensions={targetDimensions}
        onSelectIntervention={handleSelectIntervention}
      />

      <ROIModal
        isOpen={showROI}
        onClose={() => setShowROI(false)}
        interventionId={selectedIntervention}
        onExportPDF={handleExportPDF}
      />
    </div>
  )
}