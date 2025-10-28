'use client'

import { motion, AnimatePresence, HTMLMotionProps, Variants } from 'framer-motion'
import { ReactNode, forwardRef } from 'react'

// Reusable animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
}

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
}

export const scaleSpring: Variants = {
  initial: { scale: 0 },
  animate: { 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  exit: { 
    scale: 0,
    transition: {
      duration: 0.2
    }
  }
}

export const blurIn: Variants = {
  initial: { 
    opacity: 0, 
    filter: 'blur(10px)'
  },
  animate: { 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  exit: { 
    opacity: 0, 
    filter: 'blur(10px)',
    transition: {
      duration: 0.4
    }
  }
}

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  variant?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight' | 'scaleSpring' | 'blurIn'
  delay?: number
  duration?: number
  className?: string
  stagger?: boolean
}

const variantMap = {
  fadeInUp,
  fadeInScale,
  slideInLeft,
  slideInRight,
  scaleSpring,
  blurIn
}

export const MotionWrapper = forwardRef<HTMLDivElement, MotionWrapperProps>(
  ({ children, variant = 'fadeInUp', delay = 0, duration, className, stagger = false, ...props }, ref) => {
    const selectedVariant = variantMap[variant]
    
    const customVariants: Variants = selectedVariant

    if (stagger) {
      return (
        <motion.div
          ref={ref}
          className={className}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          exit="exit"
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={customVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

MotionWrapper.displayName = 'MotionWrapper'

// Page transition wrapper
export const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={Math.random()} // Force remount for page transitions
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1]
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -20,
          transition: {
            duration: 0.3,
            ease: [0.4, 0, 1, 1]
          }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Hover animations
export const HoverScale = ({ children, scale = 1.05, className }: { 
  children: ReactNode
  scale?: number
  className?: string 
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  )
}

// Float animation for decorative elements
export const FloatingElement = ({ children, className, delay = 0 }: {
  children: ReactNode
  className?: string
  delay?: number
}) => {
  return (
    <motion.div
      className={className}
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  )
}
