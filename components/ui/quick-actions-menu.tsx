'use client'

import { motion } from 'framer-motion'
import { 
  Download, Share2, Bookmark, Copy, ExternalLink,
  RefreshCw, Maximize2, Settings, Zap
} from 'lucide-react'
import { EnhancedTooltip } from './enhanced-tooltip'

interface QuickActionsMenuProps {
  onExport?: () => void
  onShare?: () => void
  onBookmark?: () => void
  onCopy?: () => void
  onRefresh?: () => void
  onFullscreen?: () => void
  className?: string
}

export function QuickActionsMenu({
  onExport,
  onShare,
  onBookmark,
  onCopy,
  onRefresh,
  onFullscreen,
  className
}: QuickActionsMenuProps) {
  const actions = [
    {
      icon: Download,
      label: 'Export',
      description: 'Download as PDF',
      onClick: onExport,
      color: 'teal'
    },
    {
      icon: Share2,
      label: 'Share',
      description: 'Share this view',
      onClick: onShare,
      color: 'purple'
    },
    {
      icon: Bookmark,
      label: 'Bookmark',
      description: 'Save for later',
      onClick: onBookmark,
      color: 'blue'
    },
    {
      icon: Copy,
      label: 'Copy',
      description: 'Copy link',
      onClick: onCopy,
      color: 'orange'
    },
    {
      icon: RefreshCw,
      label: 'Refresh',
      description: 'Reload data',
      onClick: onRefresh,
      color: 'green'
    },
    {
      icon: Maximize2,
      label: 'Fullscreen',
      description: 'Expand view',
      onClick: onFullscreen,
      color: 'pink'
    }
  ]

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {actions.map((action, index) => {
        const Icon = action.icon
        
        return (
          <EnhancedTooltip
            key={action.label}
            content={action.description}
            title={action.label}
            icon="tip"
            position="bottom"
            delay={0}
          >
            <motion.button
              onClick={action.onClick}
              className="p-2 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors shadow-sm group"
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Icon className="w-4 h-4 text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
            </motion.button>
          </EnhancedTooltip>
        )
      })}
    </div>
  )
}


