'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
  glowOnHover?: boolean
  delay?: number
}

export function InteractiveCard({
  children,
  className,
  onClick,
  hoverable = true,
  glowOnHover = false,
  delay = 0
}: InteractiveCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
        'border border-gray-200/50 dark:border-white/10',
        'shadow-lg hover:shadow-2xl transition-shadow duration-300',
        onClick && 'cursor-pointer',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={hoverable ? {
        y: -4,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className={cn(
          'absolute inset-0 opacity-0 pointer-events-none',
          'bg-gradient-to-br from-[#5380b3]/5 to-[#a74f8b]/5',
          'dark:from-[#5380b3]/10 dark:to-[#a74f8b]/10'
        )}
        whileHover={{ opacity: hoverable ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect */}
      {glowOnHover && (
        <motion.div
          className="absolute -inset-0.5 rounded-2xl opacity-0 blur-xl bg-gradient-to-r from-[#5380b3] to-[#a74f8b]"
          whileHover={{ opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="100" cy="0" r="80" fill="url(#corner-gradient)" />
          <defs>
            <linearGradient id="corner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5380b3" />
              <stop offset="100%" stopColor="#a74f8b" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </motion.div>
  )
}





