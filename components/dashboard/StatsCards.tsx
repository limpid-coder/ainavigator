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

// Premium progress bar component with Apple-level polish
const ProgressBar = ({ value, max = 100, color }: any) => {
  const percentage = (value / max) * 100

  return (
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative backdrop-blur-sm border border-white/5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{
          duration: 1.5,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="h-full relative"
        style={{
          background: `linear-gradient(90deg,
            ${color} 0%,
            ${color}f0 50%,
            ${color}dd 100%
          )`,
          boxShadow: `
            0 0 10px ${color}60,
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `
        }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0"
          animate={{ x: ['0%', '200%'] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear"
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            width: '50%'
          }}
        />
      </motion.div>
    </div>
  )
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total Responses',
      value: stats.totalResponses,
      icon: Users,
      gradient: 'from-teal-500/15 to-cyan-400/15',
      glowColor: 'rgba(13, 124, 127, 0.3)',
      iconColor: 'text-teal-300',
      iconBg: 'from-teal-500/20 to-cyan-400/20',
      suffix: '',
      decimals: 0,
      showProgress: false
    },
    {
      label: 'AI Readiness',
      value: stats.readinessScore,
      icon: Gauge,
      gradient: 'from-purple-500/15 to-indigo-500/15',
      glowColor: 'rgba(78, 74, 175, 0.3)',
      iconColor: 'text-purple-300',
      iconBg: 'from-purple-500/20 to-indigo-500/20',
      suffix: '%',
      decimals: 0,
      showProgress: true,
      progressColor: '#7B77D9',
      progressMax: 100,
      status: stats.readinessScore >= 60 ? 'good' : 'needs-attention'
    },
    {
      label: 'Sentiment Score',
      value: stats.sentimentAverage,
      icon: TrendingUp,
      gradient: 'from-teal-400/15 to-emerald-400/15',
      glowColor: 'rgba(20, 184, 166, 0.3)',
      iconColor: 'text-teal-300',
      iconBg: 'from-teal-400/20 to-emerald-400/20',
      suffix: '/5',
      decimals: 1,
      showProgress: true,
      progressColor: '#14B8A6',
      progressMax: 5,
      status: Number(stats.sentimentAverage) >= 3 ? 'good' : 'needs-attention'
    },
    {
      label: 'Capability Score',
      value: stats.capabilityAverage,
      icon: Target,
      gradient: 'from-orange-500/15 to-amber-500/15',
      glowColor: 'rgba(255, 107, 53, 0.3)',
      iconColor: 'text-orange-300',
      iconBg: 'from-orange-500/20 to-amber-500/20',
      suffix: '/5',
      decimals: 1,
      showProgress: true,
      progressColor: '#FF8C5F',
      progressMax: 5,
      status: Number(stats.capabilityAverage) >= 3 ? 'good' : 'needs-attention'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: index * 0.08,
            duration: 0.5,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          whileHover={{
            y: -8,
            transition: { type: "spring", stiffness: 400, damping: 20 }
          }}
          className="glass-premium rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
          style={{
            boxShadow: `
              0 4px 16px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(255, 255, 255, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.08)
            `
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-40`}
            animate={{
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Glow effect on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: `0 0 40px ${card.glowColor}, 0 0 80px ${card.glowColor}40`
            }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              repeat: Infinity,
              duration: 4,
              delay: index * 0.5,
              ease: "linear"
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
            }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.08 + 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className={`p-3 rounded-xl bg-gradient-to-br ${card.iconBg} ${card.iconColor} shadow-lg`}
              >
                <card.icon className="w-6 h-6" />
              </motion.div>
              {card.status && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: index * 0.08 + 0.3,
                    type: "spring",
                    stiffness: 300
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium backdrop-blur-sm ${
                    card.status === 'good'
                      ? 'bg-green-500/15 text-green-300 border border-green-500/30 shadow-lg shadow-green-500/20'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {card.status === 'good' ? '✓ Good' : '⚠ Monitor'}
                </motion.div>
              )}
            </div>

            {/* Value */}
            <div className="space-y-3">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
                {card.label}
              </p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.08 + 0.4,
                  type: "spring",
                  stiffness: 300
                }}
                className="text-3xl font-bold text-white tracking-tight"
              >
                <AnimatedCounter
                  value={card.value}
                  suffix={card.suffix}
                  decimals={card.decimals}
                />
              </motion.p>

              {/* Premium progress bar */}
              {card.showProgress && (
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: index * 0.08 + 0.5,
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                  className="mt-4"
                >
                  <ProgressBar
                    value={Number(card.value)}
                    max={card.progressMax}
                    color={card.progressColor}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}