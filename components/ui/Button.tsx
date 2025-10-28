'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-medium rounded-lg overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
  {
    variants: {
      variant: {
        primary: 'bg-teal-500/20 text-teal-300 border border-teal-400/30 hover:bg-teal-500/30 hover:border-teal-400/50 focus:ring-teal-400/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]',
        secondary: 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:border-white/20 focus:ring-white/30',
        ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5 focus:ring-white/20',
        danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 focus:ring-red-500/30',
        gradient: 'bg-gradient-to-r from-[#5380b3] to-[#a74f8b] text-white hover:shadow-[0_0_30px_rgba(167,79,139,0.4)] focus:ring-purple-500/50'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3',
        xl: 'px-8 py-4 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

type MotionButtonProps = HTMLMotionProps<"button"> & ButtonHTMLAttributes<HTMLButtonElement>

export interface ButtonProps
  extends MotionButtonProps,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  ripple?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ripple = true, ...props }, ref) => {
    const MotionButton = motion.button

    return (
      <MotionButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Ripple effect on hover */}
        {ripple && !disabled && !isLoading && (
          <motion.span
            className="absolute inset-0 rounded-lg"
            initial={{ opacity: 0 }}
            whileHover={{ 
              opacity: 1,
              background: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)"
            }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Shimmer effect for gradient variant */}
        {variant === 'gradient' && !disabled && !isLoading && (
          <motion.span
            className="absolute inset-0 opacity-0 hover:opacity-100"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['200% 0%', '-200% 0%'],
            }}
            transition={{
              duration: 1.5,
              ease: "linear",
              repeat: Infinity,
            }}
          />
        )}

        {/* Content wrapper for z-index */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "linear", repeat: Infinity }}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </motion.div>
          ) : null}
          {children}
        </span>
      </MotionButton>
    )
  }
)

Button.displayName = 'Button'


