'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'

interface TooltipInteractiveProps {
  children: ReactNode
  content: string | ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function TooltipInteractive({
  children,
  content,
  position = 'top',
  delay = 0
}: TooltipInteractiveProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
    left: 'top-1/2 -left-2 -translate-x-full -translate-y-1/2',
    right: 'top-1/2 -right-2 translate-x-full -translate-y-1/2'
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              'absolute z-50 px-3 py-2 rounded-lg',
              'bg-gray-900/95 dark:bg-white/95',
              'text-white dark:text-gray-900',
              'text-sm font-medium whitespace-nowrap',
              'backdrop-blur-xl border border-white/10 dark:border-gray-900/10',
              'shadow-xl',
              positions[position]
            )}
            initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: position === 'top' ? 5 : position === 'bottom' ? -5 : 0 }}
            transition={{
              duration: 0.15,
              delay,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {content}
            
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 rotate-45',
                'bg-gray-900/95 dark:bg-white/95',
                'border-white/10 dark:border-gray-900/10',
                position === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-r border-b',
                position === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-l border-t',
                position === 'left' && 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-r border-t',
                position === 'right' && 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-l border-b'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}





