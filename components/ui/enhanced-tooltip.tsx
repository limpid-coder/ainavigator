'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Info, Sparkles, Lightbulb, TrendingUp, Target } from 'lucide-react'

interface EnhancedTooltipProps {
  children: ReactNode
  content: string | ReactNode
  title?: string
  icon?: 'info' | 'tip' | 'insight' | 'goal' | 'sparkle'
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  maxWidth?: string
  disabled?: boolean
}

const iconMap = {
  info: Info,
  tip: Lightbulb,
  insight: TrendingUp,
  goal: Target,
  sparkle: Sparkles
}

export function EnhancedTooltip({
  children,
  content,
  title,
  icon,
  position = 'top',
  delay = 200,
  maxWidth = '300px',
  disabled = false
}: EnhancedTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltip = tooltipRef.current.getBoundingClientRect()
      const trigger = triggerRef.current.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      // Check if tooltip would go off screen and adjust position
      let newPosition = position
      
      if (position === 'top' && tooltip.top < 0) {
        newPosition = 'bottom'
      } else if (position === 'bottom' && tooltip.bottom > viewport.height) {
        newPosition = 'top'
      } else if (position === 'left' && tooltip.left < 0) {
        newPosition = 'right'
      } else if (position === 'right' && tooltip.right > viewport.width) {
        newPosition = 'left'
      }

      setActualPosition(newPosition)
    }
  }, [isVisible, position])

  const handleMouseEnter = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 rotate-180',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 -rotate-90',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 rotate-90'
  }

  const IconComponent = icon ? iconMap[icon] : null

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            className={cn(
              'absolute z-[100] pointer-events-none',
              positions[actualPosition]
            )}
            style={{ maxWidth }}
            initial={{ opacity: 0, scale: 0.9, y: actualPosition === 'top' ? 5 : actualPosition === 'bottom' ? -5 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: actualPosition === 'top' ? 5 : actualPosition === 'bottom' ? -5 : 0 }}
            transition={{
              duration: 0.15,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <div className="relative bg-gray-900/98 dark:bg-gray-900/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              
              {/* Content */}
              <div className="relative p-3">
                {(title || icon) && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                    {IconComponent && (
                      <div className="flex-shrink-0 w-5 h-5 rounded-lg bg-teal-500/20 flex items-center justify-center">
                        <IconComponent className="w-3 h-3 text-teal-400" />
                      </div>
                    )}
                    {title && (
                      <span className="text-xs font-semibold text-white">
                        {title}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="text-[13px] leading-relaxed text-gray-300">
                  {content}
                </div>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'linear',
                }}
              />
            </div>

            {/* Arrow */}
            <div className={cn('absolute', arrowPositions[actualPosition])}>
              <div className="w-3 h-3">
                <svg viewBox="0 0 12 12" className="w-full h-full">
                  <path
                    d="M6 0 L12 12 L0 12 Z"
                    fill="rgb(17 24 39 / 0.98)"
                    stroke="rgb(255 255 255 / 0.1)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

