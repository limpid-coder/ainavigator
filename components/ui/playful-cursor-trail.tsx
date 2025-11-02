'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Trail {
  id: number
  x: number
  y: number
}

export function PlayfulCursorTrail({ enabled = false }: { enabled?: boolean }) {
  const [trails, setTrails] = useState<Trail[]>([])

  useEffect(() => {
    if (!enabled) return

    let trailId = 0

    const handleMouseMove = (e: MouseEvent) => {
      const newTrail: Trail = {
        id: trailId++,
        x: e.clientX,
        y: e.clientY
      }

      setTrails(prev => [...prev.slice(-15), newTrail])
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {trails.map((trail, index) => (
          <motion.div
            key={trail.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: trail.x,
              top: trail.y,
              background: `hsl(${(index * 20) % 360}, 70%, 60%)`,
            }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}


