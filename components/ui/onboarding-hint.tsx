'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingHintProps {
  id: string
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  targetSelector?: string
  onDismiss?: () => void
  autoShow?: boolean
  delay?: number
}

export function OnboardingHint({
  id,
  title,
  description,
  position = 'bottom',
  targetSelector,
  onDismiss,
  autoShow = true,
  delay = 1000
}: OnboardingHintProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed this hint
    const dismissed = localStorage.getItem(`hint-dismissed-${id}`)
    if (dismissed) {
      setHasBeenDismissed(true)
      return
    }

    if (autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [id, autoShow, delay])

  const handleDismiss = () => {
    setIsVisible(false)
    setHasBeenDismissed(true)
    localStorage.setItem(`hint-dismissed-${id}`, 'true')
    onDismiss?.()
  }

  const handleGotIt = () => {
    handleDismiss()
  }

  if (hasBeenDismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />

          {/* Hint Card */}
          <motion.div
            className="fixed z-[100] max-w-sm"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25
            }}
          >
            <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5" />
              
              {/* Glow effect */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

              {/* Content */}
              <div className="relative p-6">
                {/* Close button */}
                <button
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-purple-500 mb-4"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(20, 184, 166, 0.3)',
                      '0 0 30px rgba(167, 79, 139, 0.4)',
                      '0 0 20px rgba(20, 184, 166, 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={handleGotIt}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-purple-500 text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Got it
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                  
                  <motion.button
                    onClick={handleDismiss}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium text-sm transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Skip
                  </motion.button>
                </div>
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'linear',
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook to manage multiple onboarding hints
export function useOnboarding() {
  const [currentHint, setCurrentHint] = useState<string | null>(null)

  const showHint = (hintId: string) => {
    const dismissed = localStorage.getItem(`hint-dismissed-${hintId}`)
    if (!dismissed) {
      setCurrentHint(hintId)
    }
  }

  const dismissCurrentHint = () => {
    setCurrentHint(null)
  }

  const resetHints = () => {
    // Clear all hint dismissals
    const keys = Object.keys(localStorage).filter(key => key.startsWith('hint-dismissed-'))
    keys.forEach(key => localStorage.removeItem(key))
  }

  return {
    currentHint,
    showHint,
    dismissCurrentHint,
    resetHints
  }
}





