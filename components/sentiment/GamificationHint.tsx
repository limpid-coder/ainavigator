'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Zap, Target, Dice6 } from 'lucide-react'

interface GamificationHintProps {
  onDismiss: () => void
}

export default function GamificationHint({ onDismiss }: GamificationHintProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem('gamification-hint-seen')
    if (!hasSeenHint) {
      // Show hint after a brief delay
      setTimeout(() => setShow(true), 1500)
    }
  }, [])

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('gamification-hint-seen', 'true')
    setTimeout(onDismiss, 300)
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={handleDismiss}
          />

          {/* Hint Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-lg mx-4"
          >
            <div className="bg-gradient-to-br from-purple-900 via-black to-pink-900 rounded-2xl border-2 border-purple-500/30 p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Interactive Mode Active!</h3>
                    <p className="text-sm text-purple-300">Gamified solutions now available</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4 mb-6">
                <p className="text-sm text-gray-300 leading-relaxed">
                  Click any cell with a <Sparkles className="w-4 h-4 inline text-purple-400" /> sparkle icon 
                  to explore <span className="font-bold text-white">4 unique solution styles</span>:
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
                    <Target className="w-5 h-5 text-blue-400 mb-1" />
                    <div className="text-sm font-semibold text-blue-300">Basic</div>
                    <div className="text-xs text-gray-400">Proven & reliable</div>
                  </div>

                  <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/30">
                    <Zap className="w-5 h-5 text-orange-400 mb-1" />
                    <div className="text-sm font-semibold text-orange-300">Risky</div>
                    <div className="text-xs text-gray-400">Bold & creative</div>
                  </div>

                  <div className="bg-gray-500/10 rounded-lg p-3 border border-gray-500/30">
                    <Target className="w-5 h-5 text-gray-400 mb-1" />
                    <div className="text-sm font-semibold text-gray-300">Safe</div>
                    <div className="text-xs text-gray-400">Low-risk & tested</div>
                  </div>

                  <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                    <Dice6 className="w-5 h-5 text-purple-400 mb-1" />
                    <div className="text-sm font-semibold text-purple-300">Lucky</div>
                    <div className="text-xs text-gray-400">Surprise me!</div>
                  </div>
                </div>

                <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/20">
                  <p className="text-xs text-purple-200 leading-relaxed">
                    💡 <span className="font-semibold">Pro Tip:</span> Try "I'm Feeling Lucky" for an animated dice roll that randomly picks a solution!
                  </p>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={handleDismiss}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Got it! Let's explore 🚀
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}





