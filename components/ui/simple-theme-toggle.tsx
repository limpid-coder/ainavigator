'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/contexts/theme-context'
import { motion } from 'framer-motion'

export function SimpleThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <Moon className="w-4 h-4 text-slate-700" />
        ) : (
          <Sun className="w-4 h-4 text-gray-300" />
        )}
      </motion.div>
    </motion.button>
  )
}





