'use client'

import { motion } from 'framer-motion'
import { useState, useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RippleButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export function RippleButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return

    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()

      setRipples([...ripples, { x, y, id }])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== id))
      }, 600)
    }

    onClick?.()
  }

  const variants = {
    primary: 'bg-gradient-to-r from-teal-500 to-purple-500 text-white hover:from-teal-600 hover:to-purple-600 shadow-lg hover:shadow-xl',
    secondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 shadow-md hover:shadow-lg',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden rounded-xl font-semibold',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 15, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'linear',
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}

