'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

const STATUS_MESSAGES = {
  loading: [
    "Making the magic happen...",
    "Sprinkling some AI dust...",
    "Teaching robots to dance...",
    "Bribing the servers...",
    "Convincing the data to cooperate..."
  ],
  success: [
    "Boom! 💥 Nailed it!",
    "That worked surprisingly well!",
    "High five! ✋ You're crushing it!",
    "Look at you go! 🚀",
    "Smooth like butter! 🧈"
  ],
  error: [
    "Well, that didn't go as planned... 😅",
    "Our AI is being dramatic today...",
    "The hamsters need more coffee... ☕",
    "Plot twist! Something broke... 🎬",
    "Error 404: Perfection not found... 😉"
  ],
  idle: [
    "Waiting for your next move... 👀",
    "Ready when you are! 😊",
    "What would you like to explore?",
    "The data awaits your curiosity...",
    "Take your time, we'll be here! ⏰"
  ]
}

interface QuirkyStatusMessageProps {
  status: 'loading' | 'success' | 'error' | 'idle'
  customMessage?: string
}

export function QuirkyStatusMessage({ status, customMessage }: QuirkyStatusMessageProps) {
  const [message] = useState(() => {
    const messages = STATUS_MESSAGES[status]
    return messages[Math.floor(Math.random() * messages.length)]
  })

  return (
    <motion.div
      className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
    >
      {status === 'loading' && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-4 h-4 text-teal-500" />
        </motion.div>
      )}
      <span>{customMessage || message}</span>
    </motion.div>
  )
}


