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
  const [tooltipStyles, setTooltipStyles] = useState<React.CSSProperties>({})
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

      const gap = 8 // Gap between trigger and tooltip
      let newPosition = position
      let top = 0
      let left = 0

      // Calculate initial position based on preference
      switch (position) {
        case 'top':
          top = trigger.top - tooltip.height - gap
          left = trigger.left + trigger.width / 2 - tooltip.width / 2
          break
        case 'bottom':
          top = trigger.bottom + gap
          left = trigger.left + trigger.width / 2 - tooltip.width / 2
          break
        case 'left':
          top = trigger.top + trigger.height / 2 - tooltip.height / 2
          left = trigger.left - tooltip.width - gap
          break
        case 'right':
          top = trigger.top + trigger.height / 2 - tooltip.height / 2
          left = trigger.right + gap
          break
      }

      // Check boundaries and adjust if needed
      if (position === 'top' && top < 0) {
        newPosition = 'bottom'
        top = trigger.bottom + gap
      } else if (position === 'bottom' && top + tooltip.height > viewport.height) {
        newPosition = 'top'
        top = trigger.top - tooltip.height - gap
      } else if (position === 'left' && left < 0) {
        newPosition = 'right'
        left = trigger.right + gap
      } else if (position === 'right' && left + tooltip.width > viewport.width) {
        newPosition = 'left'
        left = trigger.left - tooltip.width - gap
      }

      // Ensure tooltip stays within viewport horizontally
      if (left < gap) left = gap
      if (left + tooltip.width > viewport.width - gap) {
        left = viewport.width - tooltip.width - gap
      }

      // Ensure tooltip stays within viewport vertically
      if (top < gap) top = gap
      if (top + tooltip.height > viewport.height - gap) {
        top = viewport.height - tooltip.height - gap
      }

      setActualPosition(newPosition)
      setTooltipStyles({ top: `${top}px`, left: `${left}px` })
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
    setTooltipStyles({})
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
            className="fixed z-[9999] pointer-events-none"
            style={{ maxWidth, ...tooltipStyles }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
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
            <div className={cn(
              'absolute',
              actualPosition === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
              actualPosition === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-full rotate-180',
              actualPosition === 'left' && 'right-0 top-1/2 -translate-y-1/2 translate-x-full -rotate-90',
              actualPosition === 'right' && 'left-0 top-1/2 -translate-y-1/2 -translate-x-full rotate-90'
            )}>
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

