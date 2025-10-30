'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function PlayfulBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)',
          left: -100,
          top: -100,
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(167, 79, 139, 0.4) 0%, transparent 70%)',
          right: -100,
          top: '30%',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(83, 128, 179, 0.4) 0%, transparent 70%)',
          left: '40%',
          bottom: -100,
        }}
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-teal-500/30 dark:bg-teal-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid pattern with parallax */}
      <motion.div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          x: mousePosition.x * 0.01,
          y: mousePosition.y * 0.01,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />

      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-purple-500/5 dark:from-teal-500/10 dark:via-transparent dark:to-purple-500/10" />
    </div>
  )
}

