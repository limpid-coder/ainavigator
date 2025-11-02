'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Trophy, Zap, Star, Heart, Coffee, Rocket } from 'lucide-react'
import confetti from 'canvas-confetti'

interface Achievement {
  id: string
  title: string
  message: string
  icon: any
  color: string
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'speed-demon',
    title: '⚡ Speed Demon',
    message: 'You navigated using keyboard shortcuts! So efficient!',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'explorer',
    title: '🗺️ Explorer',
    message: 'You\'ve visited all sections! Curiosity rewarded!',
    icon: Star,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'power-user',
    title: '🚀 Power User',
    message: 'Command palette master! You know the shortcuts!',
    icon: Rocket,
    color: 'from-teal-500 to-blue-500'
  },
  {
    id: 'theme-switcher',
    title: '🎨 Theme Switcher',
    message: 'Light and dark mode both look great, right?',
    icon: Star,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'coffee-break',
    title: '☕ Coffee Break',
    message: 'You\'ve been here a while. Maybe time for a break?',
    icon: Coffee,
    color: 'from-amber-600 to-orange-600'
  },
  {
    id: 'data-lover',
    title: '📊 Data Enthusiast',
    message: 'You love diving into the details, don\'t you?',
    icon: Heart,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'secret-finder',
    title: '🎮 Secret Finder',
    message: 'You found the Konami code! Old school gamer detected!',
    icon: Trophy,
    color: 'from-amber-500 to-yellow-500'
  }
]

interface EasterEggAchievementProps {
  achievementId: string | null
  onDismiss: () => void
}

export function EasterEggAchievement({ achievementId, onDismiss }: EasterEggAchievementProps) {
  const [show, setShow] = useState(false)
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)

  useEffect(() => {
    if (achievementId && achievement) {
      setShow(true)
      
      // Trigger confetti
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#14b8a6', '#a855f7', '#3b82f6', '#ec4899']
      })

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onDismiss, 300)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [achievementId, achievement, onDismiss])

  if (!achievement) return null

  const Icon = achievement.icon

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-20 right-4 z-[200] max-w-sm"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-10`} />
            
            {/* Content */}
            <div className="relative p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center shadow-lg`}
                  animate={{
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 0.5,
                    times: [0, 0.2, 0.4, 0.6, 1]
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Achievement Unlocked!
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {achievement.message}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-purple-500"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </div>

            {/* Sparkles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${20 + (i % 2) * 60}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  repeat: 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook to track achievements
export function useAchievements() {
  const [achievementToShow, setAchievementToShow] = useState<string | null>(null)
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set())

  useEffect(() => {
    const stored = localStorage.getItem('unlocked-achievements')
    if (stored) {
      setUnlockedAchievements(new Set(JSON.parse(stored)))
    }
  }, [])

  const unlock = (achievementId: string) => {
    if (unlockedAchievements.has(achievementId)) return

    const newSet = new Set(unlockedAchievements)
    newSet.add(achievementId)
    setUnlockedAchievements(newSet)
    localStorage.setItem('unlocked-achievements', JSON.stringify([...newSet]))
    setAchievementToShow(achievementId)
  }

  const dismiss = () => {
    setAchievementToShow(null)
  }

  return { achievementToShow, unlock, dismiss, unlockedAchievements }
}

