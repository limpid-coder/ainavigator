'use client'

/**
 * Client-side providers wrapper with global AI Chat
 * This component wraps the app with necessary providers and includes the AI chat
 */

import { ThemeProvider } from '@/lib/contexts/theme-context'
import { AIChat } from '@/components/chat/AIChat'

export function ProvidersWithChat({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <AIChat />
    </ThemeProvider>
  )
}

