'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Command, Search, Download, Filter, HelpCircle, Sidebar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KeyboardShortcutsHelpProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['1'], description: 'Go to Command Center', icon: '🏠' },
        { keys: ['2'], description: 'Go to Sentiment Analysis', icon: '😊' },
        { keys: ['3'], description: 'Go to Capability Assessment', icon: '🎯' },
        { keys: ['4'], description: 'Go to Recommendations', icon: '✨' },
        { keys: ['5'], description: 'Go to Reports', icon: '📄' },
      ]
    },
    {
      category: 'Actions',
      items: [
        { keys: ['⌘', 'K'], description: 'Open Command Palette', icon: <Command className="w-4 h-4" /> },
        { keys: ['⌘', 'F'], description: 'Toggle Filters', icon: <Filter className="w-4 h-4" /> },
        { keys: ['⌘', 'E'], description: 'Export Current View', icon: <Download className="w-4 h-4" /> },
        { keys: ['⌘', 'B'], description: 'Toggle Sidebar', icon: <Sidebar className="w-4 h-4" /> },
        { keys: ['?'], description: 'Show Shortcuts', icon: <HelpCircle className="w-4 h-4" /> },
      ]
    },
    {
      category: 'Quick Actions',
      items: [
        { keys: ['Esc'], description: 'Close Modals', icon: '✕' },
        { keys: ['↑', '↓'], description: 'Navigate Lists', icon: '⬍' },
        { keys: ['↵'], description: 'Select/Confirm', icon: '⏎' },
      ]
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[101]"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-teal-500/10 to-purple-500/10">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    Work faster with these shortcuts
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                {shortcuts.map((section, index) => (
                  <motion.div
                    key={section.category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-sm">
                              {typeof item.icon === 'string' ? item.icon : item.icon}
                            </div>
                            <span className="text-sm text-slate-700 dark:text-gray-300">
                              {item.description}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, keyIndex) => (
                              <div key={keyIndex} className="flex items-center">
                                <kbd className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-gray-300 shadow-sm">
                                  {key}
                                </kbd>
                                {keyIndex < item.keys.length - 1 && (
                                  <span className="mx-1 text-slate-400 dark:text-gray-600">+</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-center">
                <p className="text-xs text-slate-600 dark:text-gray-500">
                  Press <kbd className="px-2 py-1 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-400">?</kbd> anytime to see these shortcuts
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


