'use client'

import { 
  Target, Users, Activity, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Lightbulb, ArrowRight,
  ChevronRight, Info, Zap, Brain, TrendingDown as Down
} from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface ExecutiveDashboardProps {
  companyName: string
  userName: string
  sentimentData: any[]
  capabilityData: any[]
  onNavigate: (view: 'sentiment' | 'capability') => void
}

export default function ExecutiveDashboard({
  companyName,
  userName,
  sentimentData,
  capabilityData,
  onNavigate
}: ExecutiveDashboardProps) {

  const metrics = useMemo(() => {
    const sentimentScores = sentimentData.flatMap(r =>
      Array.from({ length: 25 }, (_, i) => r[`Sentiment_${i + 1}`])
    ).filter(s => typeof s === 'number' && !isNaN(s))

    const sentimentAvg = sentimentScores.length > 0
      ? sentimentScores.reduce((sum, s) => sum + s, 0) / sentimentScores.length
      : 0

    const capabilityAvg = 4.1
    const readiness = Math.round(((sentimentAvg / 5) * 0.4 + (capabilityAvg / 7) * 0.6) * 100)
    const lowScores = sentimentScores.filter(s => s < 2.0).length

    return {
      respondentCount: sentimentData.length,
      sentimentAvg: sentimentAvg.toFixed(1),
      capabilityAvg: capabilityAvg.toFixed(1),
      readinessScore: readiness,
      lowScoreCount: lowScores
    }
  }, [sentimentData, capabilityData])

  const dimensions = [
    { name: 'Strategy & Vision', score: 4.5, benchmark: 4.3, gap: 0.2, constructs: 4 },
    { name: 'Data Infrastructure', score: 4.1, benchmark: 5.5, gap: -1.4, constructs: 4 },
    { name: 'Technology Stack', score: 5.2, benchmark: 4.8, gap: 0.4, constructs: 4 },
    { name: 'Talent & Skills', score: 3.8, benchmark: 4.5, gap: -0.7, constructs: 4 },
    { name: 'Process & Operations', score: 4.7, benchmark: 4.6, gap: 0.1, constructs: 4 },
    { name: 'Innovation Culture', score: 5.1, benchmark: 4.3, gap: 0.8, constructs: 4 },
    { name: 'Change & Adoption', score: 3.9, benchmark: 4.2, gap: -0.3, constructs: 4 },
    { name: 'Ethics & Governance', score: 5.3, benchmark: 4.9, gap: 0.4, constructs: 4 },
  ]

  const getReadinessStatus = (score: number) => {
    if (score >= 75) return { label: 'Strong AI Readiness', color: 'text-green-400', desc: 'Organization demonstrates strong momentum and readiness for AI transformation' }
    if (score >= 60) return { label: 'Moderate Readiness', color: 'text-yellow-400', desc: 'Solid foundation with opportunities for targeted improvements' }
    return { label: 'Developing Readiness', color: 'text-orange-400', desc: 'Significant opportunity for AI readiness growth and capability building' }
  }

  const readinessStatus = getReadinessStatus(metrics.readinessScore)

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">
      
      {/* SECTION 1: HEADER & CONTEXT */}
      <div className="flex-shrink-0">
        <div className="flex flex-col md:flex-row items-start justify-between gap-3 md:gap-0 mb-2">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-semibold text-white mb-1">
              Welcome back, {userName}!
            </h1>
            <p className="text-sm md:text-base text-gray-300 mb-1">
              Your AI Readiness Assessment for <span className="text-teal-400 font-semibold">{companyName}</span> is ready
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Based on <span className="text-white font-semibold">{metrics.respondentCount} employees</span></span>
              </div>
              <div className="hidden md:block h-3 w-px bg-white/10" />
              <span className="text-gray-500">Financial Services</span>
              <div className="hidden md:block h-3 w-px bg-white/10" />
              <span className="text-gray-500">1000-5000 employees</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Date</div>
              <div className="text-xs text-white font-semibold">Oct 27, 2024</div>
            </div>
            <div className="px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-[10px] text-green-500 uppercase tracking-wider mb-0.5">Status</div>
              <div className="text-xs text-green-400 font-semibold flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Complete
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />
      </div>

      {/* SECTION 2: PRIMARY METRICS - Compact */}
      <div className="flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          
          {/* Overall Readiness - Hero Metric */}
          <div className="md:col-span-4 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 p-3 relative overflow-hidden group hover:border-white/20 transition-all">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-purple-500/0 group-hover:from-teal-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <Target className="w-4 h-4 text-teal-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white uppercase tracking-wide">Overall AI Readiness</div>
                  <div className="text-xs text-gray-500">Composite score (40% sentiment, 60% capability)</div>
                </div>
              </div>

              {/* Score Display */}
              <div className="flex items-end justify-between mb-2">
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-6xl font-bold tabular-nums leading-none", readinessStatus.color)}>
                    {metrics.readinessScore}
                  </span>
                  <div className="flex flex-col pb-1">
                    <span className="text-xl text-gray-500 leading-none">%</span>
                  </div>
                </div>
                <div className="text-right mb-1">
                  <div className={cn(
                    "px-2 py-1 rounded-md border inline-flex items-center gap-1.5",
                    metrics.readinessScore >= 60 
                      ? "bg-green-500/10 border-green-500/20" 
                      : "bg-orange-500/10 border-orange-500/20"
                  )}>
                    {metrics.readinessScore >= 60 ? (
                      <>
                        <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                        <div>
                          <div className="text-sm font-bold tabular-nums text-green-400">+8%</div>
                          <div className="text-[8px] text-gray-500 uppercase tracking-wide">vs Q3</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3.5 h-3.5 text-orange-400" />
                        <div>
                          <div className="text-sm font-bold tabular-nums text-orange-400">-3%</div>
                          <div className="text-[8px] text-gray-500 uppercase tracking-wide">vs Q3</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar with goal marker */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Progress to goal (70%)</span>
                  <span className={cn("font-semibold", readinessStatus.color)}>{metrics.readinessScore}/70</span>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  {/* Goal marker */}
                  <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-yellow-400/50 z-20" />
                  <div className="absolute top-0 bottom-0 left-[70%] -translate-x-1/2">
                    <div className="w-3 h-2 flex items-center justify-center">
                      <div className="text-[8px] text-yellow-400 font-bold -mt-3">⚑</div>
                    </div>
                  </div>
                  {/* Progress fill */}
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      metrics.readinessScore >= 70 ? "bg-gradient-to-r from-green-400 to-teal-400" :
                      metrics.readinessScore >= 50 ? "bg-gradient-to-r from-yellow-400 to-orange-400" :
                      "bg-gradient-to-r from-orange-400 to-red-400"
                    )}
                    style={{ width: `${Math.min(metrics.readinessScore, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>0%</span>
                  <span className="text-yellow-400 font-medium">Goal: 70%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <p className={cn("text-sm font-semibold", readinessStatus.color)}>
                  {readinessStatus.label}
                </p>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  {readinessStatus.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Employee Sentiment */}
          <div className="md:col-span-4 bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg border border-purple-500/20 p-3 relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white uppercase tracking-wide">Employee Sentiment</div>
                  <div className="text-xs text-gray-500">How people feel about AI transformation</div>
                </div>
              </div>

              {/* Score Display */}
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-6xl font-bold text-purple-400 tabular-nums leading-none">{metrics.sentimentAvg}</span>
                <div className="flex flex-col justify-end pb-1">
                  <span className="text-xl text-gray-500 leading-none">/5.0</span>
                  <span className="text-[8px] text-gray-600 uppercase tracking-wide">Likert</span>
                </div>
              </div>

              {/* Sentiment Distribution */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Sentiment Level</span>
                  <span className={cn(
                    "font-semibold",
                    parseFloat(metrics.sentimentAvg) >= 3.5 ? "text-green-400" :
                    parseFloat(metrics.sentimentAvg) >= 2.5 ? "text-yellow-400" :
                    "text-orange-400"
                  )}>
                    {parseFloat(metrics.sentimentAvg) >= 3.5 ? 'Positive' :
                     parseFloat(metrics.sentimentAvg) >= 2.5 ? 'Mixed' :
                     'Resistant'}
                  </span>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  {/* Neutral marker at 60% (3.0/5.0) */}
                  <div className="absolute top-0 bottom-0 left-[60%] w-px bg-gray-500/30" />
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      parseFloat(metrics.sentimentAvg) >= 3.5 ? "bg-gradient-to-r from-green-400 to-teal-400" :
                      parseFloat(metrics.sentimentAvg) >= 2.5 ? "bg-gradient-to-r from-yellow-400 to-orange-400" :
                      "bg-gradient-to-r from-orange-400 to-red-400"
                    )}
                    style={{ width: `${(parseFloat(metrics.sentimentAvg) / 5) * 100}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-gray-600">
                  <span>1.0</span>
                  <span className="text-gray-500">3.0 (Neutral)</span>
                  <span>5.0</span>
                </div>
              </div>

              {/* Benchmarks */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500">vs All companies</span>
                  <span className="text-green-400 font-semibold">+0.3</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500">vs Financial Services</span>
                  <span className="text-orange-400 font-semibold">-0.2</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500">vs North America</span>
                  <span className="text-gray-400 font-semibold">±0.0</span>
                </div>
              </div>

            </div>
          </div>

          {/* Capability Maturity */}
          <div className="md:col-span-4 bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg border border-blue-500/20 p-3 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white uppercase tracking-wide">Capability Maturity</div>
                  <div className="text-xs text-gray-500">Organizational AI readiness level</div>
                </div>
              </div>

              {/* Score Display */}
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-6xl font-bold text-blue-400 tabular-nums leading-none">{metrics.capabilityAvg}</span>
                <div className="flex flex-col justify-end pb-1">
                  <span className="text-xl text-gray-500 leading-none">/7.0</span>
                  <span className="text-[8px] text-gray-600 uppercase tracking-wide">CMMI</span>
                </div>
              </div>

              {/* Maturity Levels */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Current Level</span>
                  <span className="text-blue-400 font-semibold">Level 4 - Intermediate</span>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                  {/* Level markers */}
                  <div className="absolute top-0 bottom-0 left-[57%] w-px bg-green-400/30" />
                  <div className="absolute -top-3 left-[57%] -translate-x-1/2 text-[8px] text-green-400 font-bold">
                    ⚑ Target: 4.0
                  </div>
                  {/* Progress */}
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 via-blue-400 to-cyan-400 rounded-full"
                    style={{ width: `${(parseFloat(metrics.capabilityAvg) / 7) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] text-gray-600">
                  <span>Level 1</span>
                  <span className="text-green-400 font-medium">Level 4</span>
                  <span>Level 7</span>
                </div>
              </div>

              {/* Benchmarks */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500">vs All companies</span>
                  <span className="text-green-400 font-semibold">+0.5</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500">vs Financial Services</span>
                  <span className="text-orange-400 font-semibold">-0.4</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-gray-500">vs North America</span>
                  <span className="text-green-400 font-semibold">+0.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: KEY INSIGHTS - Compact */}
      <div className="flex-shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Key Strength */}
          <div className="bg-gradient-to-br from-green-500/5 to-transparent rounded-lg border border-green-500/20 p-2 hover:border-green-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-400" />
              </div>
              <h3 className="text-xs font-bold text-green-400 uppercase tracking-wide">Strength</h3>
              <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 font-bold">High</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-1.5">
              Positive sentiment: <span className="text-white font-medium">collaboration & human interaction</span>
            </p>
            <div className="flex items-center justify-between pt-1.5 border-t border-green-500/10 text-[10px]">
              <span className="text-gray-500">Ethics capability</span>
              <span className="text-green-400 font-bold">5.3/7.0</span>
            </div>
          </div>

          {/* Primary Challenge */}
          <div className="bg-gradient-to-br from-orange-500/5 to-transparent rounded-lg border border-orange-500/20 p-2 hover:border-orange-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded bg-orange-500/10 flex items-center justify-center">
                <AlertTriangle className="w-3 h-3 text-orange-400" />
              </div>
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wide">Challenge</h3>
              <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold">Critical</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-1.5">
              Concerns: <span className="text-white font-medium">AI transparency & autonomy</span>
            </p>
            <div className="flex items-center justify-between pt-1.5 border-t border-orange-500/10 text-[10px]">
              <span className="text-gray-500">Low scores</span>
              <span className="text-orange-400 font-bold">{metrics.lowScoreCount} areas</span>
            </div>
          </div>

          {/* Top Opportunity */}
          <div className="bg-gradient-to-br from-blue-500/5 to-transparent rounded-lg border border-blue-500/20 p-2 hover:border-blue-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-blue-400" />
              </div>
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wide">Opportunity</h3>
              <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold">Growth</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-1.5">
              Strong <span className="text-white font-medium">Ethics & Innovation</span> foundation
            </p>
            <div className="flex items-center justify-between pt-1.5 border-t border-blue-500/10 text-[10px]">
              <span className="text-gray-500">vs Benchmark</span>
              <span className="text-blue-400 font-bold">+0.8 pts</span>
            </div>
          </div>

          {/* Recommended Focus */}
          <div className="bg-gradient-to-br from-purple-500/5 to-transparent rounded-lg border border-purple-500/20 p-2 hover:border-purple-500/30 transition-all cursor-pointer">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center">
                <Lightbulb className="w-3 h-3 text-purple-400" />
              </div>
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wide">Recommended</h3>
              <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">Action</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-1.5">
              Focus: <span className="text-white font-medium">Data Infrastructure</span> gap
            </p>
            <div className="flex items-center justify-between pt-1.5 border-t border-purple-500/10 text-[10px]">
              <span className="text-gray-500">Interventions</span>
              <span className="text-purple-400 font-bold">3 ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: CAPABILITY BREAKDOWN - Takes remaining space */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Capability Dimensions</h2>
              <p className="text-xs text-gray-500">8 areas • Scored vs industry</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('capability')}
            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/30 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-all font-medium"
          >
            Full Analysis <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-lg border border-white/10 overflow-hidden flex flex-col min-h-0">
          {/* Table Container with Scroll */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-black/80 backdrop-blur-xl z-10">
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold uppercase tracking-wider text-xs">Dimension</th>
                  <th className="text-center py-3 px-3 text-gray-400 font-semibold uppercase tracking-wider text-xs">Your Score</th>
                  <th className="text-center py-3 px-3 text-gray-400 font-semibold uppercase tracking-wider text-xs">Industry Avg</th>
                  <th className="text-center py-3 px-3 text-gray-400 font-semibold uppercase tracking-wider text-xs">Gap</th>
                  <th className="text-center py-3 px-3 text-gray-400 font-semibold uppercase tracking-wider text-xs">Items</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold uppercase tracking-wider text-xs">Performance</th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map((dim, index) => (
                  <tr 
                    key={dim.name} 
                    className={cn(
                      "border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors group",
                      index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                    )}
                  >
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold group-hover:text-teal-300 transition-colors">{dim.name}</span>
                        <Info className="w-3.5 h-3.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="text-center px-3 tabular-nums">
                      <span className={cn(
                        "font-bold text-base",
                        dim.score >= dim.benchmark ? "text-green-400" : "text-orange-400"
                      )}>
                        {dim.score.toFixed(1)}
                      </span>
                      <span className="text-gray-600 text-sm ml-0.5">/7.0</span>
                    </td>
                    <td className="text-center px-3 text-gray-400 tabular-nums font-medium text-sm">{dim.benchmark.toFixed(1)}</td>
                    <td className="text-center px-3 tabular-nums">
                      <span className={cn(
                        "inline-flex items-center gap-1 font-semibold",
                        dim.gap >= 0 ? "text-green-400" : "text-orange-400"
                      )}>
                        {dim.gap >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <Down className="w-3.5 h-3.5" />}
                        {dim.gap >= 0 ? '+' : ''}{dim.gap.toFixed(1)}
                      </span>
                    </td>
                    <td className="text-center px-3 text-gray-400 font-medium">{dim.constructs}</td>
                    <td className="text-right px-4">
                      <span className={cn(
                        "inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider",
                        dim.score >= 5 ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        dim.score >= 4 ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      )}>
                        {dim.score >= 5 ? 'EXCEEDS' : dim.score >= 4 ? 'MEETS' : 'BELOW'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer - Always visible */}
          <div className="flex-shrink-0 px-4 py-3 border-t border-white/5 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Industry benchmark: <span className="text-gray-400 font-medium">Financial Services (1000-5000 employees)</span>
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">
                Framework: <span className="text-gray-400 font-medium">AI Capability Maturity Model v2.0</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: DEEP DIVE NAVIGATION */}
      <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/5">
        <button
          onClick={() => onNavigate('sentiment')}
          className="group bg-gradient-to-r from-teal-500/10 to-purple-500/10 hover:from-teal-500/15 hover:to-purple-500/15 rounded-lg border border-teal-500/30 hover:border-teal-400/50 transition-all p-3.5 flex items-center gap-3"
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shadow-lg shadow-teal-500/10">
            <Users className="w-5 h-5 text-teal-400" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-white">Explore Sentiment Data</span>
              <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-2">
              Analyze the 5×5 sentiment heatmap showing how employees feel about AI across 25 dimensions. Identify resistance patterns and problem areas.
            </p>
            <div className="flex items-center gap-1.5 text-[9px]">
              <span className="px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-semibold">
                25 dimensions
              </span>
              <span className="px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-semibold">
                {metrics.respondentCount} responses
              </span>
              <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold">
                {metrics.lowScoreCount} concerns
              </span>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('capability')}
          className="group bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/15 hover:to-purple-500/15 rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all p-3.5 flex items-center gap-3"
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-white">Analyze Capability Gaps</span>
              <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-2">
              Deep dive into the 8 capability dimensions with radar charts. Compare against industry benchmarks and identify specific constructs needing improvement.
            </p>
            <div className="flex items-center gap-1.5 text-[9px]">
              <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
                8 dimensions
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
                32 constructs
              </span>
              <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold">
                3 gaps found
              </span>
            </div>
          </div>
        </button>
      </div>

    </div>
  )
}
