'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronRight } from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon?: React.ReactNode
  badge?: string | number
}

interface NavbarProps {
  logo?: React.ReactNode
  title?: string
  items: NavItem[]
  actions?: React.ReactNode
  isDark?: boolean
  variant?: 'floating' | 'fixed' | 'transparent'
  className?: string
}

export function Navbar({
  logo,
  title,
  items,
  actions,
  isDark = true,
  variant = 'floating',
  className
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  
  // Transform scroll position to navbar styles
  const navbarOpacity = useTransform(scrollY, [0, 50], [0.8, 1])
  const navbarBlur = useTransform(scrollY, [0, 50], [20, 30])
  const navbarScale = useTransform(scrollY, [0, 50], [1, 0.98])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const baseStyles = cn(
    'transition-all duration-500',
    isDark ? 'text-white' : 'text-gray-900'
  )

  const variantStyles = {
    floating: cn(
      'fixed top-4 left-4 right-4 z-50 rounded-2xl border',
      'shadow-2xl',
      isDark
        ? 'bg-black/40 border-white/[0.08] backdrop-blur-2xl'
        : 'bg-white/70 border-gray-200 backdrop-blur-2xl',
      isScrolled && 'top-2 scale-[0.99]'
    ),
    fixed: cn(
      'fixed top-0 left-0 right-0 z-50 border-b',
      isDark
        ? 'bg-black/80 border-white/[0.08] backdrop-blur-2xl'
        : 'bg-white/90 border-gray-200 backdrop-blur-xl'
    ),
    transparent: cn(
      'fixed top-0 left-0 right-0 z-50',
      isScrolled
        ? isDark
          ? 'bg-black/60 backdrop-blur-2xl border-b border-white/[0.08]'
          : 'bg-white/60 backdrop-blur-2xl border-b border-gray-200'
        : 'bg-transparent'
    )
  }

  return (
    <>
      <motion.nav
        className={cn(baseStyles, variantStyles[variant], className)}
        style={variant === 'floating' ? {
          opacity: navbarOpacity,
          scale: navbarScale,
        } : {}}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={cn(
          'relative px-4 md:px-6',
          variant === 'floating' ? 'py-3' : 'py-4'
        )}>
          {/* Glass overlay effect */}
          <div className={cn(
            'absolute inset-0 rounded-2xl pointer-events-none',
            variant === 'floating' && 'bg-gradient-to-b from-white/[0.03] to-transparent'
          )} />

          <div className="relative flex items-center justify-between">
            {/* Logo & Title */}
            <Link href="/" className="flex items-center gap-3 group">
              {logo && (
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {logo}
                </motion.div>
              )}
              {title && (
                <motion.span
                  className="font-semibold text-base md:text-lg tracking-tight"
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {title}
                </motion.span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {items.map((item, index) => {
                const isActive = pathname === item.href
                
                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <motion.button
                        className={cn(
                          'relative px-4 py-2 rounded-xl text-sm font-medium',
                          'transition-all duration-300',
                          isActive
                            ? isDark
                              ? 'text-white'
                              : 'text-gray-900'
                            : isDark
                              ? 'text-white/70 hover:text-white'
                              : 'text-gray-600 hover:text-gray-900'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Active indicator */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              className={cn(
                                'absolute inset-0 rounded-xl',
                                isDark
                                  ? 'bg-white/10'
                                  : 'bg-gray-100'
                              )}
                              layoutId="navbar-active"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                type: 'spring',
                                stiffness: 500,
                                damping: 30
                              }}
                            />
                          )}
                        </AnimatePresence>

                        {/* Content */}
                        <span className="relative z-10 flex items-center gap-2">
                          {item.icon}
                          {item.name}
                          {item.badge && (
                            <motion.span
                              className={cn(
                                'px-1.5 py-0.5 text-[10px] font-bold rounded-md',
                                isDark
                                  ? 'bg-teal-500/20 text-teal-400'
                                  : 'bg-teal-500/10 text-teal-600'
                              )}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 500 }}
                            >
                              {item.badge}
                            </motion.span>
                          )}
                        </span>

                        {/* Hover effect */}
                        <motion.div
                          className={cn(
                            'absolute inset-0 rounded-xl opacity-0',
                            isDark
                              ? 'bg-gradient-to-r from-white/5 to-white/10'
                              : 'bg-gradient-to-r from-gray-50 to-gray-100'
                          )}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                    </motion.div>
                  </Link>
                )
              })}

              {actions && (
                <>
                  <div className={cn(
                    'mx-3 w-px h-6',
                    isDark ? 'bg-white/10' : 'bg-gray-200'
                  )} />
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: items.length * 0.05 + 0.1 }}
                  >
                    {actions}
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={cn(
                'md:hidden p-2 rounded-xl transition-colors',
                isDark
                  ? 'hover:bg-white/10'
                  : 'hover:bg-gray-100'
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className={cn(
                'fixed right-0 top-0 bottom-0 z-50 w-72',
                'md:hidden',
                isDark
                  ? 'bg-black/90 backdrop-blur-2xl border-l border-white/[0.08]'
                  : 'bg-white/90 backdrop-blur-2xl border-l border-gray-200'
              )}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6 space-y-6">
                {/* Close button */}
                <div className="flex justify-end">
                  <motion.button
                    className={cn(
                      'p-2 rounded-xl',
                      isDark
                        ? 'hover:bg-white/10'
                        : 'hover:bg-gray-100'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Mobile Navigation Items */}
                <nav className="space-y-2">
                  {items.map((item, index) => {
                    const isActive = pathname === item.href
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <motion.div
                            className={cn(
                              'flex items-center justify-between',
                              'px-4 py-3 rounded-xl',
                              'transition-colors',
                              isActive
                                ? isDark
                                  ? 'bg-white/10 text-white'
                                  : 'bg-gray-100 text-gray-900'
                                : isDark
                                  ? 'hover:bg-white/5 text-white/70'
                                  : 'hover:bg-gray-50 text-gray-600'
                            )}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="flex items-center gap-3">
                              {item.icon}
                              <span className="font-medium">{item.name}</span>
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>

                {/* Mobile Actions */}
                {actions && (
                  <div className={cn(
                    'pt-6 border-t',
                    isDark ? 'border-white/[0.08]' : 'border-gray-200'
                  )}>
                    {actions}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
