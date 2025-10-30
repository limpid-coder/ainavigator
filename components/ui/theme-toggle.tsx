'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/contexts/theme-context'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative flex items-center justify-center',
        'w-14 h-8 rounded-full p-1',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
        'dark:focus:ring-offset-gray-900',
        'hover:opacity-90',
        isLight
          ? 'bg-gradient-to-r from-amber-400 to-orange-400'
          : 'bg-gradient-to-r from-indigo-600 to-purple-600'
      )}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
    >
      {/* Toggle Circle */}
      <motion.div
        className={cn(
          'w-6 h-6 rounded-full shadow-lg',
          'flex items-center justify-center',
          'bg-white dark:bg-gray-900'
        )}
        animate={{
          x: isLight ? 0 : 20,
        }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 40
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLight ? (
            <motion.div
              key="sun"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-4 h-4 text-amber-500" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  )
}

