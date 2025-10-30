'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
  label?: string
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  showLabel = true,
  label,
  color = 'primary'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const colors = {
    primary: {
      stroke: 'url(#gradient-primary)',
      text: 'text-[#5380b3] dark:text-[#5380b3]'
    },
    success: {
      stroke: '#14b8a6',
      text: 'text-teal-500'
    },
    warning: {
      stroke: '#f59e0b',
      text: 'text-amber-500'
    },
    danger: {
      stroke: '#ef4444',
      text: 'text-red-500'
    }
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5380b3" />
            <stop offset="100%" stopColor="#a74f8b" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-800"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors[color].stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1]
          }}
        />
      </svg>
      
      {showLabel && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span className={cn('text-2xl font-bold', colors[color].text)}>
            {Math.round(progress)}%
          </span>
          {label && (
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {label}
            </span>
          )}
        </motion.div>
      )}
    </div>
  )
}

