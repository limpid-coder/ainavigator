'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const QUIRKY_MESSAGES = [
  "Crunching the numbers... 🔢",
  "Teaching AI to read minds... 🧠",
  "Brewing fresh insights... ☕",
  "Polishing the data diamonds... 💎",
  "Consulting the data wizards... 🧙‍♂️",
  "Warming up the algorithms... 🔥",
  "Aligning the data stars... ⭐",
  "Summoning the insights... ✨",
  "Making the charts look pretty... 📊",
  "Asking ChatGPT for help... 🤖",
  "Almost there... just 5 more hours... ⏰",
  "Finding the meaning of AI... 🤔",
  "Downloading more RAM... 💻",
  "This usually takes longer... 🎯",
  "Loading at the speed of light... 💡",
  "Putting on our thinking cap... 🎓"
]

export function QuirkyLoadingMessage() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [messages] = useState(() => {
    // Shuffle messages for variety
    return [...QUIRKY_MESSAGES].sort(() => Math.random() - 0.5).slice(0, 5)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className="relative h-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentMessage}
          className="text-sm text-slate-600 dark:text-gray-400 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {messages[currentMessage]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}


