'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Moon, Building2, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppHeaderProps {
  variant?: 'landing' | 'app'
  isDarkMode?: boolean
  onToggleDarkMode?: () => void
  companyName?: string
}

export function AppHeader({ 
  variant = 'landing', 
  isDarkMode = true, 
  onToggleDarkMode,
  companyName 
}: AppHeaderProps) {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const landingNavItems = [
    { name: 'Framework', href: '#framework' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Demo', href: '/demo' },
  ]

  const appNavItems = [
    { name: 'Dashboard', href: '/assessment' },
    { name: 'Demo', href: '/demo' },
  ]

  const navItems = variant === 'landing' ? landingNavItems : appNavItems

  return (
    <>
      <motion.nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          variant === 'landing' ? "px-4 md:px-6 pt-4 md:pt-6" : "px-4 md:px-6 py-3"
        )}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={cn(
          "max-w-7xl mx-auto",
          variant === 'landing' && "px-4 md:px-6"
        )}>
          <div className={cn(
            "relative backdrop-blur-2xl border transition-all duration-300",
            variant === 'landing' 
              ? "rounded-[24px] md:rounded-[28px] px-4 md:px-6 py-2.5 md:py-3"
              : "rounded-[20px] px-4 md:px-6 py-2.5",
            isDarkMode 
              ? 'bg-black/40 border-white/[0.08] shadow-2xl shadow-black/20' 
              : 'bg-white/70 border-gray-200/80 shadow-lg',
            isScrolled && variant === 'landing' && (
              isDarkMode 
                ? 'bg-black/60 border-white/[0.12]' 
                : 'bg-white/90 border-gray-300'
            )
          )}>
            {/* Subtle gradient overlay */}
            <div className={cn(
              "absolute inset-0 pointer-events-none",
              variant === 'landing' ? "rounded-[28px]" : "rounded-[20px]",
              isDarkMode 
                ? 'bg-gradient-to-b from-white/[0.03] to-transparent' 
                : 'bg-gradient-to-b from-white/50 to-transparent'
            )} />
          
            <div className="relative flex items-center justify-between">
              {/* Logo & Brand */}
              <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                <motion.img 
                  src="/LeadingwithAI-removebg-preview.png" 
                  alt="AI Navigator" 
                  className="w-8 h-8 md:w-10 md:h-10 object-contain transition-all duration-300"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                />
                <div className="flex flex-col">
                  <span className={cn(
                    "font-semibold text-[15px] md:text-[17px] tracking-tight",
                    isDarkMode ? "text-white" : "text-gray-900"
                  )}>
                    AI Navigator
                  </span>
                  {companyName && variant === 'app' && (
                    <span className={cn(
                      "text-[11px] tracking-tight",
                      isDarkMode ? "text-white/60" : "text-gray-600"
                    )}>
                      {companyName}
                    </span>
                  )}
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href.startsWith('#') && pathname === '/')
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "relative text-[14px] font-medium px-4 py-2 rounded-xl transition-all duration-300",
                        isDarkMode
                          ? isActive 
                            ? 'text-white bg-white/[0.1]'
                            : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                          : isActive
                            ? 'text-gray-900 bg-black/[0.06]'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-black/[0.03]'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navIndicator"
                          className={cn(
                            "absolute inset-0 rounded-xl",
                            isDarkMode ? "bg-white/[0.08]" : "bg-black/[0.04]"
                          )}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{item.name}</span>
                    </Link>
                  )
                })}
                
                <div className={cn(
                  "mx-2 w-px h-6",
                  isDarkMode ? 'bg-white/10' : 'bg-gray-200'
                )} />
                
                {/* Sign In Button */}
                <Link href="/login">
                  <motion.button
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold transition-all duration-300 border",
                      isDarkMode 
                        ? "bg-white/[0.08] text-white hover:bg-white/[0.12] border-white/[0.08] hover:border-white/[0.15]"
                        : "bg-black/[0.04] text-gray-900 hover:bg-black/[0.08] border-gray-200 hover:border-gray-300"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Building2 size={16} strokeWidth={2} />
                    <span>Sign In</span>
                  </motion.button>
                </Link>
                
                {/* Theme Toggle */}
                {onToggleDarkMode && (
                  <motion.button
                    onClick={onToggleDarkMode}
                    className={cn(
                      "p-2 rounded-xl transition-all duration-300",
                      isDarkMode 
                        ? "bg-white/[0.06] hover:bg-white/[0.10] text-white" 
                        : "bg-black/[0.03] hover:bg-black/[0.06] text-gray-900"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle theme"
                  >
                    <AnimatePresence mode="wait">
                      {isDarkMode ? (
                        <motion.div
                          key="sun"
                          initial={{ rotate: -90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Sun size={18} strokeWidth={2} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon"
                          initial={{ rotate: 90, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -90, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Moon size={18} strokeWidth={2} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "md:hidden p-2 rounded-xl transition-all",
                  isDarkMode 
                    ? "bg-white/[0.06] hover:bg-white/[0.10] text-white" 
                    : "bg-black/[0.03] hover:bg-black/[0.06] text-gray-900"
                )}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              className={cn(
                "absolute top-20 left-4 right-4 rounded-3xl p-6 border",
                isDarkMode 
                  ? 'bg-black/95 border-white/[0.08]' 
                  : 'bg-white/95 border-gray-200'
              )}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-[15px] font-medium transition-all",
                      isDarkMode
                        ? 'text-white/90 hover:bg-white/[0.08] active:bg-white/[0.12]'
                        : 'text-gray-900 hover:bg-black/[0.04] active:bg-black/[0.08]'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className={cn(
                  "my-2 h-px",
                  isDarkMode ? 'bg-white/10' : 'bg-gray-200'
                )} />
                
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl text-[15px] font-semibold transition-all border",
                    isDarkMode 
                      ? "bg-white/[0.08] text-white border-white/[0.08]"
                      : "bg-black/[0.04] text-gray-900 border-gray-200"
                  )}
                >
                  <Building2 size={18} />
                  <span>Sign In</span>
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

