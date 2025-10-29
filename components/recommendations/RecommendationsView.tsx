'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lightbulb, Target, TrendingUp, Users, AlertTriangle,
  CheckCircle, ArrowRight, DollarSign, Clock, Zap,
  ChevronRight, Info, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecommendationsViewProps {
  sentimentData: any[]
  capabilityData: any[]
  companyName: string
}

interface Intervention {
  id: string
  priority: number
  title: string
  tagline: string
  description: string
  addresses: {
    sentimentGaps: string[]
    capabilityGaps: string[]
  }
  impact: {
    roi: string
    timeline: string
    effort: 'low' | 'medium' | 'high'
  }
  outcomes: string[]
  cost: {
    range: string
    breakdown: string
  }
}

export default function RecommendationsView({
  sentimentData,
  capabilityData,
  companyName
}: RecommendationsViewProps) {
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null)

  const interventions: Intervention[] = [
    {
      id: 'INT001',
      priority: 1,
      title: 'AI Transparency & Explainability Program',
      tagline: 'Build trust through clear AI decision-making',
      description: 'Comprehensive program to make AI systems interpretable and trustworthy. Includes explainable AI implementation, decision audit frameworks, and employee training on AI transparency.',
      addresses: {
        sentimentGaps: ['AI too Opaque (#23 ranking)', 'Professional Trust concerns'],
        capabilityGaps: ['Ethics & Governance', 'Data Infrastructure']
      },
      impact: {
        roi: '30-50% reduction in AI resistance',
        timeline: '12 weeks',
        effort: 'high'
      },
      outcomes: [
        'Employees understand how AI makes decisions',
        'Increased adoption rates by 40%',
        'Reduced compliance risk',
        'Improved trust in AI-driven processes'
      ],
      cost: {
        range: '$150K - $350K',
        breakdown: 'Technology: $80K • Training: $120K • Consulting: $150K'
      }
    },
    {
      id: 'INT002',
      priority: 2,
      title: 'Data Infrastructure Modernization',
      tagline: 'Close the capability gap with robust data systems',
      description: 'Upgrade data accessibility, integration, and quality frameworks. Addresses the -1.4 gap vs industry benchmark in Data Infrastructure dimension.',
      addresses: {
        sentimentGaps: ['Data quality concerns'],
        capabilityGaps: ['Data Infrastructure (4.1 vs 5.5 benchmark)', 'Technology Stack']
      },
      impact: {
        roi: '40-60% faster AI deployment',
        timeline: '16 weeks',
        effort: 'high'
      },
      outcomes: [
        'Unified data platform across systems',
        'Real-time data accessibility',
        'Improved data quality by 65%',
        'Foundation for AI scaling'
      ],
      cost: {
        range: '$250K - $500K',
        breakdown: 'Infrastructure: $200K • Migration: $150K • Tools: $150K'
      }
    },
    {
      id: 'INT003',
      priority: 3,
      title: 'Human-in-the-Loop AI Design',
      tagline: 'Balance automation with human control',
      description: 'Redesign AI workflows to preserve human decision-making authority while leveraging AI efficiency. Addresses autonomy and inflexibility concerns.',
      addresses: {
        sentimentGaps: ['AI too Autonomous (#25 ranking)', 'AI too Inflexible (#18 ranking)'],
        capabilityGaps: ['Process & Operations', 'Change & Adoption']
      },
      impact: {
        roi: '25-35% productivity improvement',
        timeline: '8 weeks',
        effort: 'medium'
      },
      outcomes: [
        'AI augments (not replaces) human workers',
        'Flexible AI configuration options',
        'Reduced job security anxiety',
        'Improved collaboration with AI'
      ],
      cost: {
        range: '$80K - $200K',
        breakdown: 'Design: $60K • Implementation: $80K • Training: $60K'
      }
    },
    {
      id: 'INT004',
      priority: 4,
      title: 'AI Skills Development Program',
      tagline: 'Upskill employees for AI-augmented roles',
      description: 'Comprehensive training program covering AI literacy, tool proficiency, and new role capabilities. Addresses Talent & Skills gap.',
      addresses: {
        sentimentGaps: ['Career anxiety', 'Skills gap concerns'],
        capabilityGaps: ['Talent & Skills (3.8 vs 4.5 benchmark)']
      },
      impact: {
        roi: '20-30% skill proficiency increase',
        timeline: '24 weeks (ongoing)',
        effort: 'medium'
      },
      outcomes: [
        'AI literacy across all levels',
        'Reduced skills gap by 45%',
        'Internal AI champions identified',
        'Continuous learning culture'
      ],
      cost: {
        range: '$120K - $280K',
        breakdown: 'Content: $80K • Platform: $100K • Facilitation: $100K'
      }
    },
    {
      id: 'INT005',
      priority: 5,
      title: 'Change Management & Communication',
      tagline: 'Guide the organization through AI transformation',
      description: 'Structured change management program with targeted communications, stakeholder engagement, and resistance mitigation strategies.',
      addresses: {
        sentimentGaps: ['Organizational stability concerns', 'Collaboration anxiety'],
        capabilityGaps: ['Change & Adoption (3.9 vs 4.2 benchmark)']
      },
      impact: {
        roi: '35-45% faster adoption',
        timeline: '20 weeks',
        effort: 'medium'
      },
      outcomes: [
        'Clear transformation roadmap',
        'Stakeholder alignment',
        'Resistance patterns addressed',
        'Cultural readiness for AI'
      ],
      cost: {
        range: '$100K - $220K',
        breakdown: 'Strategy: $70K • Communications: $80K • Workshops: $70K'
      }
    }
  ]

  const selectedInterventionData = interventions.find(i => i.id === selectedIntervention)

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Recommended Interventions</h2>
            <p className="text-sm text-gray-400">
              AI-matched actions based on your sentiment gaps and capability deficits
            </p>
          </div>
          <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-teal-500/20">
            <div className="text-xs text-gray-400 mb-0.5">Total Estimated Impact</div>
            <div className="text-xl font-bold text-teal-400">30-50% ↑</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <p className="text-xs text-blue-300">
            These interventions are prioritized by impact and matched to your specific gaps. Click any card for detailed implementation plan.
          </p>
        </div>
      </div>

      {/* Interventions Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="grid gap-3">
          {interventions.map((intervention, index) => {
            const isSelected = selectedIntervention === intervention.id
            
            return (
              <motion.div
                key={intervention.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={cn(
                    "w-full rounded-xl border transition-all p-4",
                    isSelected
                      ? "bg-gradient-to-r from-teal-500/15 to-purple-500/15 border-teal-500/30 shadow-lg shadow-teal-500/10"
                      : "bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                  )}
                >
                  {/* Header - Clickable */}
                  <button
                    onClick={() => setSelectedIntervention(isSelected ? null : intervention.id)}
                    className="w-full flex items-start justify-between gap-4 mb-3 text-left hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg",
                        intervention.priority === 1 ? "bg-gradient-to-br from-teal-500 to-purple-500" :
                        intervention.priority === 2 ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                        intervention.priority === 3 ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                        "bg-white/10"
                      )}>
                        <span className="text-white font-bold text-lg">#{intervention.priority}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white">{intervention.title}</h3>
                          {intervention.priority <= 2 && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold uppercase">
                              Critical
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{intervention.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Estimated ROI</div>
                        <div className="text-sm font-bold text-teal-400">{intervention.impact.roi}</div>
                      </div>
                      <ChevronRight className={cn(
                        "w-5 h-5 transition-transform",
                        isSelected ? "rotate-90 text-teal-400" : "text-gray-600"
                      )} />
                    </div>
                  </button>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-xs mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-gray-400">{intervention.impact.timeline}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-gray-400">{intervention.cost.range}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-gray-400">
                        {intervention.impact.effort.charAt(0).toUpperCase() + intervention.impact.effort.slice(1)} effort
                      </span>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-orange-500/10 rounded-lg border border-orange-500/20 p-2">
                      <div className="text-xs text-orange-400 font-semibold mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Addresses Sentiment Gaps
                      </div>
                      <div className="space-y-0.5">
                        {intervention.addresses.sentimentGaps.map((gap, i) => (
                          <div key={i} className="text-xs text-gray-300">• {gap}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg border border-blue-500/20 p-2">
                      <div className="text-xs text-blue-400 font-semibold mb-1 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Addresses Capability Gaps
                      </div>
                      <div className="space-y-0.5">
                        {intervention.addresses.capabilityGaps.map((gap, i) => (
                          <div key={i} className="text-xs text-gray-300">• {gap}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-white/10 space-y-4">
                          {/* Description */}
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">Full Description</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{intervention.description}</p>
                          </div>

                          {/* Expected Outcomes */}
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              Expected Outcomes
                            </h4>
                            <div className="grid md:grid-cols-2 gap-2">
                              {intervention.outcomes.map((outcome, i) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                  <Star className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                                  <span>{outcome}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Investment Details */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                              <div className="text-xs text-gray-400 mb-1">Investment Range</div>
                              <div className="text-lg font-bold text-white mb-2">{intervention.cost.range}</div>
                              <div className="text-[10px] text-gray-500">{intervention.cost.breakdown}</div>
                            </div>
                            <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                              <div className="text-xs text-gray-400 mb-1">Expected ROI</div>
                              <div className="text-lg font-bold text-teal-400 mb-2">{intervention.impact.roi}</div>
                              <div className="text-[10px] text-gray-500">Measured by adoption rates & efficiency gains</div>
                            </div>
                          </div>

                          {/* CTA */}
                          <div className="flex items-center gap-3 pt-2">
                            <div className="flex-1 px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-400/30 text-teal-300 text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed opacity-60">
                              <CheckCircle className="w-4 h-4" />
                              Select for Action Plan
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-semibold cursor-not-allowed opacity-60">
                              View Case Studies
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex-shrink-0 pt-4 border-t border-white/5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-teal-500/10 to-transparent rounded-lg border border-teal-500/20 p-3 text-center">
            <div className="text-2xl font-bold text-teal-400 mb-1">{interventions.length}</div>
            <div className="text-xs text-gray-400">Total Interventions</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-transparent rounded-lg border border-purple-500/20 p-3 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">$600K-$1.5M</div>
            <div className="text-xs text-gray-400">Total Investment Range</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-lg border border-green-500/20 p-3 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">$2M-$5M</div>
            <div className="text-xs text-gray-400">Potential Savings (3yr)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
