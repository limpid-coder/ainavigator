'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'text' | 'card'
  width?: string | number
  height?: string | number
  animate?: boolean
}

export function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  animate = true
}: SkeletonProps) {
  const baseStyles = cn(
    "relative overflow-hidden bg-white/5 rounded-lg",
    animate && "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
    className
  )

  const variantStyles = {
    default: '',
    circular: 'rounded-full',
    text: 'h-4 rounded',
    card: 'rounded-xl'
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant])}
      style={{ width, height }}
    />
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

interface SkeletonCardProps {
  className?: string
  showAvatar?: boolean
  showActions?: boolean
}

export function SkeletonCard({ className, showAvatar = true, showActions = false }: SkeletonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-dark rounded-2xl p-6 space-y-4",
        className
      )}
    >
      {showAvatar && (
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      )}
      
      <SkeletonText lines={3} />
      
      {showActions && (
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      )}
    </motion.div>
  )
}

interface SkeletonGridProps {
  count?: number
  columns?: number
  className?: string
}

export function SkeletonGrid({ count = 6, columns = 3, className }: SkeletonGridProps) {
  return (
    <div className={cn(
      `grid gap-6`,
      columns === 2 && 'md:grid-cols-2',
      columns === 3 && 'md:grid-cols-3',
      columns === 4 && 'md:grid-cols-4',
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  )
}

// Chart skeleton loader
export function SkeletonChart({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("glass-dark rounded-2xl p-6", className)}
    >
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      
      <div className="h-64 relative">
        <div className="absolute inset-0 flex items-end justify-between gap-2 px-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1"
              height={`${30 + Math.random() * 70}%`}
            />
          ))}
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mt-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </motion.div>
  )
}

// Dashboard skeleton
export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Skeleton className="h-10 w-64 mx-auto mb-3" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-dark rounded-2xl p-8"
          >
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-12 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
          </motion.div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  )
}
