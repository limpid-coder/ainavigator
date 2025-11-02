'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'
import { cn } from '@/lib/utils'

interface HoverCard3DProps {
  children: ReactNode
  className?: string
  intensity?: number
  onClick?: () => void
}

export function HoverCard3D({ 
  children, 
  className,
  intensity = 15,
  onClick 
}: HoverCard3DProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { damping: 20, stiffness: 200 })
  const mouseYSpring = useSpring(y, { damping: 20, stiffness: 200 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.03, z: 50 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative rounded-2xl transition-shadow duration-300',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div style={{ transform: 'translateZ(20px)' }} className="relative">
        {children}
      </div>

      {/* Shine overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: useTransform(
            [mouseXSpring, mouseYSpring],
            ([x, y]) =>
              `radial-gradient(circle at ${(x as number + 0.5) * 100}% ${
                (y as number + 0.5) * 100
              }%, rgba(255,255,255,0.15) 0%, transparent 50%)`
          ),
        }}
      />
    </motion.div>
  )
}





