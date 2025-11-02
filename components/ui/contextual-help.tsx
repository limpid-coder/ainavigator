'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, ExternalLink, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface HelpArticle {
  title: string
  description: string
  link?: string
}

interface ContextualHelpProps {
  title: string
  description: string
  articles?: HelpArticle[]
  className?: string
}

export function ContextualHelp({
  title,
  description,
  articles = [],
  className
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('relative inline-flex', className)}>
      {/* Help button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-center w-5 h-5 rounded-full',
          'bg-gray-200/50 dark:bg-white/5 hover:bg-gray-300/50 dark:hover:bg-white/10',
          'border border-gray-300/50 dark:border-white/10',
          'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
          'transition-all duration-200',
          isOpen && 'bg-teal-500/20 border-teal-500/30 text-teal-600 dark:text-teal-400'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <HelpCircle className="w-3 h-3" />
      </motion.button>

      {/* Help panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="absolute left-0 top-full mt-2 w-80 z-50"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
            >
              <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-teal-500/10 to-purple-500/10 p-4 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                        {title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {description}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-shrink-0 p-1 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Articles */}
                {articles.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider px-2 py-1.5">
                      Related Resources
                    </div>
                    
                    <div className="space-y-1">
                      {articles.map((article, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            if (article.link) {
                              window.open(article.link, '_blank')
                            }
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-left transition-colors group"
                          whileHover={{ x: 2 }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                              {article.title}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-500 line-clamp-1">
                              {article.description}
                            </div>
                          </div>
                          
                          {article.link ? (
                            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-teal-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-teal-500 flex-shrink-0" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer tip */}
                <div className="p-3 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-200 dark:border-white/5">
                  <p className="text-[10px] text-gray-500 dark:text-gray-500 leading-relaxed">
                    💡 <span className="font-medium">Pro tip:</span> Hover over any element for quick insights
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}





