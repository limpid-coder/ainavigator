import { useEffect } from 'react'

interface KeyboardNavigationConfig {
  onCommandPalette?: () => void
  onSearch?: () => void
  onToggleSidebar?: () => void
  onToggleFilters?: () => void
  onExport?: () => void
  onHelp?: () => void
  onNavigate?: (view: string) => void
}

export function useKeyboardNavigation(config: KeyboardNavigationConfig) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette - Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        config.onCommandPalette?.()
        return
      }

      // Search - Cmd/Ctrl + F
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        config.onToggleFilters?.()
        return
      }

      // Export - Cmd/Ctrl + E
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault()
        config.onExport?.()
        return
      }

      // Toggle Sidebar - Cmd/Ctrl + B
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        config.onToggleSidebar?.()
        return
      }

      // Help - ?
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        config.onHelp?.()
        return
      }

      // Number keys for navigation (1-5)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        const views = ['overview', 'sentiment', 'capability', 'recommendations', 'reports']
        const num = parseInt(e.key)
        if (num >= 1 && num <= 5) {
          e.preventDefault()
          config.onNavigate?.(views[num - 1])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [config])
}


