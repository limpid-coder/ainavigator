'use client'

/**
 * Enhanced providers with theme support, AI chat, and toast notifications
 * This component wraps the app with necessary providers and includes global features
 */

import { ThemeProvider } from '@/lib/contexts/theme-context'
import { AIChat } from '@/components/chat/AIChat'
import { Toaster } from 'react-hot-toast'

export function ProvidersWithChat({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <AIChat />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'bg-white dark:bg-gray-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10',
          style: {
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#14b8a6',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </ThemeProvider>
  )
}

