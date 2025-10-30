'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/contexts/theme-context'
import { motion } from 'framer-motion'

export function SimpleThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 transition-colors shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-slate-700" />
      ) : (
        <Sun className="w-4 h-4 text-gray-300" />
      )}
    </button>
  )
}

