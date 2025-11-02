'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Minimize2, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MiniMapProps {
  sections: Array<{
    id: string
    label: string
    color: string
    isActive?: boolean
  }>
  onNavigate?: (sectionId: string) => void
  className?: string
}

export function MiniMap({ sections, onNavigate, className }: MiniMapProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      className={cn(
        'fixed left-4 bottom-4 z-40',
        'bg-white dark:bg-gray-900 rounded-xl shadow-lg',
        'border border-slate-200 dark:border-white/10',
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
            Quick Nav
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10"
          >
            {isExpanded ? (
              <Minimize2 className="w-3 h-3 text-slate-600 dark:text-gray-400" />
            ) : (
              <Maximize2 className="w-3 h-3 text-slate-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-1">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => onNavigate?.(section.id)}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all group text-left',
                section.isActive
                  ? 'bg-teal-500/10 border border-teal-500/20'
                  : 'hover:bg-slate-100 dark:hover:bg-white/5'
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ x: 2 }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: section.color }}
              />
              {isExpanded && (
                <span className={cn(
                  'text-xs font-medium',
                  section.isActive
                    ? 'text-teal-700 dark:text-teal-300'
                    : 'text-slate-700 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white'
                )}>
                  {section.label}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}


