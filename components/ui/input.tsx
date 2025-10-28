'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  icon?: 'search' | 'none'
  showPasswordToggle?: boolean
  variant?: 'default' | 'filled' | 'outlined'
  isDark?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    success, 
    icon = 'none', 
    showPasswordToggle = false,
    variant = 'default',
    isDark = true,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const inputType = type === 'password' && showPassword ? 'text' : type

    const baseStyles = cn(
      'flex w-full px-4 py-3 text-sm font-medium transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'placeholder:transition-opacity placeholder:duration-300',
      isDark ? 'focus:ring-offset-black' : 'focus:ring-offset-white'
    )

    const variantStyles = {
      default: cn(
        'rounded-xl border backdrop-blur-xl',
        isDark
          ? 'border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/40 focus:bg-white/[0.05] focus:border-white/20 focus:ring-white/20'
          : 'border-gray-200 bg-white/70 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#5380b3]/30 focus:ring-[#5380b3]/20'
      ),
      filled: cn(
        'rounded-xl border-0',
        isDark
          ? 'bg-white/10 text-white placeholder:text-white/40 focus:bg-white/15 focus:ring-white/30'
          : 'bg-gray-100 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50 focus:ring-[#5380b3]/20'
      ),
      outlined: cn(
        'rounded-xl border-2 bg-transparent',
        isDark
          ? 'border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/30'
          : 'border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#5380b3] focus:ring-[#5380b3]/20'
      )
    }

    const errorStyles = error ? cn(
      'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
      isDark ? 'text-red-400' : 'text-red-600'
    ) : ''

    const successStyles = success && !error ? cn(
      'border-green-500/50 focus:border-green-500 focus:ring-green-500/20'
    ) : ''

    return (
      <div className="relative space-y-2">
        {label && (
          <motion.label
            className={cn(
              'block text-sm font-medium mb-2 transition-colors',
              isDark ? 'text-gray-300' : 'text-gray-700',
              isFocused && (isDark ? 'text-white' : 'text-gray-900')
            )}
            animate={{ 
              y: isFocused || hasValue ? -2 : 0,
              fontSize: isFocused || hasValue ? '0.75rem' : '0.875rem'
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          {/* Search icon */}
          {icon === 'search' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className={cn(
                'w-4 h-4 transition-colors',
                isDark ? 'text-white/40' : 'text-gray-400'
              )} />
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              baseStyles,
              variantStyles[variant],
              errorStyles,
              successStyles,
              icon === 'search' && 'pl-10',
              showPasswordToggle && type === 'password' && 'pr-10',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false)
              setHasValue(!!e.target.value)
            }}
            {...props}
          />

          {/* Focus indicator line */}
          <motion.div
            className={cn(
              'absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r rounded-full',
              isDark
                ? 'from-[#5380b3] via-[#a74f8b] to-[#e0874e]'
                : 'from-[#5380b3] to-[#a74f8b]'
            )}
            initial={{ width: 0, x: '-50%' }}
            animate={{
              width: isFocused ? '100%' : 0,
              x: '-50%'
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Password toggle */}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors',
                isDark
                  ? 'hover:bg-white/10 text-white/60 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              )}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Status icons */}
          <AnimatePresence>
            {(error || success) && (
              <motion.div
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {error ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error/Success message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'text-xs font-medium',
                isDark ? 'text-red-400' : 'text-red-600'
              )}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea variant
export const Textarea = forwardRef<HTMLTextAreaElement, 
  InputHTMLAttributes<HTMLTextAreaElement> & { 
    label?: string
    error?: string
    isDark?: boolean 
  }
>(({ className, label, error, isDark = true, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative space-y-2">
      {label && (
        <label className={cn(
          'block text-sm font-medium mb-2',
          isDark ? 'text-gray-300' : 'text-gray-700'
        )}>
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          ref={ref}
          className={cn(
            'flex w-full rounded-xl border backdrop-blur-xl px-4 py-3 text-sm font-medium',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300',
            'min-h-[100px] resize-y',
            isDark
              ? 'border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/40 focus:bg-white/[0.05] focus:border-white/20 focus:ring-white/20 focus:ring-offset-black'
              : 'border-gray-200 bg-white/70 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#5380b3]/30 focus:ring-[#5380b3]/20 focus:ring-offset-white',
            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        <motion.div
          className={cn(
            'absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r rounded-full',
            isDark
              ? 'from-[#5380b3] via-[#a74f8b] to-[#e0874e]'
              : 'from-[#5380b3] to-[#a74f8b]'
          )}
          initial={{ width: 0, x: '-50%' }}
          animate={{
            width: isFocused ? '100%' : 0,
            x: '-50%'
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'text-xs font-medium',
              isDark ? 'text-red-400' : 'text-red-600'
            )}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
})

Textarea.displayName = 'Textarea'
