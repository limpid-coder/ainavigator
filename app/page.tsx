"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Sun, Moon, Brain, ArrowRight, Sparkles, Shield, Check, X, Building2, ChevronRight, BarChart3, Target, Zap, Clock, AlertTriangle, TrendingUp, Users, Layers, FileText, Lock, Globe, Database, Award, Hexagon, Activity, ArrowUpRight, Cpu } from "lucide-react"
import Link from 'next/link'

// Company demo data schema
const COMPANY_ACCESS_CODES = {
  "TECH2024": {
    name: "TechCorp Industries",
    industry: "Technology",
    size: "5000+ employees",
    contact: "Sarah Chen",
    role: "Chief Innovation Officer",
    challenges: ["AI Strategy", "Data Infrastructure", "Talent Gap"],
    readiness: 67
  },
  "FINX2024": {
    name: "Global Finance Partners",
    industry: "Financial Services", 
    size: "10000+ employees",
    contact: "Michael Thompson",
    role: "VP of Digital Transformation",
    challenges: ["Regulatory Compliance", "Legacy Systems", "Risk Management"],
    readiness: 78
  },
  "HEALTH24": {
    name: "MedTech Solutions",
    industry: "Healthcare",
    size: "2500+ employees",
    contact: "Dr. Emily Rodriguez",
    role: "Director of AI Innovation",
    challenges: ["Patient Data Privacy", "Clinical Integration", "ROI Measurement"],
    readiness: 72
  },
  "RETAIL24": {
    name: "OmniCommerce Group",
    industry: "Retail",
    size: "15000+ employees",
    contact: "James Park",
    role: "CTO",
    challenges: ["Customer Personalization", "Supply Chain", "Fraud Detection"],
    readiness: 81
  },
  "DEMO2024": {
    name: "Demo Company",
    industry: "Multi-Industry",
    size: "1000+ employees",
    contact: "Alex Demo",
    role: "Innovation Lead",
    challenges: ["General AI Adoption", "Strategy Development", "Implementation"],
    readiness: 75
  }
}

// Custom Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { isDark?: boolean }>(
  ({ className, type, isDark = true, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-12 w-full rounded-2xl border backdrop-blur-2xl px-5 py-3 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
          isDark
            ? 'border-white/[0.06] bg-white/[0.03] text-white placeholder:text-white/40 focus:ring-white/20 focus:ring-offset-black focus:bg-white/[0.05] focus:border-white/20'
            : 'border-gray-200 bg-white/70 text-gray-900 placeholder:text-gray-400 focus:ring-[#5380b3]/20 focus:ring-offset-white focus:bg-white focus:border-[#5380b3]/30'
        } ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

// Custom Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { isDark?: boolean, variant?: 'primary' | 'secondary' }>(
  ({ className, children, isDark = true, variant = 'primary', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-[15px] font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] h-12 px-8"
    
    const variants = {
      primary: isDark
        ? 'bg-white text-black hover:bg-white/90 focus:ring-white/50 focus:ring-offset-black shadow-xl'
        : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900/50 focus:ring-offset-white shadow-xl',
      secondary: isDark
        ? 'bg-white/[0.06] text-white hover:bg-white/[0.10] focus:ring-white/30 focus:ring-offset-black border border-white/[0.08]'
        : 'bg-black/[0.03] text-gray-900 hover:bg-black/[0.06] focus:ring-gray-900/20 focus:ring-offset-white border border-gray-200'
    }
    
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export default function Home() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [accessCode, setAccessCode] = useState("")
  const [showCompanyLogin, setShowCompanyLogin] = useState(false)
  const [companyData, setCompanyData] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [codeError, setCodeError] = useState("")
  const [activeTab, setActiveTab] = useState('sentiment')
  const [isMounted, setIsMounted] = useState(false)
  
  // Calculate time until Web Summit - Nov 12, 2025 CET
  const calculateTimeLeft = () => {
    const webSummitDate = new Date('2025-11-12T09:00:00+01:00')
    const now = new Date()
    const difference = webSummitDate.getTime() - now.getTime()
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  // Set mounted state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      console.log("Email submitted:", email)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail("")
      }, 3000)
    }
  }

  const handleAccessCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    setCodeError("")
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const company = COMPANY_ACCESS_CODES[accessCode.toUpperCase() as keyof typeof COMPANY_ACCESS_CODES]
    
    if (company) {
      setCompanyData(company)
      setIsValidating(false)
      
      setTimeout(() => {
        sessionStorage.setItem('companyAccess', JSON.stringify(company))
        window.location.href = "/dashboard"
      }, 2000)
    } else {
      setCodeError("Invalid access code. Please check and try again.")
      setIsValidating(false)
    }
  }

  const bgColor = isDarkMode ? "bg-black" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-900"
  const subTextColor = isDarkMode ? "text-white/60" : "text-gray-500"

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Demo', href: '/demo' },
  ]

  return (
    <main className={`relative min-h-screen ${bgColor} w-full transition-all duration-500`}>
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-black/[0.02] via-transparent to-transparent'
        }`} />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Navigation Bar - iOS Style */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className={`relative ${
              isDarkMode 
                ? 'bg-black/40 border-white/[0.06] shadow-2xl' 
                : 'bg-white/70 border-gray-200 shadow-lg'
            } backdrop-blur-xl border rounded-[28px] px-6 py-3`}>
              <div className={`absolute inset-0 rounded-[28px] ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-white/[0.03] to-transparent' 
                  : 'bg-gradient-to-b from-white/50 to-transparent'
              } pointer-events-none`} />
              
              <div className="relative flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className={`p-2 rounded-2xl ${isDarkMode ? 'bg-white/[0.06]' : 'bg-black/[0.03]'} transition-all duration-300 group-hover:scale-105`}>
                    <Brain className="w-6 h-6 text-[#5380b3]" strokeWidth={2} />
            </div>
                  <span className={`font-semibold text-[17px] tracking-tight ${textColor}`}>AI Navigator</span>
              </Link>
                
                <div className="hidden md:flex items-center gap-1">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`text-[14px] font-medium px-5 py-2.5 rounded-2xl transition-all duration-300 ${
                        isDarkMode
                          ? 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-black/[0.03]'
                      }`}
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  <div className={`mx-3 w-px h-6 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                  
                  <button
                    onClick={() => setShowCompanyLogin(true)}
                    className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[14px] font-semibold transition-all duration-300 ${
                      isDarkMode 
                        ? "bg-white/[0.08] text-white hover:bg-white/[0.12] border border-white/[0.08]"
                        : "bg-black/[0.04] text-gray-900 hover:bg-black/[0.08] border border-gray-200"
                    }`}
                  >
                    <Building2 size={16} strokeWidth={2} />
                    <span>Company</span>
                  </button>
                  
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`p-2.5 rounded-2xl transition-all duration-300 ${
                      isDarkMode 
                        ? "bg-white/[0.06] hover:bg-white/[0.10] text-white" 
                        : "bg-black/[0.03] hover:bg-black/[0.06] text-gray-900"
                    }`}
                  >
                    {isDarkMode ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
                  </button>
                </div>
            </div>
          </div>
        </div>
      </nav>

        {/* Company Login Modal */}
        {showCompanyLogin && (
          <div className={`fixed inset-0 z-[60] flex items-center justify-center p-6 ${
            isDarkMode ? 'bg-black/60' : 'bg-white/80'
          } backdrop-blur-2xl animate-in fade-in duration-300`}>
            <div className={`relative w-full max-w-md ${
              isDarkMode 
                ? 'bg-black/40 border-white/[0.06] shadow-2xl'
                : 'bg-white/90 border-gray-200 shadow-xl'
            } backdrop-blur-xl border rounded-[32px] p-10 animate-in zoom-in-95 duration-300`}>
              <div className={`absolute inset-0 rounded-[32px] pointer-events-none ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-white/[0.03] to-transparent' 
                  : 'bg-gradient-to-b from-white/50 to-transparent'
              }`} />
              
              {!companyData ? (
                <>
                  <button
                    onClick={() => {
                      setShowCompanyLogin(false)
                      setCodeError("")
                      setAccessCode("")
                    }}
                    className={`absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-white/[0.06] hover:bg-white/[0.10] text-white/60'
                        : 'bg-black/[0.03] hover:bg-black/[0.06] text-gray-500'
                    }`}
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                  
                  <div className="relative">
                    <div className="text-center mb-10">
                      <div className={`w-16 h-16 mx-auto mb-5 rounded-[24px] flex items-center justify-center ${
                        isDarkMode
                          ? 'bg-white/[0.06] border border-white/[0.08]'
                          : 'bg-black/[0.03] border border-gray-200'
                      }`}>
                        <Building2 className="w-8 h-8 text-[#5380b3]" strokeWidth={1.5} />
                      </div>
                      <h3 className={`text-[24px] font-semibold tracking-tight ${textColor}`}>Company Access</h3>
                      <p className={`text-[14px] mt-2 ${subTextColor}`}>Enter your organization code</p>
                    </div>

                    <form onSubmit={handleAccessCode}>
                      <div className="space-y-5">
                        <div>
                          <label className={`text-[11px] uppercase tracking-wider mb-3 block font-semibold ${subTextColor}`}>
                            Access Code
                          </label>
                          <Input
                            type="text"
                            value={accessCode}
                            onChange={(e) => {
                              setAccessCode(e.target.value.toUpperCase())
                              setCodeError("")
                            }}
                            placeholder="XXXX-2024"
                            className={`font-mono text-center text-[18px] tracking-[0.2em] h-14 ${
                              codeError ? "border-red-500/50 focus:ring-red-500/30" : ""
                            }`}
                            disabled={isValidating}
                            isDark={isDarkMode}
                          />
                          {codeError && (
                            <p className="text-[13px] text-red-500 mt-3 text-center font-medium animate-in slide-in-from-top-1">
                              {codeError}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={!accessCode || isValidating}
                          className="w-full h-14 text-[16px] font-semibold rounded-[24px]"
                          isDark={isDarkMode}
                          variant="primary"
                        >
                          {isValidating ? (
                            <span className="flex items-center gap-3">
                              <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                              Validating...
                            </span>
                          ) : (
                            "Access Dashboard"
                          )}
                        </Button>
                      </div>
                    </form>

                    <div className={`mt-8 pt-8 ${isDarkMode ? 'border-t border-white/[0.06]' : 'border-t border-gray-200'}`}>
                      <p className={`text-[11px] text-center font-medium mb-4 uppercase tracking-wider ${subTextColor}`}>
                        Demo Codes
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {Object.keys(COMPANY_ACCESS_CODES).map(code => (
                          <button
                            key={code}
                            onClick={() => setAccessCode(code)}
                            className={`text-[12px] px-4 py-2 rounded-full transition-all duration-300 font-medium ${
                              isDarkMode
                                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white'
                                : 'bg-black/[0.02] hover:bg-black/[0.04] text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {code}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative text-center">
                  <div className={`w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center ${
                    isDarkMode
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-green-500/10 border border-green-500/30'
                  }`}>
                    <Check className="w-12 h-12 text-green-500" strokeWidth={2} />
                  </div>
                  
                  <h3 className={`text-[28px] font-light mb-3 tracking-tight ${textColor}`}>
                    Welcome Back
                  </h3>
                  <p className={`text-[18px] font-medium mb-2 ${textColor}`}>
                    {companyData.contact}
                  </p>
                  <p className={`text-[14px] mb-8 ${subTextColor}`}>
                    {companyData.role} · {companyData.name}
                  </p>
                  
                  <div className={`p-6 rounded-[24px] mb-8 ${
                    isDarkMode
                      ? 'bg-white/[0.03] border border-white/[0.06]'
                      : 'bg-black/[0.02] border border-gray-200'
                  }`}>
                    <p className={`text-[11px] mb-3 uppercase tracking-wider font-semibold ${subTextColor}`}>
                      AI Readiness Score
                    </p>
                    <div className="text-[48px] font-light tracking-tight text-[#5380b3]">
                      {companyData.readiness}%
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#5380b3] animate-pulse" />
                    <p className={`text-[14px] ${subTextColor}`}>
                      Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hero Section - Compact & Refined */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-24">
          <div className="w-full max-w-xl">
            <div className={`relative ${
              isDarkMode 
                ? 'bg-black/20 border-white/[0.06]' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-xl border rounded-[32px] p-10 shadow-2xl`}>
              <div className={`absolute inset-0 rounded-[32px] pointer-events-none ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-white/[0.02] to-transparent' 
                  : 'bg-gradient-to-b from-white/30 to-transparent'
              }`} />
              
              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 ${
                        isDarkMode
                          ? 'bg-white/[0.04] border border-white/[0.06]'
                          : 'bg-black/[0.02] border border-gray-200'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5 text-[#5380b3]" strokeWidth={2} />
                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${subTextColor}`}>
                          AI Readiness
                        </span>
            </div>

                      <h1 className={`text-[42px] font-light ${textColor} mb-4 tracking-[-0.02em] leading-[1.05]`}>
                        Transform Your<br />
                        <span className="font-normal bg-gradient-to-r from-[#5380b3] via-[#7a6ca8] to-[#a74f8b] bg-clip-text text-transparent">
                AI Journey
              </span>
            </h1>
                      <p className={`${subTextColor} text-[15px] leading-relaxed max-w-sm mx-auto`}>
                        Data-driven insights to navigate enterprise AI transformation
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-6">
                      <div className="flex gap-3">
                        <Input
                          type="email"
                          placeholder="your@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1"
                          isDark={isDarkMode}
                        />
                        <Button
                          type="submit"
                          isDark={isDarkMode}
                          variant="primary"
                        >
                          Join Waitlist
                        </Button>
                      </div>
                    </form>

                    <div className="text-center">
                      <p className={`text-[12px] font-semibold mb-3 ${isDarkMode ? 'text-[#5380b3]' : 'text-[#5380b3]'}`}>
                        Web Summit 2025 · Lisbon
                      </p>
                      {!isMounted ? (
                        <div className="h-[50px]" />
                      ) : (
                        <div className="flex items-center justify-center gap-4 text-[13px]">
                          {[
                            { value: timeLeft.days, label: 'D' },
                            { value: String(timeLeft.hours).padStart(2, '0'), label: 'H' },
                            { value: String(timeLeft.minutes).padStart(2, '0'), label: 'M' },
                            { value: String(timeLeft.seconds).padStart(2, '0'), label: 'S' },
                          ].map((item, idx) => (
                            <React.Fragment key={item.label}>
                              <div className="flex items-baseline gap-1">
                                <span className={`text-[24px] font-light ${textColor} tabular-nums`}>
                                  {item.value}
                                </span>
                                <span className={`text-[10px] ${subTextColor} font-medium`}>
                                  {item.label}
                                </span>
                              </div>
                              {idx < 3 && <span className={`${subTextColor} opacity-20`}>:</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`mt-8 pt-8 text-center ${isDarkMode ? 'border-t border-white/[0.06]' : 'border-t border-gray-200'}`}>
                      <div className="flex gap-3 justify-center">
                        <Link href="/demo">
                          <button className={`text-[12px] font-medium px-4 py-2 rounded-2xl transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white'
                              : 'bg-black/[0.02] hover:bg-black/[0.04] text-gray-600 hover:text-gray-900'
                          }`}>
                            Demo
                          </button>
              </Link>
                        <Link href="/upload">
                          <button className={`text-[12px] font-medium px-4 py-2 rounded-2xl transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white'
                              : 'bg-black/[0.02] hover:bg-black/[0.04] text-gray-600 hover:text-gray-900'
                          }`}>
                            Upload
                          </button>
              </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className={`w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center ${
                      isDarkMode
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-green-500/10 border border-green-500/30'
                    }`}>
                      <Check className="w-8 h-8 text-green-500" strokeWidth={2} />
                    </div>
                    <h3 className={`text-[24px] font-light ${textColor} mb-2`}>
                      You're on the list!
                    </h3>
                    <p className={`${subTextColor} text-[14px]`}>
                      We'll notify you when we launch.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section - Two Column Wide Layout */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
                The Challenge
              </p>
              <h2 className={`text-[36px] font-light ${textColor} tracking-tight`}>
                67% of AI initiatives fail
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {[
                {
                  icon: Users,
                  title: 'Human Resistance',
                  stat: '73%',
                  statLabel: 'cite culture as barrier',
                  description: 'Teams resist change without understanding the "why" behind transformation.',
                  points: [
                    'Fear of job displacement blocks adoption',
                    'Leadership lacks visibility into team sentiment',
                    'No framework for managing emotional barriers'
                  ],
                  color: 'red'
                },
                {
                  icon: Layers,
                  title: 'Capability Gaps',
                  stat: '89%',
                  statLabel: 'lack AI expertise',
                  description: 'Organizations invest blindly without knowing their true readiness level.',
                  points: [
                    'Hidden gaps in data infrastructure',
                    'Talent shortages across critical roles',
                    'Misaligned technology investments'
                  ],
                  color: 'orange'
                }
              ].map((item) => {
                const Icon = item.icon
                
                return (
                  <div key={item.title} className={`group relative p-10 rounded-[32px] ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06]'
                      : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
                  } transition-all duration-300 hover:scale-[1.01]`}>
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        item.color === 'red'
                          ? 'bg-red-500/10 border border-red-500/20'
                          : 'bg-orange-500/10 border border-orange-500/20'
                      }`}>
                        <Icon className={`w-7 h-7 ${item.color === 'red' ? 'text-red-500' : 'text-orange-500'}`} strokeWidth={1.5} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-4">
                          <h3 className={`text-[22px] font-semibold ${textColor}`}>{item.title}</h3>
                          <div className="text-right">
                            <div className={`text-[28px] font-light ${item.color === 'red' ? 'text-red-500' : 'text-orange-500'}`}>
                              {item.stat}
                            </div>
                            <div className={`text-[10px] uppercase tracking-wider ${subTextColor}`}>
                              {item.statLabel}
                            </div>
                          </div>
                        </div>
                        
                        <p className={`${subTextColor} text-[14px] mb-6 leading-relaxed`}>
                          {item.description}
                        </p>
                        
                        <ul className="space-y-3">
                          {item.points.map(point => (
                            <li key={point} className={`text-[13px] ${subTextColor} flex items-start gap-3`}>
                              <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                                item.color === 'red' ? 'bg-red-500' : 'bg-orange-500'
                              }`} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

        {/* Features Section - Compact Cards */}
        <section id="features" className="py-20 px-6 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
          <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-[#5380b3]' : 'text-[#5380b3]'}`}>
                Capabilities
              </p>
              <h2 className={`text-[36px] font-light ${textColor} tracking-tight`}>
                Complete AI Assessment Platform
              </h2>
          </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: Target,
                  title: 'Sentiment',
                  description: '25 key dimensions of organizational readiness',
                  metric: '25',
                  metricLabel: 'dimensions'
                },
                {
                  icon: Hexagon,
                  title: 'Capability',
                  description: 'Maturity across 8 critical areas',
                  metric: '32',
                  metricLabel: 'constructs'
                },
                {
                  icon: Zap,
                  title: 'Action Plans',
                  description: 'Targeted interventions for gaps',
                  metric: '<3',
                  metricLabel: 'minutes'
                }
              ].map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className={`group p-6 rounded-[24px] ${
                    isDarkMode
                      ? 'bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06]'
                      : 'bg-gray-50 hover:bg-white border border-gray-200'
                  } transition-all duration-300`}>
                    <Icon className="w-8 h-8 text-[#5380b3] mb-4" strokeWidth={1.5} />
                    
                    <h3 className={`text-[18px] font-semibold mb-2 ${textColor}`}>{feature.title}</h3>
                    <p className={`${subTextColor} mb-4 text-[13px] leading-relaxed`}>{feature.description}</p>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-[24px] font-light text-[#5380b3]">{feature.metric}</span>
                      <span className={`text-[11px] uppercase tracking-wider ${subTextColor}`}>{feature.metricLabel}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Complete Picture Section - Enhanced Visualizations */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-[#a74f8b]' : 'text-[#a74f8b]'}`}>
                Dual Framework
              </p>
              <h2 className={`text-[42px] font-light ${textColor} mb-3 tracking-tight`}>
                See the Complete Picture
              </h2>
              <p className={`${subTextColor} text-[16px] max-w-2xl mx-auto`}>
                Combine emotional and capability insights for comprehensive understanding
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex justify-center mb-12">
              <div className={`inline-flex p-1 rounded-[24px] ${
                isDarkMode
                  ? 'bg-white/[0.04] border border-white/[0.06]'
                  : 'bg-gray-100 border border-gray-200'
              }`}>
                <button
                  onClick={() => setActiveTab('sentiment')}
                  className={`px-6 py-2.5 rounded-[20px] text-[14px] font-semibold transition-all duration-300 ${
                    activeTab === 'sentiment'
                      ? isDarkMode 
                        ? 'bg-white text-black shadow-lg' 
                        : 'bg-white text-gray-900 shadow-lg'
                      : subTextColor
                  }`}
                >
                  Sentiment Heatmap
                </button>
                <button
                  onClick={() => setActiveTab('capability')}
                  className={`px-6 py-2.5 rounded-[20px] text-[14px] font-semibold transition-all duration-300 ${
                    activeTab === 'capability'
                      ? isDarkMode 
                        ? 'bg-white text-black shadow-lg' 
                        : 'bg-white text-gray-900 shadow-lg'
                      : subTextColor
                  }`}
                >
                  Capability Diamond
                </button>
              </div>
            </div>

            {activeTab === 'sentiment' ? (
              /* Sentiment Heatmap */
              <div className={`rounded-[32px] overflow-hidden ${
                isDarkMode
                  ? 'bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06]'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
              } p-10`}>
                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <h3 className={`text-[20px] font-semibold mb-2 ${textColor}`}>
                      Sentiment Analysis Heatmap
                    </h3>
                    <p className={`${subTextColor} text-[14px]`}>
                      25 zones mapping sentiment levels against organizational reasons
                    </p>
                  </div>
                  
                  {/* Heatmap Grid with Labels */}
                  <div className="flex gap-6">
                    {/* Y-axis labels */}
                    <div className="flex flex-col justify-around py-8">
                      {['Excited', 'Supportive', 'Neutral', 'Concerned', 'Resistant'].map(label => (
                        <div key={label} className={`text-[11px] ${subTextColor} text-right pr-2`}>
                          {label}
                        </div>
                      ))}
                    </div>
                    
                    {/* Main Grid */}
                    <div className="flex-1">
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {/* Sample data with realistic patterns */}
                        {[
                          [90, 75, 45, 30, 15], // Excited row
                          [80, 85, 60, 40, 25], // Supportive row
                          [50, 55, 50, 45, 40], // Neutral row
                          [30, 35, 40, 60, 70], // Concerned row
                          [10, 20, 30, 75, 85], // Resistant row
                        ].map((row, rowIdx) => (
                          row.map((value, colIdx) => {
                            const opacity = value / 100
                            const bgColor = value > 70 ? 'bg-green-500' 
                              : value > 40 ? 'bg-yellow-500' 
                              : 'bg-red-500'
                            
                            return (
                              <div
                                key={`${rowIdx}-${colIdx}`}
                                className={`aspect-square rounded-lg ${bgColor} transition-all duration-300 hover:scale-105 cursor-pointer flex items-center justify-center group relative`}
                                style={{ opacity: 0.3 + opacity * 0.7 }}
                              >
                                <span className={`text-[10px] font-bold ${
                                  isDarkMode ? 'text-white' : 'text-black'
                                } opacity-0 group-hover:opacity-100 transition-opacity`}>
                                  {value}%
                                </span>
                                
                                {/* Tooltip on hover */}
                                <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-lg ${
                                  isDarkMode ? 'bg-black' : 'bg-gray-900'
                                } text-white text-[11px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10`}>
                                  {value}% readiness
                                </div>
                              </div>
                            )
                          })
                        ))}
                      </div>
                      
                      {/* X-axis labels */}
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {['Technology', 'Leadership', 'Culture', 'Resources', 'Skills'].map(label => (
                          <div key={label} className={`text-[11px] ${subTextColor} text-center`}>
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-8 mt-10">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-green-500 opacity-80" />
                      <span className={`text-[12px] ${subTextColor}`}>Strong Support (70%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500 opacity-60" />
                      <span className={`text-[12px] ${subTextColor}`}>Moderate (40-70%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500 opacity-50" />
                      <span className={`text-[12px] ${subTextColor}`}>Resistance (<40%)</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Capability Diamond */
              <div className={`rounded-[32px] overflow-hidden ${
                isDarkMode
                  ? 'bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06]'
                  : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
              } p-10`}>
                <div className="max-w-5xl mx-auto">
                  <div className="mb-8">
                    <h3 className={`text-[20px] font-semibold mb-2 ${textColor}`}>
                      Capability Maturity Assessment
                    </h3>
                    <p className={`${subTextColor} text-[14px]`}>
                      8 critical dimensions of AI readiness
                    </p>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Radar Chart */}
                    <div className="relative">
                      <div className="relative w-full aspect-square max-w-md mx-auto">
                        {/* Background circles */}
                        {[20, 40, 60, 80, 100].map((percentage) => (
                          <div
                            key={percentage}
                            className={`absolute inset-0 border rounded-full ${
                              isDarkMode ? 'border-white/[0.05]' : 'border-gray-200'
                            }`}
                            style={{
                              width: `${percentage}%`,
                              height: `${percentage}%`,
                              top: `${(100 - percentage) / 2}%`,
                              left: `${(100 - percentage) / 2}%`,
                            }}
                          />
                        ))}
                        
                        {/* Dimension labels with scores */}
                        {[
                          { name: 'Strategy', score: 72, angle: -90 },
                          { name: 'Data', score: 85, angle: -45 },
                          { name: 'Technology', score: 68, angle: 0 },
                          { name: 'Talent', score: 45, angle: 45 },
                          { name: 'Process', score: 78, angle: 90 },
                          { name: 'Innovation', score: 62, angle: 135 },
                          { name: 'Adoption', score: 58, angle: 180 },
                          { name: 'Ethics', score: 82, angle: 225 },
                        ].map((dim) => {
                          const radian = (dim.angle * Math.PI) / 180
                          const x = 50 + 45 * Math.cos(radian)
                          const y = 50 + 45 * Math.sin(radian)
                          
                          return (
                            <div
                              key={dim.name}
                              className="absolute flex flex-col items-center"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                            >
                              <span className={`text-[12px] font-medium ${textColor}`}>
                                {dim.name}
                              </span>
                              <span className={`text-[18px] font-light ${
                                dim.score >= 70 ? 'text-green-500' 
                                : dim.score >= 50 ? 'text-yellow-500' 
                                : 'text-red-500'
                              }`}>
                                {dim.score}
                              </span>
                            </div>
                          )
                        })}
                        
                        {/* Filled polygon shape */}
                        <svg className="absolute inset-0 w-full h-full">
                          <polygon
                            points={[
                              { score: 72, angle: -90 },
                              { score: 85, angle: -45 },
                              { score: 68, angle: 0 },
                              { score: 45, angle: 45 },
                              { score: 78, angle: 90 },
                              { score: 62, angle: 135 },
                              { score: 58, angle: 180 },
                              { score: 82, angle: 225 },
                            ].map(({ score, angle }) => {
                              const radian = (angle * Math.PI) / 180
                              const radius = (score / 100) * 40
                              const x = 50 + radius * Math.cos(radian)
                              const y = 50 + radius * Math.sin(radian)
                              return `${x}%,${y}%`
                            }).join(' ')}
                            fill="url(#capabilityGradient)"
                            fillOpacity="0.2"
                            stroke="url(#capabilityGradient)"
                            strokeWidth="2"
                          />
                          <defs>
                            <linearGradient id="capabilityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#5380b3" />
                              <stop offset="50%" stopColor="#7a6ca8" />
                              <stop offset="100%" stopColor="#a74f8b" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Dimension Details */}
                    <div className="space-y-3">
                      {[
                        { name: 'Strategy & Vision', score: 72, status: 'Good' },
                        { name: 'Data Infrastructure', score: 85, status: 'Excellent' },
                        { name: 'Technology Stack', score: 68, status: 'Moderate' },
                        { name: 'Talent & Skills', score: 45, status: 'Needs Focus' },
                        { name: 'Process & Operations', score: 78, status: 'Good' },
                        { name: 'Innovation Culture', score: 62, status: 'Moderate' },
                        { name: 'Adoption & Change', score: 58, status: 'Moderate' },
                        { name: 'Ethics & Governance', score: 82, status: 'Excellent' },
                      ].map((dim) => (
                        <div key={dim.name} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-[13px] font-medium ${textColor}`}>
                                {dim.name}
                              </span>
                              <span className={`text-[11px] ${
                                dim.score >= 70 ? 'text-green-500' 
                                : dim.score >= 50 ? 'text-yellow-500' 
                                : 'text-red-500'
                              }`}>
                                {dim.status}
                              </span>
                            </div>
                            <div className={`h-1.5 rounded-full overflow-hidden ${
                              isDarkMode ? 'bg-white/[0.05]' : 'bg-gray-200'
                            }`}>
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  dim.score >= 70 ? 'bg-green-500' 
                                  : dim.score >= 50 ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                                }`}
                                style={{ width: `${dim.score}%` }}
                              />
                            </div>
                          </div>
                          <span className={`text-[14px] font-light ${textColor} w-10 text-right`}>
                            {dim.score}%
                          </span>
              </div>
            ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Process - Minimal Timeline */}
        <section id="how-it-works" className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-[#5380b3]' : 'text-[#5380b3]'}`}>
                Process
              </p>
              <h2 className={`text-[36px] font-light ${textColor} tracking-tight`}>
                From Data to Insights in Minutes
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Upload',
                  description: 'CSV, Excel, or JSON format',
                  icon: FileText,
                  time: '30 seconds'
                },
                {
                  step: '02',
                  title: 'Analysis',
                  description: 'AI processes patterns instantly',
                  icon: Cpu,
                  time: '2 minutes'
                },
                {
                  step: '03',
                  title: 'Insights',
                  description: 'Interactive dashboard ready',
                  icon: TrendingUp,
                  time: '30 seconds'
                }
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className={`flex items-center gap-6 p-6 rounded-[24px] ${
                    isDarkMode
                      ? 'bg-white/[0.02] border border-white/[0.06]'
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="text-[32px] font-light bg-gradient-to-r from-[#5380b3] to-[#a74f8b] bg-clip-text text-transparent">
                      {item.step}
                    </div>
                    
                    <Icon className={`w-8 h-8 ${subTextColor}`} strokeWidth={1.5} />
                    
                    <div className="flex-1">
                      <h3 className={`text-[18px] font-semibold ${textColor}`}>{item.title}</h3>
                      <p className={`${subTextColor} text-[13px]`}>{item.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-[16px] font-light ${textColor}`}>{item.time}</div>
                      <div className={`text-[10px] uppercase tracking-wider ${subTextColor}`}>Duration</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

        {/* Security - Compact Grid */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className={`text-[12px] font-semibold uppercase tracking-wider mb-3 text-green-500`}>
                Security
              </p>
              <h2 className={`text-[36px] font-light ${textColor} tracking-tight`}>
                Enterprise-Grade Protection
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Shield, title: 'SOC2', detail: 'Type II' },
                { icon: Lock, title: 'AES-256', detail: 'Encryption' },
                { icon: Globe, title: 'GDPR', detail: 'Compliant' },
                { icon: Database, title: 'Residency', detail: 'Control' }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className={`p-5 rounded-[20px] text-center ${
                    isDarkMode
                      ? 'bg-white/[0.02] border border-white/[0.06]'
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <Icon className="w-6 h-6 mx-auto mb-3 text-green-500" strokeWidth={1.5} />
                    <h3 className={`text-[14px] font-semibold ${textColor}`}>{item.title}</h3>
                    <p className={`text-[11px] ${subTextColor}`}>{item.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Final CTA - Centered & Clean */}
        <section className="py-32 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-[48px] font-light ${textColor} mb-4 tracking-tight`}>
              Ready to start your
              <span className="block text-[52px] font-normal bg-gradient-to-r from-[#5380b3] via-[#7a6ca8] to-[#a74f8b] bg-clip-text text-transparent">
                transformation?
              </span>
            </h2>
            
            <p className={`${subTextColor} text-[16px] mb-8 max-w-xl mx-auto`}>
              Get early access at Web Summit 2025
            </p>
            
            <div className="flex gap-3 justify-center">
              <Link href="/demo">
                <Button variant="primary" isDark={isDarkMode}>
                  Try Demo
                </Button>
              </Link>
              <Link href="/upload">
                <Button variant="secondary" isDark={isDarkMode}>
                  Upload Data
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer - Minimal */}
        <footer className={`py-12 ${isDarkMode ? 'border-t border-white/[0.06]' : 'border-t border-gray-200'}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#5380b3]" strokeWidth={2} />
                <span className={`text-[13px] ${subTextColor}`}>© 2025 AI Navigator</span>
              </div>
              
              <div className="flex gap-5">
                {['Demo', 'Features', 'Security'].map((item) => (
                  <a key={item} href="#" className={`text-[12px] ${subTextColor} hover:${textColor} transition-colors`}>
                    {item}
                  </a>
                ))}
              </div>
          </div>
        </div>
      </footer>
    </div>
    </main>
  )
}