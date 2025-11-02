'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface SuccessCelebrationProps {
  trigger?: boolean
  onComplete?: () => void
}

export function SuccessCelebration({ trigger, onComplete }: SuccessCelebrationProps) {
  useEffect(() => {
    if (trigger) {
      // Subtle confetti for success moments
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#5380b3', '#a74f8b', '#14b8a6'],
        ticks: 200,
        gravity: 1.2,
        scalar: 0.8
      })
      
      if (onComplete) {
        setTimeout(onComplete, 1000)
      }
    }
  }, [trigger, onComplete])

  return null
}

// Utility function to trigger celebrations anywhere
export function celebrate(type: 'success' | 'milestone' | 'subtle' = 'success') {
  const configs = {
    subtle: {
      particleCount: 30,
      spread: 40,
      origin: { y: 0.7 },
      colors: ['#5380b3', '#14b8a6'],
      ticks: 150,
      gravity: 1.5,
      scalar: 0.7
    },
    success: {
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#5380b3', '#a74f8b', '#14b8a6'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.8
    },
    milestone: {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5380b3', '#a74f8b', '#e0874e', '#14b8a6'],
      ticks: 250,
      gravity: 1,
      scalar: 1
    }
  }

  confetti(configs[type])
}





