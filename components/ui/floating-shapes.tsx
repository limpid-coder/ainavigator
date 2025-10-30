'use client'

import { motion } from 'framer-motion'

export function FloatingShapes() {
  const shapes = [
    { size: 60, color: 'teal', left: '10%', top: '20%', duration: 20, delay: 0 },
    { size: 40, color: 'purple', right: '15%', top: '30%', duration: 25, delay: 2 },
    { size: 50, color: 'blue', left: '70%', bottom: '25%', duration: 22, delay: 4 },
    { size: 35, color: 'orange', right: '30%', bottom: '20%', duration: 18, delay: 1 },
    { size: 45, color: 'teal', left: '25%', bottom: '30%', duration: 24, delay: 3 },
  ]

  const getColor = (color: string) => {
    const colors = {
      teal: 'from-teal-400/20 to-teal-600/20 dark:from-teal-400/10 dark:to-teal-600/10',
      purple: 'from-purple-400/20 to-purple-600/20 dark:from-purple-400/10 dark:to-purple-600/10',
      blue: 'from-blue-400/20 to-blue-600/20 dark:from-blue-400/10 dark:to-blue-600/10',
      orange: 'from-orange-400/20 to-orange-600/20 dark:from-orange-400/10 dark:to-orange-600/10',
    }
    return colors[color as keyof typeof colors]
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${getColor(shape.color)} blur-2xl`}
          style={{
            width: shape.size,
            height: shape.size,
            ...('left' in shape ? { left: shape.left } : { right: shape.right }),
            ...('top' in shape ? { top: shape.top } : { bottom: shape.bottom }),
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

