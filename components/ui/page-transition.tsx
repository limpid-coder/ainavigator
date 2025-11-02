'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  mode?: 'fade' | 'slide' | 'scale' | 'blur'
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 }
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
    transition: { duration: 0.4 }
  }
}

export function PageTransition({ children, mode = 'slide' }: PageTransitionProps) {
  const config = variants[mode]

  return (
    <motion.div
      initial={config.initial}
      animate={config.animate}
      exit={config.exit}
      transition={config.transition as any}
      className="h-full"
    >
      {children}
    </motion.div>
  )
}


