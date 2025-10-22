'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Gauge, Target } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatsCardsProps {
  stats: {
    totalResponses: number
    readinessScore: number
    sentimentAverage: string
    capabilityAverage: string
  }
}

// Smooth animated counter
const AnimatedCounter = ({ value, suffix = '', decimals = 0 }: any) => {
  const [displayValue, setDisplayValue] = useState(0)
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  useEffect(() => {
    let start = 0
    const duration = 1500
    const increment = numValue / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= numValue) {
        setDisplayValue(numValue)
        clearInterval(timer)
      } else {
        setDisplayValue(start)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [numValue])

  const formatted = decimals > 0 
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString()

  return <span>{formatted}{suffix}</span>
}

// Progress bar component
const ProgressBar = ({ value, max = 100, color }: any) => {
  const percentage = (value / max) * 100

  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${color}`}
        style={{
          background: `linear-gradient(90deg, ${color} 0%, ${color}dd 100%)`
        }}
      />
    </div>
  )
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Responses',
      value: stats.totalResponses,
      icon: Users,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-400',
      suffix: '',
      decimals: 0,
      showProgress: false
    },
    {
      label: 'AI Readiness',
      value: stats.readinessScore,
      icon: Gauge,
      gradient: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-400',
      suffix: '%',
      decimals: 0,
      showProgress: true,
      progressColor: '#8B5CF6',
      progressMax: 100,
      status: stats.readinessScore >= 60 ? 'good' : 'needs-attention'
    },
    {
      label: 'Sentiment Score',
      value: stats.sentimentAverage,
      icon: TrendingUp,
      gradient: 'from-green-500/10 to-emerald-500/10',
      iconColor: 'text-green-400',
      suffix: '/5',
      decimals: 1,
      showProgress: true,
      progressColor: '#10B981',
      progressMax: 5,
      status: Number(stats.sentimentAverage) >= 3 ? 'good' : 'needs-attention'
    },
    {
      label: 'Capability Score',
      value: stats.capabilityAverage,
      icon: Target,
      gradient: 'from-amber-500/10 to-orange-500/10',
      iconColor: 'text-amber-400',
      suffix: '/5',
      decimals: 1,
      showProgress: true,
      progressColor: '#F59E0B',
      progressMax: 5,
      status: Number(stats.capabilityAverage) >= 3 ? 'good' : 'needs-attention'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="glass-premium rounded-xl p-6 relative overflow-hidden group hover:shadow-lg transition-all"
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 group-hover:opacity-70 transition-opacity`} />
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg glass ${card.iconColor}`}>
                <card.icon className="w-5 h-5" />
              </div>
              {card.status && (
                <div className={`text-xs px-2 py-1 rounded-full ${
                  card.status === 'good' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {card.status === 'good' ? 'Good' : 'Monitor'}
                </div>
              )}
            </div>
            
            {/* Value */}
            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold text-white">
                <AnimatedCounter 
                  value={card.value} 
                  suffix={card.suffix} 
                  decimals={card.decimals}
                />
              </p>
              
              {/* Progress bar */}
              {card.showProgress && (
                <div className="mt-3">
                  <ProgressBar 
                    value={Number(card.value)} 
                    max={card.progressMax}
                    color={card.progressColor}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}