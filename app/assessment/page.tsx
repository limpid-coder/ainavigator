'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, Download, Sparkles, Activity, 
  Users, Target, TrendingUp, Layers, ChevronRight,
  Home, BarChart3, Brain, FileText, Settings,
  Maximize2, Minimize2, Grid, Layout, Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { ViewState, FilterState, CompanyProfile } from '@/lib/types/assessment'
import { cn } from '@/lib/utils'
import FilterPanel from '@/components/dashboard/FilterPanel'
import ExecutiveDashboard from '@/components/dashboard/ExecutiveDashboard'
import SentimentHeatmapRevised from '@/components/sentiment/SentimentHeatmapRevised'
import ProblemCategoriesView from '@/components/sentiment/ProblemCategoriesView'
import InterventionsView from '@/components/sentiment/InterventionsView'
import CapabilityAnalysisPro from '@/components/capability/CapabilityAnalysisPro'
import DimensionDrilldown from '@/components/capability/DimensionDrilldown'
import OpenEndedSummary from '@/components/capability/OpenEndedSummary'
import { generatePDF } from '@/lib/utils/pdfExport'
import { SkeletonDashboard } from '@/components/ui/skeleton'

type NavigationView = 'overview' | 'sentiment' | 'capability' | 'recommendations' | 'reports'

export default function AssessmentPage() {
  const { session, company, isAuthenticated, logout } = useAuth()
  
  const [activeView, setActiveView] = useState<NavigationView>('overview')
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'overview' })
  const [sentimentData, setSentimentData] = useState<any[]>([])
  const [capabilityData, setCapabilityData] = useState<any[]>([])
  const [filters, setFilters] = useState<FilterState>({})
  const [showFilters, setShowFilters] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
        </div>
        
        {/* Loading content */}
        <div className="relative z-10 text-center">
          {/* Pulsing logo */}
          <motion.div
            className="relative mb-8 flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center shadow-2xl"
              animate={{
                boxShadow: [
                  "0 0 30px rgba(20, 184, 166, 0.3)",
                  "0 0 60px rgba(167, 79, 139, 0.5)",
                  "0 0 30px rgba(20, 184, 166, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Activity className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading Assessment Data
          </motion.h2>
          
          <motion.p
            className="text-sm text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Preparing {company?.display_name || 'your'} AI readiness analysis...
          </motion.p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-teal-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Navigation items for sidebar
  const navigationItems = [
    { id: 'overview' as NavigationView, icon: BarChart3, label: 'Command Center', description: 'Executive dashboard' },
    { id: 'sentiment' as NavigationView, icon: Users, label: 'Sentiment', description: '25 dimensions' },
    { id: 'capability' as NavigationView, icon: Target, label: 'Capability', description: '8 dimensions' },
    { id: 'recommendations' as NavigationView, icon: Brain, label: 'Recommendations', description: 'AI insights' },
    { id: 'reports' as NavigationView, icon: FileText, label: 'Reports', description: 'Export PDF' },
  ]

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/5 via-transparent to-transparent" />
      </div>

      {/* Main Layout - No Scroll Command Center */}
      <div className="relative z-10 h-full flex">
        
        {/* Navigation Sidebar */}
        <motion.aside
          className="relative flex flex-col bg-black/40 backdrop-blur-xl border-r border-white/5 shadow-2xl hidden md:flex"
          initial={false}
          animate={{ width: sidebarCollapsed ? 64 : 240 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Logo & Company - Aligns with header */}
          <div className={cn(
            "h-14 border-b border-white/5 flex items-center px-4",
            sidebarCollapsed && "justify-center"
          )}>
            <Link href="/" className="flex items-center gap-3 group">
              <motion.img 
                src="/LeadingwithAI-removebg-preview.png" 
                alt="AI Navigator" 
                className={cn("object-contain flex-shrink-0", sidebarCollapsed ? "w-8 h-8" : "w-10 h-10")}
                whileHover={{ scale: 1.1, rotate: 5 }}
              />
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold truncate text-white">{companyProfile.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{companyProfile.industry}</p>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className={cn("flex-1 space-y-1 overflow-y-auto scrollbar-thin", sidebarCollapsed ? "p-2" : "p-3")}>
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id)
                    // Reset to default view for each section
                    if (item.id === 'overview') setCurrentView({ type: 'overview' })
                    else if (item.id === 'sentiment') setCurrentView({ type: 'sentiment_heatmap' })
                    else if (item.id === 'capability') setCurrentView({ type: 'capability_overview' })
                  }}
                  className={cn(
                    "relative w-full flex items-center rounded-xl transition-all group",
                    sidebarCollapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5 gap-3',
                    isActive 
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                  title={sidebarCollapsed ? `${item.label} (${index + 1})` : undefined}
                >
                  {/* Active indicator - fixed positioning */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-teal-400 rounded-r"
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  <Icon className={cn("flex-shrink-0", isActive && 'text-teal-400', sidebarCollapsed ? "w-5 h-5" : "w-4 h-4")} />
                  
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-semibold truncate">{item.label}</p>
                        <span className="px-1 py-0.5 rounded text-[8px] bg-white/5 text-gray-600 font-mono">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">{item.description}</p>
                    </motion.div>
                  )}
                  
                  {isActive && !sidebarCollapsed && (
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className={cn(
            "border-t border-white/5",
            sidebarCollapsed ? "p-2" : "p-3"
          )}>
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "w-full flex items-center rounded-lg transition-all",
                sidebarCollapsed 
                  ? 'justify-center p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'justify-between px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={sidebarCollapsed ? "Expand sidebar (⌘ B)" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Collapse</span>
                  </div>
                  <div className="text-[10px] text-gray-600">⌘ B</div>
                </>
              )}
            </motion.button>
          </div>
        </motion.aside>

        {/* Main Content Area - Fixed Height, No Scroll */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Top Action Bar */}
          <motion.div 
            className="relative flex-shrink-0 h-14 bg-black/20 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 flex items-center justify-between overflow-x-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2 md:gap-3 text-[10px]">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shadow-lg",
                  activeView === 'overview' && "bg-gradient-to-br from-teal-500 to-purple-500 shadow-teal-500/20",
                  activeView === 'sentiment' && "bg-purple-500/20 border border-purple-500/30 shadow-purple-500/20",
                  activeView === 'capability' && "bg-blue-500/20 border border-blue-500/30 shadow-blue-500/20",
                  activeView === 'recommendations' && "bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/20",
                  activeView === 'reports' && "bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/20"
                )}>
                  {(() => {
                    const item = navigationItems.find(item => item.id === activeView)
                    const Icon = item?.icon || BarChart3
                    return <Icon className="w-4 h-4 text-white" />
                  })()}
                </div>
                <div className="hidden sm:block">
                  <div className="font-semibold text-white tracking-wide text-xs">
                    {navigationItems.find(item => item.id === activeView)?.label || 'Command Center'}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    {navigationItems.find(item => item.id === activeView)?.description}
                  </div>
                </div>
              </div>
              <div className="hidden sm:block h-3 w-px bg-white/10" />
              <div className="hidden sm:flex items-center gap-1">
                <Activity className="w-3 h-3 text-teal-400" />
                <span className="text-gray-400 font-medium">{sentimentData.length}</span>
              </div>
              <div className="hidden md:block h-3 w-px bg-white/10" />
              <div className="hidden md:flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-gray-400 font-medium">Live</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Filter button - only show on sentiment/capability views */}
              {(activeView === 'sentiment' || activeView === 'capability') && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    showFilters 
                      ? "bg-teal-500/10 border-teal-500/20 text-teal-400" 
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white"
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium">Filter</span>
                  {Object.keys(filters).length > 0 && (
                    <span className="px-1 py-0.5 rounded text-[8px] bg-teal-400 text-black font-bold">
                      {Object.keys(filters).length}
                    </span>
                  )}
                </button>
              )}
              
              <button
                onClick={handleExportPDF}
                className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[10px] font-medium">Export PDF</span>
              </button>
              
              <button
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Content Viewport - NO SCROLL */}
          <div className="flex-1 relative overflow-hidden">
            {/* Filter Panel Overlay */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="absolute top-0 right-0 w-80 h-full bg-black/60 backdrop-blur-2xl border-l border-white/5 z-50 overflow-y-auto scrollbar-thin"
                  initial={{ x: 320 }}
                  animate={{ x: 0 }}
                  exit={{ x: 320 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                >
                  <FilterPanel
                    sentimentData={sentimentData}
                    capabilityData={capabilityData}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content - Fills viewport perfectly */}
            <div className="h-full p-4">
              <AnimatePresence mode="wait">
                {/* OVERVIEW */}
                {activeView === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ExecutiveDashboard
                      companyName={companyProfile.displayName}
                      userName={session?.user?.fullName?.split(' ')[0] || 'Sarah'}
                      sentimentData={sentimentData}
                      capabilityData={capabilityData}
                      onNavigate={(view) => {
                        if (view === 'sentiment') {
                          setActiveView('sentiment')
                          setCurrentView({ type: 'sentiment_heatmap' })
                        } else {
                          setActiveView('capability')
                          setCurrentView({ type: 'capability_overview' })
                        }
                      }}
                    />
                  </motion.div>
                )}

                {/* SENTIMENT FLOW */}
                {activeView === 'sentiment' && (
                  <AnimatePresence mode="wait">
                    {/* Sentiment Heatmap */}
                    {(currentView.type === 'sentiment_heatmap' || currentView.type === 'overview') && (
                      <motion.div
                        key="sentiment-heatmap"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <SentimentHeatmapRevised
                          data={sentimentData}
                          filters={filters}
                          onAnalyzeProblemAreas={(lowestCells) =>
                            setCurrentView({ type: 'sentiment_problem_categories', lowestCells })
                          }
                        />
                      </motion.div>
                    )}

                    {/* Problem Categories */}
                    {currentView.type === 'sentiment_problem_categories' && (
                      <motion.div
                        key="problem-categories"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-y-auto scrollbar-thin"
                      >
                        <ProblemCategoriesView
                          lowestCells={currentView.lowestCells || []}
                          companyContext={companyProfile}
                          filters={filters}
                          onBack={() => setCurrentView({ type: 'sentiment_heatmap' })}
                          onViewInterventions={(category) =>
                            setCurrentView({ type: 'sentiment_interventions', problemCategory: category })
                          }
                        />
                      </motion.div>
                    )}

                    {/* Interventions */}
                    {currentView.type === 'sentiment_interventions' && (
                      <motion.div
                        key="interventions"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-y-auto scrollbar-thin"
                      >
                        <InterventionsView
                          problemCategory={currentView.problemCategory!}
                          companyContext={companyProfile}
                          onBack={() => setCurrentView({ type: 'sentiment_problem_categories', lowestCells: [] })}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* CAPABILITY FLOW */}
                {activeView === 'capability' && (
                  <AnimatePresence mode="wait">
                    {/* Capability Overview */}
                    {(currentView.type === 'capability_overview' || currentView.type === 'overview') && (
                      <motion.div
                        key="capability-overview"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <CapabilityAnalysisPro
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

                    {/* Dimension Drilldown */}
                    {currentView.type === 'capability_dimension' && currentView.dimensionId && (
                      <motion.div
                        key="dimension-drilldown"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-y-auto scrollbar-thin"
                      >
                        <DimensionDrilldown
                          dimensionId={currentView.dimensionId}
                          data={capabilityData}
                          benchmark={benchmarks[currentView.dimensionId] || 5.0}
                          filters={filters}
                          onBack={() => setCurrentView({ type: 'capability_overview' })}
                        />
                      </motion.div>
                    )}

                    {/* Open-Ended Summary */}
                    {currentView.type === 'capability_summary' && (
                      <motion.div
                        key="open-ended-summary"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full overflow-y-auto scrollbar-thin"
                      >
                        <OpenEndedSummary
                          openEndedResponses={[]} 
                          companyContext={companyProfile}
                          onBack={() => setCurrentView({ type: 'capability_overview' })}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                {/* RECOMMENDATIONS */}
                {activeView === 'recommendations' && (
                  <motion.div
                    key="recommendations"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Brain className="w-16 h-16 text-teal-400 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">AI Recommendations</h2>
                      <p className="text-gray-400">Actionable interventions coming soon</p>
                    </div>
                  </motion.div>
                )}

                {/* REPORTS */}
                {activeView === 'reports' && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full flex items-center justify-center"
                  >
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Reports</h2>
                      <p className="text-gray-400">Export and share capabilities</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
