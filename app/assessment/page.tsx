'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter, Download, Activity,
  Users, Target, ChevronRight,
  BarChart3, Brain, FileText, Settings,
  Maximize2, Minimize2, Bot, Search, Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { useStore } from '@/lib/store'
import { SimpleThemeToggle } from '@/components/ui/simple-theme-toggle'
import { EnhancedTooltip } from '@/components/ui/enhanced-tooltip'
import { ContextualHelp } from '@/components/ui/contextual-help'
import { OnboardingHint } from '@/components/ui/onboarding-hint'
import { CommandPalette } from '@/components/ui/command-palette'
import { QuickActionsMenu } from '@/components/ui/quick-actions-menu'
import { DataComparisonMode } from '@/components/ui/data-comparison-mode'
import { KeyboardShortcutsHelp } from '@/components/ui/keyboard-shortcuts-help'
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation'
import { toast } from 'react-hot-toast'
import { EasterEggAchievement, useAchievements } from '@/components/ui/easter-egg-achievement'
import { QuirkyLoadingMessage } from '@/components/ui/loading-messages'
import { useFunInteractions } from '@/hooks/use-fun-interactions'
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
import RecommendationsView from '@/components/recommendations/RecommendationsView'
import ReportsView from '@/components/reports/ReportsView'
import AIAgentView from '@/components/ai-agent/AIAgentView'
import InterventionsBrowsePage from '@/components/interventions/InterventionsBrowsePage'
import { generatePDF } from '@/lib/utils/pdfExport'
// Skeleton component imported but not actively used in current view
// import { SkeletonDashboard } from '@/components/ui/skeleton'

type NavigationView = 'overview' | 'sentiment' | 'capability' | 'interventions' | 'recommendations' | 'reports' | 'ai-agent'

export default function AssessmentPage() {
  const { session, company } = useAuth()
  
  const [activeView, setActiveView] = useState<NavigationView>('ai-agent')
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'overview' })
  const setStoreActiveView = useStore((state) => state.setActiveView)
  
  // Sync activeView with store so floating chat knows when to hide
  useEffect(() => {
    setStoreActiveView(activeView)
  }, [activeView, setStoreActiveView])
  const [sentimentData, setSentimentData] = useState<any[]>([])
  const [capabilityData, setCapabilityData] = useState<any[]>([])
  const [filters, setFilters] = useState<FilterState>({})
  const [showFilters, setShowFilters] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [selectedWave, setSelectedWave] = useState<string | undefined>(undefined)
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set())
  const [keyboardShortcutCount, setKeyboardShortcutCount] = useState(0)
  const { achievementToShow, unlock, dismiss } = useAchievements()

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

  // Reload data when selectedWave changes (temporal filtering)
  useEffect(() => {
    if (company?.id && selectedWave !== undefined) {
      loadData(selectedWave)
    }
  }, [selectedWave])

  useEffect(() => {
    // Show onboarding hint for first-time users
    const hasSeenOnboarding = localStorage.getItem('assessment-onboarding-seen')
    if (!hasSeenOnboarding && !isLoading) {
      setTimeout(() => {
        setShowOnboarding(true)
      }, 1500)
    }
  }, [isLoading])

  // PDF Export handler (defined here to avoid hoisting issues)
  const handleExportPDF = async () => {
    try {
      // Show loading notification
      console.log('Generating PDF report...')
      
      // Prepare data for PDF
      const pdfData = {
        companyName: companyProfile.displayName,
        assessment: {
          date: new Date().toLocaleDateString(),
          respondents: sentimentData?.length || 0,
          readinessScore: 62, // Calculate from actual data
          sentimentAverage: 3.2, // Default value
          capabilityMaturity: 4.1 // Default value
        },
        sentimentData: sentimentData.length > 0 ? {
          heatmap: {},
          problemCategories: [],
          lowestCells: []
        } : undefined,
        capabilityData: capabilityData.length > 0 ? {
          dimensions: [],
          weakestDimensions: [],
          benchmarkComparison: {}
        } : undefined,
        interventions: [
          {
            title: 'AI Transparency Program',
            description: 'Implement clear communication protocols and explainable AI practices to build trust.',
            investmentRange: '$150K-$350K',
            expectedROI: '30-50%',
            timeline: '12 weeks'
          },
          {
            title: 'Data Infrastructure Modernization',
            description: 'Upgrade data systems to enable AI readiness and improve data accessibility.',
            investmentRange: '$250K-$500K',
            expectedROI: '40-60%',
            timeline: '16 weeks'
          },
          {
            title: 'Human-in-the-Loop Design',
            description: 'Balance AI automation with human oversight to address autonomy concerns.',
            investmentRange: '$80K-$200K',
            expectedROI: '25-35%',
            timeline: '8 weeks'
          }
        ],
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        selectedFlow: (currentView.type.includes('sentiment') ? 'sentiment' : 
                      currentView.type.includes('capability') ? 'capability' : 'both') as 'sentiment' | 'capability' | 'both'
      }

      await generatePDF(pdfData)
      
      // Success notification
      console.log('PDF generated successfully!')
      toast.success('PDF report downloaded successfully!')
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.error('Failed to generate PDF report. Please try again.')
    }
  }

  // Keyboard navigation with achievement tracking
  useKeyboardNavigation({
    onCommandPalette: () => {
      setShowCommandPalette(true)
      setKeyboardShortcutCount(prev => {
        const newCount = prev + 1
        if (newCount === 1) {
          unlock('power-user')
        }
        return newCount
      })
    },
    onToggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed),
    onToggleFilters: () => setShowFilters(!showFilters),
    onExport: handleExportPDF,
    onHelp: () => setShowKeyboardHelp(true),
    onNavigate: (view) => {
      setActiveView(view as NavigationView)
      if (view === 'overview') setCurrentView({ type: 'overview' })
      else if (view === 'sentiment') setCurrentView({ type: 'sentiment_heatmap' })
      else if (view === 'capability') setCurrentView({ type: 'capability_overview' })
      else if (view === 'interventions') setCurrentView({ type: 'overview' })

      // Track keyboard navigation
      setKeyboardShortcutCount(prev => {
        const newCount = prev + 1
        if (newCount >= 5) {
          unlock('speed-demon')
        }
        return newCount
      })
    }
  })

  // Fun interactions
  useFunInteractions({
    onKonamiCode: () => {
      toast.success('🎮 Konami Code! You found our secret! Here\'s some confetti! 🎉')
      unlock('secret-finder')
    },
    onTripleClick: () => {
      toast('👆 Someone\'s clicking enthusiastically! We like your energy!')
    }
  })

  // Track section visits for explorer achievement
  useEffect(() => {
    setVisitedSections(prev => {
      const newSet = new Set(prev)
      if (!newSet.has(activeView)) {
        newSet.add(activeView)
        
        if (newSet.size >= 5) {
          unlock('explorer')
        }
        
        return newSet
      }
      return prev // Don't update if already visited
    })
  }, [activeView, unlock])

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'export':
        handleExportPDF()
        toast.success('Exporting PDF report...')
        break
      case 'share':
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
        break
      case 'bookmark':
        toast.success('View bookmarked!')
        break
      case 'copy':
        navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied!')
        break
      case 'refresh':
        loadData()
        toast.success('Refreshing data...')
        break
      case 'toggle-filters':
        setShowFilters(!showFilters)
        break
      case 'settings':
        toast('Settings coming soon!')
        break
      case 'help':
        setShowKeyboardHelp(true)
        break
    }
  }

  const loadData = async (wave?: string) => {
    if (!company?.id) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Build query params for temporal filtering
      const queryParams = wave ? `?survey_wave=${encodeURIComponent(wave)}` : ''

      // Load sentiment data
      const sentimentResponse = await fetch(`/api/data/respondents${queryParams}`, {
        headers: {
          'x-company-id': company.id
        }
      })

      if (!sentimentResponse.ok) throw new Error('Failed to load sentiment data')

      const sentimentResult = await sentimentResponse.json()
      setSentimentData(sentimentResult.data)

      // Load capability data from API
      const capabilityResponse = await fetch(`/api/data/capability${queryParams}`, {
        headers: {
          'x-company-id': company.id
        }
      })

      if (capabilityResponse.ok) {
        const capabilityResult = await capabilityResponse.json()
        setCapabilityData(capabilityResult.data)
      } else {
        console.warn('Failed to load capability data, using empty array')
        setCapabilityData([])
      }
    } catch (error) {
      console.error('Data load error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:bg-black flex items-center justify-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-gray-950 dark:via-black dark:to-gray-950 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400/10 via-blue-400/5 dark:from-teal-900/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-400/10 via-pink-400/5 dark:from-purple-900/10 to-transparent" />
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
            className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading Assessment Data
          </motion.h2>
          
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <QuirkyLoadingMessage />
          </motion.div>

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

  // Navigation items for sidebar with tooltips
  const navigationItems = [
    { 
      id: 'ai-agent' as NavigationView, 
      icon: Bot, 
      label: 'AI Agent', 
      description: 'Chat Interface',
      tooltip: 'Your intelligent AI assistant - ask questions, get insights, and navigate your AI readiness data through natural conversation.'
    },
    { 
      id: 'overview' as NavigationView, 
      icon: BarChart3, 
      label: 'Command Center', 
      description: 'Executive dashboard',
      tooltip: 'Your AI readiness at a glance - see high-level insights and key metrics across all dimensions.'
    },
    { 
      id: 'sentiment' as NavigationView, 
      icon: Users, 
      label: 'Sentiment', 
      description: '25 dimensions',
      tooltip: 'Deep dive into employee sentiment across 25 key dimensions to identify engagement patterns and concerns.'
    },
    {
      id: 'capability' as NavigationView,
      icon: Target,
      label: 'Capability',
      description: '8 dimensions',
      tooltip: 'Assess organizational AI capabilities across 8 strategic dimensions and compare against industry benchmarks.'
    },
    {
      id: 'interventions' as NavigationView,
      icon: Lightbulb,
      label: 'Interventions',
      description: 'Browse catalog',
      tooltip: 'Explore the complete catalogue of interventions to improve your AI readiness across all dimensions.'
    },
    {
      id: 'recommendations' as NavigationView,
      icon: Brain,
      label: 'Recommendations',
      description: 'AI insights',
      tooltip: 'Get AI-powered recommendations tailored to your organization\'s specific needs and gaps.'
    },
    { 
      id: 'reports' as NavigationView, 
      icon: FileText, 
      label: 'Reports', 
      description: 'Export PDF',
      tooltip: 'Generate comprehensive reports to share insights with stakeholders and track progress over time.'
    },
  ]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:bg-black overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-gray-950 dark:via-black dark:to-gray-950 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-400/8 via-blue-400/4 dark:from-teal-900/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/8 via-pink-400/4 dark:from-purple-900/5 to-transparent" />
        
        {/* Playful floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply dark:mix-blend-screen"
              style={{
                width: 100 + Math.random() * 200,
                height: 100 + Math.random() * 200,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 
                  ? 'radial-gradient(circle, rgba(20, 184, 166, 0.15), transparent)'
                  : i % 3 === 1
                  ? 'radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent)'
                  : 'radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent)',
                filter: 'blur(40px)',
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Layout - No Scroll Command Center */}
      <div className="relative z-10 h-full flex">
        
        {/* Navigation Sidebar */}
        <motion.aside
          className="relative flex flex-col bg-white/95 dark:bg-black/40 backdrop-blur-2xl border-r border-slate-200/60 dark:border-white/[0.08] hidden md:flex"
          initial={false}
          animate={{ width: sidebarCollapsed ? 64 : 240 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Logo & Company - Aligns with header */}
          <div className={cn(
            "h-14 border-b border-slate-200/60 dark:border-white/[0.08] flex items-center px-4",
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
                  <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{companyProfile.displayName}</p>
                  <p className="text-xs text-slate-600 dark:text-gray-500 truncate">{companyProfile.industry}</p>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className={cn("flex-1 space-y-1 overflow-y-auto scrollbar-thin", sidebarCollapsed ? "p-2" : "p-3")}>
            {navigationItems.map((item, index) => {
              const Icon = item.icon
              const isActive = activeView === item.id
              
              const button = (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id)
                    // Reset to default view for each section
                    if (item.id === 'overview') setCurrentView({ type: 'overview' })
                    else if (item.id === 'sentiment') setCurrentView({ type: 'sentiment_heatmap' })
                    else if (item.id === 'capability') setCurrentView({ type: 'capability_overview' })
                    // AI Agent doesn't need a currentView, it's handled by activeView
                  }}
                  className={cn(
                    "relative w-full flex items-center rounded-xl transition-all group",
                    sidebarCollapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5 gap-3',
                    isActive 
                      ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400'
                      : 'text-slate-700 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5'
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Active indicator - fixed positioning */}
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r"
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  <Icon className={cn("flex-shrink-0", isActive && 'text-teal-600 dark:text-teal-400', sidebarCollapsed ? "w-5 h-5" : "w-4 h-4")} />
                  
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 text-left min-w-0"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-semibold truncate">{item.label}</p>
                        <span className="px-1 py-0.5 rounded text-[8px] bg-slate-200/70 dark:bg-white/5 text-slate-700 dark:text-gray-600 font-mono">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-gray-500 truncate">{item.description}</p>
                    </motion.div>
                  )}
                  
                  {isActive && !sidebarCollapsed && (
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                  )}
                </motion.button>
              )

              return sidebarCollapsed ? (
                <EnhancedTooltip
                  key={item.id}
                  content={item.tooltip}
                  title={item.label}
                  icon="info"
                  position="right"
                >
                  {button}
                </EnhancedTooltip>
              ) : button
            })}
          </nav>

          {/* Bottom Actions */}
          <div className={cn(
            "border-t border-slate-200/60 dark:border-white/[0.08]",
            sidebarCollapsed ? "p-2" : "p-3"
          )}>
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={cn(
                "w-full flex items-center rounded-lg transition-all",
                sidebarCollapsed 
                  ? 'justify-center p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                  : 'justify-between px-3 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
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
                  <div className="text-[10px] text-slate-500 dark:text-gray-600">⌘ B</div>
                </>
              )}
            </motion.button>
          </div>
        </motion.aside>

        {/* Main Content Area - Fixed Height, No Scroll */}
        <div className="flex-1 flex flex-col h-full overflow-hidden pb-20 md:pb-0">
          
          {/* Top Action Bar */}
          <motion.div 
            className="relative flex-shrink-0 h-14 bg-white/95 dark:bg-black/20 backdrop-blur-2xl border-b border-slate-200/60 dark:border-white/[0.08] px-4 md:px-6 flex items-center justify-between overflow-x-auto"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center gap-2 md:gap-3 text-[10px]">
              <div className="flex items-center gap-2">
                <motion.div 
                  className={cn(
                    "w-7 h-7 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden",
                    activeView === 'overview' && "bg-gradient-to-br from-teal-500 to-purple-500",
                    activeView === 'sentiment' && "bg-gradient-to-br from-purple-500 to-pink-500",
                    activeView === 'capability' && "bg-gradient-to-br from-blue-500 to-cyan-500",
                    activeView === 'recommendations' && "bg-gradient-to-br from-purple-500 to-indigo-500",
                    activeView === 'reports' && "bg-gradient-to-br from-blue-500 to-purple-500"
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: 'linear',
                    }}
                  />
                  {(() => {
                    const item = navigationItems.find(item => item.id === activeView)
                    const Icon = item?.icon || BarChart3
                    return <Icon className="w-4 h-4 text-white relative z-10" />
                  })()}
                </motion.div>
                <div className="hidden sm:block">
                  <div className="font-semibold text-slate-900 dark:text-white tracking-wide text-xs">
                    {navigationItems.find(item => item.id === activeView)?.label || 'Command Center'}
                  </div>
                  <div className="text-[9px] text-slate-600 dark:text-gray-500">
                    {navigationItems.find(item => item.id === activeView)?.description}
                  </div>
                </div>
              </div>
              <div className="hidden sm:block h-3 w-px bg-slate-300 dark:bg-white/10" />
              <EnhancedTooltip
                content="Total number of respondents in your assessment dataset"
                icon="info"
                position="bottom"
              >
                <div className="hidden sm:flex items-center gap-1 cursor-help">
                  <Activity className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span className="text-slate-700 dark:text-gray-400 font-semibold">{sentimentData.length}</span>
                </div>
              </EnhancedTooltip>
              <div className="hidden md:block h-3 w-px bg-slate-300 dark:bg-white/10" />
              <EnhancedTooltip
                content="Your data is synced and up-to-date"
                icon="sparkle"
                position="bottom"
              >
                <div className="hidden md:flex items-center gap-1 cursor-help">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                  <span className="text-slate-700 dark:text-gray-400 font-semibold">Live</span>
                </div>
              </EnhancedTooltip>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Actions */}
              <QuickActionsMenu
                onExport={handleExportPDF}
                onShare={() => handleQuickAction('share')}
                onBookmark={() => handleQuickAction('bookmark')}
                onCopy={() => handleQuickAction('copy')}
                onRefresh={() => handleQuickAction('refresh')}
                onFullscreen={() => toast('Fullscreen mode coming soon!')}
              />

              <div className="w-px h-6 bg-slate-300 dark:bg-white/10" />

              {/* Filter button - only show on sentiment/capability views */}
              {(activeView === 'sentiment' || activeView === 'capability') && (
                <EnhancedTooltip
                  content="Filter data by region, department, demographics, and more to drill into specific segments"
                  title="Advanced Filters"
                  icon="tip"
                  position="bottom"
                >
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      showFilters 
                        ? "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400" 
                        : "bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium">Filter</span>
                    {Object.keys(filters).length > 0 && (
                      <span className="px-1 py-0.5 rounded text-[8px] bg-teal-500 text-white font-bold">
                        {Object.keys(filters).length}
                      </span>
                    )}
                  </button>
                </EnhancedTooltip>
              )}
              
              <EnhancedTooltip
                content="Export a comprehensive PDF report of your current view with all insights and visualizations"
                title="Export Report"
                icon="tip"
                position="bottom"
              >
                <button
                  onClick={handleExportPDF}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-slate-700 dark:text-gray-300"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium">Export PDF</span>
                </button>
              </EnhancedTooltip>

              {/* Theme Toggle */}
              {/* Search Bar */}
              <div className="relative flex-1 max-w-xs hidden lg:block">
                <button
                  onClick={() => setShowCommandPalette(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 transition-colors text-left group"
                >
                  <Search className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                  <span className="text-sm text-slate-500 dark:text-gray-500 flex-1">Quick search...</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-xs text-slate-600 dark:text-gray-400 font-mono">⌘K</kbd>
                </button>
              </div>

              <div className="w-px h-6 bg-slate-300 dark:bg-white/10 hidden lg:block" />

              <EnhancedTooltip
                content="Switch between light and dark themes"
                position="bottom"
              >
                <SimpleThemeToggle />
              </EnhancedTooltip>

              {/* Help */}
              <ContextualHelp
                title="Need Help?"
                description="Learn how to navigate your AI readiness assessment and get the most from your insights."
                articles={[
                  {
                    title: 'Understanding Your Dashboard',
                    description: 'Navigate the command center and key metrics',
                    link: '#'
                  },
                  {
                    title: 'Using Filters Effectively',
                    description: 'Segment your data for deeper insights',
                    link: '#'
                  },
                  {
                    title: 'Interpreting Benchmarks',
                    description: 'Compare against industry standards',
                    link: '#'
                  },
                  {
                    title: 'Exporting Reports',
                    description: 'Share insights with stakeholders',
                    link: '#'
                  }
                ]}
              />
              
              <EnhancedTooltip
                content="Customize your assessment preferences and notification settings"
                icon="info"
                position="bottom"
              >
                <button
                  className="p-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-gray-300"
                  title="Settings"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </EnhancedTooltip>
            </div>
          </motion.div>

          {/* Content Viewport - NO SCROLL */}
          <div className="flex-1 relative overflow-hidden">
            {/* Filter Panel Overlay */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="absolute top-0 right-0 w-80 h-full bg-white/98 dark:bg-black/60 backdrop-blur-2xl border-l border-slate-200/60 dark:border-white/[0.08] z-50 overflow-y-auto scrollbar-thin"
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
                    selectedWave={selectedWave}
                    onWaveChange={setSelectedWave}
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
                      benchmarks={benchmarks}
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

                {/* INTERVENTIONS */}
                {activeView === 'interventions' && (
                  <motion.div
                    key="interventions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <InterventionsBrowsePage />
                  </motion.div>
                )}

                {/* RECOMMENDATIONS */}
                {activeView === 'recommendations' && (
                  <motion.div
                    key="recommendations"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <RecommendationsView
                      sentimentData={sentimentData}
                      capabilityData={capabilityData}
                      companyName={companyProfile.displayName}
                    />
                  </motion.div>
                )}

                {/* REPORTS */}
                {activeView === 'reports' && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ReportsView
                      companyName={companyProfile.displayName}
                      onExportPDF={handleExportPDF}
                    />
                  </motion.div>
                )}

                {/* AI AGENT */}
                {activeView === 'ai-agent' && (
                  <motion.div
                    key="ai-agent"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <AIAgentView
                      sentimentData={sentimentData}
                      capabilityData={capabilityData}
                      filters={filters}
                      setFilters={setFilters}
                      companyName={companyProfile.displayName}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(view) => {
          setActiveView(view as NavigationView)
          if (view === 'overview') setCurrentView({ type: 'overview' })
          else if (view === 'sentiment') setCurrentView({ type: 'sentiment_heatmap' })
          else if (view === 'capability') setCurrentView({ type: 'capability_overview' })
          else if (view === 'interventions') setCurrentView({ type: 'overview' })
        }}
        onAction={handleQuickAction}
      />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
      />

      {/* Data Comparison Mode */}
      <DataComparisonMode
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        onCompare={(config) => {
          console.log('Comparison config:', config)
          toast.success('Comparison mode activated!')
        }}
      />

      {/* Onboarding Hint */}
      {showOnboarding && (
        <OnboardingHint
          id="assessment-welcome"
          title="Welcome to Your AI Readiness Assessment! 🎉"
          description="Navigate through different views using the sidebar. Press ⌘K for quick search, or hover over any element for helpful tips. Use keyboard shortcuts (1-5) for instant navigation!"
          onDismiss={() => {
            setShowOnboarding(false)
            localStorage.setItem('assessment-onboarding-seen', 'true')
          }}
          autoShow={false}
        />
      )}

      {/* Achievements */}
      <EasterEggAchievement
        achievementId={achievementToShow}
        onDismiss={dismiss}
      />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-t border-slate-200/60 dark:border-white/[0.08] safe-area-inset-bottom overflow-x-auto">
        <div className="grid grid-cols-7 gap-0 min-w-max">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id)
                  if (item.id === 'overview') setCurrentView({ type: 'overview' })
                  else if (item.id === 'sentiment') setCurrentView({ type: 'sentiment_heatmap' })
                  else if (item.id === 'capability') setCurrentView({ type: 'capability_overview' })
                  else if (item.id === 'interventions') setCurrentView({ type: 'overview' })
                  else if (item.id === 'recommendations') setCurrentView({ type: 'recommendations_combined' })
                  else if (item.id === 'reports') setCurrentView({ type: 'recommendations_combined' })
                  else if (item.id === 'ai-agent') setCurrentView({ type: 'overview' })
                }}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 min-h-[64px] transition-all relative",
                  isActive
                    ? "text-teal-600 dark:text-teal-400"
                    : "text-slate-600 dark:text-gray-400 active:scale-95"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-teal-500 to-purple-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 mb-1", isActive && "scale-110")} />
                <span className={cn(
                  "text-[10px] font-medium leading-tight text-center",
                  isActive && "font-semibold"
                )}>
                  {item.label === 'Command Center' ? 'Dashboard' : item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
