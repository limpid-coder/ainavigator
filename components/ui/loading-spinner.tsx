'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'teal' | 'purple' | 'white'
  label?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'teal',
  label,
  className 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colors = {
    teal: 'border-teal-500',
    purple: 'border-purple-500',
    white: 'border-white'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <motion.div
        className={cn(
          'rounded-full border-2 border-t-transparent',
          sizes[size],
          colors[color]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      {label && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {label}
        </motion.p>
      )}
    </div>
  )
}

// Pulsing dots variant
export function LoadingDots({ 
  color = 'teal',
  className 
}: { color?: 'teal' | 'purple' | 'white', className?: string }) {
  const colors = {
    teal: 'bg-teal-500',
    purple: 'bg-purple-500',
    white: 'bg-white'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn('w-2 h-2 rounded-full', colors[color])}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )
}

// Skeleton loader
export function SkeletonLoader({ 
  className,
  count = 1 
}: { className?: string, count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            'h-4 bg-gray-200 dark:bg-white/10 rounded-lg',
            className
          )}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  )
}

