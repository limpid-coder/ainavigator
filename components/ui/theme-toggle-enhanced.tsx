'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Sparkles } from 'lucide-react'
import { useTheme } from '@/lib/contexts/theme-context'
import { cn } from '@/lib/utils'

export function ThemeToggleEnhanced() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative flex items-center justify-between gap-1',
        'w-16 h-8 rounded-full p-1',
        'transition-all duration-500',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'shadow-inner',
        isLight
          ? 'bg-gradient-to-r from-amber-100 to-orange-100 focus:ring-amber-400 border border-amber-200'
          : 'bg-gradient-to-r from-indigo-900 to-purple-900 focus:ring-indigo-500 border border-indigo-700'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    >
      {/* Sun icon (visible in light mode) */}
      <motion.div
        className="relative z-10 w-6 h-6 flex items-center justify-center"
        animate={{
          opacity: isLight ? 1 : 0,
          scale: isLight ? 1 : 0.5,
          rotate: isLight ? 0 : 90
        }}
        transition={{ duration: 0.3 }}
      >
        <Sun className="w-4 h-4 text-amber-600" />
      </motion.div>

      {/* Toggle circle */}
      <motion.div
        className={cn(
          'absolute top-1 w-6 h-6 rounded-full shadow-lg',
          'flex items-center justify-center',
          isLight
            ? 'bg-white border border-amber-300'
            : 'bg-gray-800 border border-indigo-500'
        )}
        animate={{
          x: isLight ? 2 : 34,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      >
        {/* Inner glow */}
        <motion.div
          className={cn(
            'absolute inset-0.5 rounded-full',
            isLight
              ? 'bg-gradient-to-br from-yellow-200 to-amber-300'
              : 'bg-gradient-to-br from-indigo-600 to-purple-600'
          )}
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Icon */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isLight ? (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: 90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-3 h-3 text-indigo-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Moon icon (visible in dark mode) */}
      <motion.div
        className="relative z-10 w-6 h-6 flex items-center justify-center"
        animate={{
          opacity: isLight ? 0 : 1,
          scale: isLight ? 0.5 : 1,
          rotate: isLight ? -90 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <Moon className="w-4 h-4 text-indigo-300" />
      </motion.div>

      {/* Stars for dark mode */}
      <AnimatePresence>
        {!isLight && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.3, 1]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Sun rays for light mode */}
      <AnimatePresence>
        {isLight && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.3 },
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' }
            }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-1 bg-amber-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: 'center',
                  transform: `rotate(${i * 60}deg) translateY(-14px)`
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  height: ['3px', '5px', '3px']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}





