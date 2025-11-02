'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, TrendingUp, Users, Target, FileText, Download, 
  Filter, Settings, HelpCircle, Sparkles, ArrowRight,
  Hash, Calendar, BarChart3, Zap, Command
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onNavigate?: (view: string) => void
  onAction?: (action: string) => void
}

interface Command {
  id: string
  title: string
  description: string
  icon: any
  category: string
  keywords: string[]
  action: () => void
  shortcut?: string
}

export function CommandPalette({ isOpen, onClose, onNavigate, onAction }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const commands: Command[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-overview',
      title: 'Go to Command Center',
      description: 'View executive dashboard',
      icon: BarChart3,
      category: 'Navigation',
      keywords: ['overview', 'dashboard', 'home', 'command'],
      action: () => onNavigate?.('overview'),
      shortcut: '1'
    },
    {
      id: 'nav-sentiment',
      title: 'Go to Sentiment Analysis',
      description: 'View 25-dimension sentiment heatmap',
      icon: Users,
      category: 'Navigation',
      keywords: ['sentiment', 'feelings', 'heatmap', 'employees'],
      action: () => onNavigate?.('sentiment'),
      shortcut: '2'
    },
    {
      id: 'nav-capability',
      title: 'Go to Capability Assessment',
      description: 'View 8-dimension capability analysis',
      icon: Target,
      category: 'Navigation',
      keywords: ['capability', 'skills', 'assessment', 'dimensions'],
      action: () => onNavigate?.('capability'),
      shortcut: '3'
    },
    {
      id: 'nav-recommendations',
      title: 'Go to Recommendations',
      description: 'View AI-powered insights',
      icon: Sparkles,
      category: 'Navigation',
      keywords: ['recommendations', 'ai', 'insights', 'suggestions'],
      action: () => onNavigate?.('recommendations'),
      shortcut: '4'
    },
    {
      id: 'nav-reports',
      title: 'Go to Reports',
      description: 'Generate and export reports',
      icon: FileText,
      category: 'Navigation',
      keywords: ['reports', 'export', 'pdf', 'download'],
      action: () => onNavigate?.('reports'),
      shortcut: '5'
    },
    // Actions
    {
      id: 'action-export',
      title: 'Export Current View',
      description: 'Download as PDF report',
      icon: Download,
      category: 'Actions',
      keywords: ['export', 'download', 'pdf', 'save'],
      action: () => onAction?.('export'),
      shortcut: '⌘E'
    },
    {
      id: 'action-filter',
      title: 'Toggle Filters',
      description: 'Show or hide filter panel',
      icon: Filter,
      category: 'Actions',
      keywords: ['filter', 'segment', 'refine'],
      action: () => onAction?.('toggle-filters'),
      shortcut: '⌘F'
    },
    {
      id: 'action-settings',
      title: 'Open Settings',
      description: 'Customize preferences',
      icon: Settings,
      category: 'Actions',
      keywords: ['settings', 'preferences', 'config'],
      action: () => onAction?.('settings')
    },
    // Quick Filters
    {
      id: 'filter-low-scores',
      title: 'Show Low Scores Only',
      description: 'Filter to priority areas',
      icon: TrendingUp,
      category: 'Quick Filters',
      keywords: ['low', 'priority', 'concerning', 'problems'],
      action: () => onAction?.('filter-low-scores')
    },
    {
      id: 'filter-high-performers',
      title: 'Show High Performers',
      description: 'View best performing areas',
      icon: Zap,
      category: 'Quick Filters',
      keywords: ['high', 'best', 'top', 'performers'],
      action: () => onAction?.('filter-high-performers')
    },
    // Help
    {
      id: 'help-guide',
      title: 'Open User Guide',
      description: 'Learn how to use the platform',
      icon: HelpCircle,
      category: 'Help',
      keywords: ['help', 'guide', 'tutorial', 'docs'],
      action: () => onAction?.('help')
    }
  ], [onNavigate, onAction])

  const filteredCommands = useMemo(() => {
    if (!search) return commands

    const searchLower = search.toLowerCase()
    return commands.filter(cmd =>
      cmd.title.toLowerCase().includes(searchLower) ||
      cmd.description.toLowerCase().includes(searchLower) ||
      cmd.keywords.some(k => k.includes(searchLower))
    )
  }, [commands, search])

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {}
    filteredCommands.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const cmd = filteredCommands[selectedIndex]
        if (cmd) {
          cmd.action()
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101]"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-white/10">
                <Search className="w-5 h-5 text-slate-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none text-base"
                  autoFocus
                />
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-500">
                  <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">Esc</kbd>
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-gray-500">
                    No commands found
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, cmds]) => (
                    <div key={category} className="py-2">
                      <div className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider">
                        {category}
                      </div>
                      {cmds.map((cmd, index) => {
                        const globalIndex = filteredCommands.indexOf(cmd)
                        const isSelected = globalIndex === selectedIndex
                        const Icon = cmd.icon

                        return (
                          <motion.button
                            key={cmd.id}
                            onClick={() => {
                              cmd.action()
                              onClose()
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 px-4 py-3 transition-colors text-left',
                              isSelected
                                ? 'bg-teal-500/10 dark:bg-teal-500/20'
                                : 'hover:bg-slate-100 dark:hover:bg-white/5'
                            )}
                            whileHover={{ x: 2 }}
                          >
                            <div className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center',
                              isSelected
                                ? 'bg-teal-500/20 dark:bg-teal-500/30'
                                : 'bg-slate-100 dark:bg-white/5'
                            )}>
                              <Icon className={cn(
                                'w-5 h-5',
                                isSelected
                                  ? 'text-teal-600 dark:text-teal-400'
                                  : 'text-slate-600 dark:text-gray-400'
                              )} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-slate-900 dark:text-white text-sm">
                                {cmd.title}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-gray-400 truncate">
                                {cmd.description}
                              </div>
                            </div>

                            {cmd.shortcut && (
                              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-gray-400">
                                {cmd.shortcut}
                              </kbd>
                            )}

                            {isSelected && (
                              <ArrowRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-500">
                  <Command className="w-3 h-3" />
                  <span>Command Palette</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}


