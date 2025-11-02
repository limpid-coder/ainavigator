'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  angle: number
  velocity: number
}

interface ParticleBurstProps {
  trigger: boolean
  x: number
  y: number
  count?: number
  colors?: string[]
  onComplete?: () => void
}

export function ParticleBurst({
  trigger,
  x,
  y,
  count = 20,
  colors = ['#14b8a6', '#a855f7', '#3b82f6', '#ec4899'],
  onComplete
}: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = []
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: Date.now() + i,
          x,
          y,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: (Math.PI * 2 * i) / count,
          velocity: 3 + Math.random() * 2
        })
      }
      setParticles(newParticles)

      setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, 1000)
    }
  }, [trigger, x, y, count, colors, onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: particle.color,
              left: particle.x,
              top: particle.y,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
            }}
            animate={{
              x: Math.cos(particle.angle) * 100 * particle.velocity,
              y: Math.sin(particle.angle) * 100 * particle.velocity - 50,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook to trigger particle burst
export function useParticleBurst() {
  const [burst, setBurst] = useState({ trigger: false, x: 0, y: 0 })

  const triggerBurst = (event: React.MouseEvent) => {
    setBurst({
      trigger: true,
      x: event.clientX,
      y: event.clientY
    })

    setTimeout(() => {
      setBurst(prev => ({ ...prev, trigger: false }))
    }, 100)
  }

  return { burst, triggerBurst }
}





