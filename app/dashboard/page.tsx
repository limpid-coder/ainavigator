'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain,
  Home,
  Download,
  Filter,
  BarChart3,
  Target,
  Activity,
  Database,
  Settings,
  Grid3x3,
  ChevronRight,
  Sparkles,
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
import { useAuth } from '@/lib/hooks/useAuth'

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

// Quick action card
const QuickAction = ({ icon, title, description, onClick, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -2 }}
    onClick={onClick}
    className="card-interactive group"
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-lg glass group-hover:bg-white/5 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors mt-3" />
    </div>
  </motion.div>
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
        const transformedSentiment: Partial<SentimentResponse>[] = result.data.map((item: any) => ({
          id: item.id,
          responseId: item.responseId,
          region: item.region,
          department: item.department,
          role: item.role,
          ageGroup: item.ageGroup,
          timestamp: item.timestamp,
          // Include all 25 sentiment scores
          ...item.sentimentScores
        }))

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="border-b border-white/5 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-400" />
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
      <div className="min-h-screen bg-black flex items-center justify-center">
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
    <div className="min-h-screen bg-black">
      {/* Subtle background */}
      <div className="fixed inset-0 data-grid opacity-[0.02] pointer-events-none" />
      
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-400" />
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
                className="p-2.5 rounded-lg glass hover:glass-hover"
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

      <div className="flex">
        {/* Filter Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-80 border-r border-white/5 glass h-[calc(100vh-65px)] overflow-y-auto scrollbar-thin"
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
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <StatsCards stats={stats} />
            </motion.div>

            {/* View Tabs */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView('sentiment')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeView === 'sentiment'
                      ? 'gradient-primary text-white glow-sm'
                      : 'glass hover:glass-hover text-gray-400'
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
                      ? 'gradient-secondary text-white glow-sm'
                      : 'glass hover:glass-hover text-gray-400'
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
                  />
                ) : (
                  <CapabilityView 
                    data={capabilityData} 
                    filters={filters}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Quick Actions */}
            <div className="mt-12 space-y-4">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <QuickAction
                  icon={<Sparkles className="w-5 h-5 text-amber-400" />}
                  title="View Recommendations"
                  description="Get AI-powered interventions based on your data"
                  delay={0.1}
                />
                <QuickAction
                  icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                  title="Deep Analysis"
                  description="Explore detailed insights and correlations"
                  delay={0.2}
                />
                <QuickAction
                  icon={<Download className="w-5 h-5 text-green-400" />}
                  title="Export Report"
                  description="Generate comprehensive PDF summary"
                  delay={0.3}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}