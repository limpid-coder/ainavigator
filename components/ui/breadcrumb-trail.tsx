'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  onClick?: () => void
  icon?: any
}

interface BreadcrumbTrailProps {
  items: BreadcrumbItem[]
  className?: string
}

export function BreadcrumbTrail({ items, className }: BreadcrumbTrailProps) {
  return (
    <nav className={cn('flex items-center gap-2 flex-wrap', className)}>
      {items.map((item, index) => {
        const Icon = item.icon
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            <motion.button
              onClick={item.onClick}
              disabled={isLast}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium',
                isLast
                  ? 'text-slate-900 dark:text-white bg-teal-500/10 border border-teal-500/20'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              )}
              whileHover={!isLast ? { x: -2 } : {}}
              whileTap={!isLast ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </motion.button>

            {!isLast && (
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-gray-600" />
            )}
          </div>
        )
      })}
    </nav>
  )
}


