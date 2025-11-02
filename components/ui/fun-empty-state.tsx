'use client'

import { motion } from 'framer-motion'
import { Search, Inbox, Filter, Frown, Coffee, Sparkles } from 'lucide-react'

interface FunEmptyStateProps {
  type?: 'no-data' | 'no-results' | 'no-filters' | 'error'
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const EMPTY_STATES = {
  'no-data': {
    icon: Inbox,
    title: 'Nothing here yet! 📭',
    message: 'Looks like this section is taking a coffee break. Check back later!',
    color: 'from-blue-500 to-cyan-500'
  },
  'no-results': {
    icon: Search,
    title: 'No matches found 🔍',
    message: 'Hmm, our AI couldn\'t find anything. Try different filters?',
    color: 'from-purple-500 to-pink-500'
  },
  'no-filters': {
    icon: Filter,
    title: 'All filtered out! 🎯',
    message: 'Your filters are too strict. Maybe loosen up a bit?',
    color: 'from-teal-500 to-green-500'
  },
  'error': {
    icon: Frown,
    title: 'Oops! Something went wrong 😅',
    message: 'Our hamsters stopped running. Give us a moment to feed them!',
    color: 'from-orange-500 to-red-500'
  }
}

export function FunEmptyState({ 
  type = 'no-data', 
  title, 
  message, 
  action 
}: FunEmptyStateProps) {
  const state = EMPTY_STATES[type]
  const Icon = state.icon

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full min-h-[400px] p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating icon */}
      <motion.div
        className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${state.color} flex items-center justify-center shadow-2xl mb-6`}
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <Icon className="w-12 h-12 text-white" />
        
        {/* Sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>
        ))}
      </motion.div>

      {/* Text */}
      <motion.h3
        className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {title || state.title}
      </motion.h3>

      <motion.p
        className="text-base text-slate-600 dark:text-gray-400 text-center max-w-md mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message || state.message}
      </motion.p>

      {/* Action button */}
      {action && (
        <motion.button
          onClick={action.onClick}
          className={`px-6 py-3 rounded-xl bg-gradient-to-r ${state.color} text-white font-semibold shadow-lg hover:shadow-xl transition-shadow`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}

      {/* Fun decoration */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
      >
        <div className="absolute text-9xl top-10 left-10 text-slate-900 dark:text-white">
          ¯\_(ツ)_/¯
        </div>
      </motion.div>
    </motion.div>
  )
}


