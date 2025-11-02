'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BouncyIconProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function BouncyIcon({ children, className, delay = 0 }: BouncyIconProps) {
  return (
    <motion.div
      className={cn('inline-flex', className)}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay
      }}
      whileHover={{
        scale: 1.2,
        rotate: [0, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.div>
  )
}

// Pulsing variant
export function PulsingIcon({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      className={cn('inline-flex', className)}
      animate={{
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Floating variant
export function FloatingIcon({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      className={cn('inline-flex', className)}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}





