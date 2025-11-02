'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EnhancedTooltip } from './enhanced-tooltip'

interface AnimatedStatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  description?: string
  tooltip?: string
  color?: 'teal' | 'purple' | 'blue' | 'orange'
  onClick?: () => void
  delay?: number
}

export function AnimatedStatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
  description,
  tooltip,
  color = 'teal',
  onClick,
  delay = 0
}: AnimatedStatCardProps) {
  const colors = {
    teal: {
      bg: 'from-teal-500/10 to-teal-600/5',
      border: 'border-teal-500/20',
      icon: 'bg-teal-500/20 text-teal-600 dark:text-teal-400',
      text: 'text-teal-600 dark:text-teal-400'
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-500/20',
      icon: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      text: 'text-purple-600 dark:text-purple-400'
    },
    blue: {
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20',
      icon: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400'
    },
    orange: {
      bg: 'from-orange-500/10 to-orange-600/5',
      border: 'border-orange-500/20',
      icon: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      text: 'text-orange-600 dark:text-orange-400'
    }
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3" />
    if (trend === 'down') return <TrendingDown className="w-3 h-3" />
    return <Minus className="w-3 h-3" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400'
    if (trend === 'down') return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const card = (
    <motion.div
      className={cn(
        'relative group rounded-2xl overflow-hidden',
        'bg-white dark:bg-gray-900/50 backdrop-blur-xl',
        'border border-gray-200 dark:border-white/10',
        'shadow-lg hover:shadow-2xl transition-all duration-300',
        onClick && 'cursor-pointer'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={onClick ? { y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {/* Gradient background */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', colors[color].bg)} />
      
      {/* Hover glow */}
      <motion.div
        className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300')}
        style={{
          background: `radial-gradient(circle at center, ${color === 'teal' ? 'rgba(20, 184, 166, 0.1)' : color === 'purple' ? 'rgba(168, 85, 247, 0.1)' : color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(249, 115, 22, 0.1)'} 0%, transparent 70%)`
        }}
      />

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {description}
              </p>
            )}
          </div>
          
          {icon && (
            <motion.div
              className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors[color].icon)}
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {icon}
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          className="mb-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
        >
          <div className={cn('text-3xl font-bold', colors[color].text)}>
            {value}
          </div>
        </motion.div>

        {/* Change indicator */}
        {change !== undefined && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
          >
            <div className={cn('flex items-center gap-1 text-sm font-medium', getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
            {changeLabel && (
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {changeLabel}
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className={cn('h-1', colors[color].bg)} />
    </motion.div>
  )

  if (tooltip) {
    return (
      <EnhancedTooltip content={tooltip} icon="info" position="top">
        {card}
      </EnhancedTooltip>
    )
  }

  return card
}





