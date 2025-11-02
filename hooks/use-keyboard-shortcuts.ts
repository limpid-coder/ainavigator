import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  handler: () => void
  description?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          altMatch &&
          shiftMatch
        ) {
          event.preventDefault()
          shortcut.handler()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Predefined shortcuts
export const SHORTCUTS = {
  TOGGLE_SIDEBAR: { key: 'b', ctrl: true, description: 'Toggle sidebar' },
  TOGGLE_FILTERS: { key: 'f', ctrl: true, description: 'Toggle filters' },
  EXPORT_PDF: { key: 'e', ctrl: true, description: 'Export PDF' },
  SEARCH: { key: 'k', ctrl: true, description: 'Search' },
  HELP: { key: '?', shift: true, description: 'Show help' },
  ESCAPE: { key: 'Escape', description: 'Close modals' }
}





