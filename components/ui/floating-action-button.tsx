'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
}

export function FloatingActionButton({
  icon,
  label,
  onClick,
  variant = 'primary',
  className
}: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 px-5 py-3 rounded-full',
        'shadow-lg hover:shadow-2xl transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'primary'
          ? 'bg-gradient-to-r from-[#5380b3] to-[#a74f8b] text-white focus:ring-[#5380b3] dark:from-[#5380b3]/90 dark:to-[#a74f8b]/90'
          : 'bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white focus:ring-gray-300 dark:focus:ring-gray-600',
        'backdrop-blur-xl border border-white/20 dark:border-white/10',
        className
      )}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17
      }}
    >
      {/* Glow effect */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full opacity-0 group-hover:opacity-100',
          'transition-opacity duration-300',
          variant === 'primary'
            ? 'bg-gradient-to-r from-[#5380b3]/50 to-[#a74f8b]/50 blur-xl'
            : 'bg-gray-300/50 dark:bg-gray-600/50 blur-xl'
        )}
      />
      
      {/* Icon */}
      <motion.div
        className="relative z-10"
        whileHover={{ rotate: 12 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        {icon}
      </motion.div>

      {/* Label */}
      <span className="relative z-10 font-medium text-sm whitespace-nowrap">
        {label}
      </span>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        }}
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.button>
  )
}





