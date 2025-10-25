"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Sun, Moon, Brain, ArrowRight, Sparkles, Shield, Check, X, Building2, ChevronRight, BarChart3, Target, Zap, Clock, AlertTriangle, TrendingUp, Users, Layers, FileText, Lock, Globe, Database, Award, Hexagon, Activity } from "lucide-react"
import Link from 'next/link'
import { Component as TurbulentFlow } from '@/components/turbulent-flow'

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
  
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // Countdown timer - only run on client
  useEffect(() => {
    setIsMounted(true)
    setTimeLeft(calculateTimeLeft())
    
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
    { name: 'Login', href: '/login' },
  ]

  return (
    <main className={`relative min-h-screen ${bgColor} w-full transition-all duration-500`}>
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

        {/* Hero Section - Refined */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 overflow-hidden">
          {/* Turbulent Flow Background - Hero Only */}
          <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-black/40" />
            <TurbulentFlow>
              <div />
            </TurbulentFlow>
          </div>
          
          <div className="w-full max-w-xl relative z-10">
            <div className={`relative ${
              isDarkMode 
                ? 'bg-black/20 border-white/[0.06]' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-xl border rounded-[32px] p-12 shadow-2xl`}>
              <div className={`absolute inset-0 rounded-[32px] pointer-events-none ${
                isDarkMode 
                  ? 'bg-gradient-to-b from-white/[0.02] to-transparent' 
                  : 'bg-gradient-to-b from-white/30 to-transparent'
              }`} />
              
              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-10">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${
                        isDarkMode
                          ? 'bg-white/[0.04] border border-white/[0.06]'
                          : 'bg-black/[0.02] border border-gray-200'
                      }`}>
                        <Sparkles className="w-4 h-4 text-[#5380b3]" strokeWidth={2} />
                        <span className={`text-[12px] font-semibold uppercase tracking-wider ${subTextColor}`}>
                          AI Readiness Platform
                        </span>
            </div>

                      <h1 className={`text-[48px] font-light ${textColor} mb-6 tracking-[-0.02em] leading-[1.05]`}>
                        Transform Your<br />
                        <span className="font-normal bg-gradient-to-r from-[#5380b3] via-[#7a6ca8] to-[#a74f8b] bg-clip-text text-transparent">
                AI Journey
              </span>
            </h1>
                      <p className={`${subTextColor} text-[16px] leading-relaxed max-w-md mx-auto`}>
                        Join leading enterprises using data-driven insights to navigate their AI transformation
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-8">
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
                      <p className={`text-[13px] font-semibold mb-4 ${isDarkMode ? 'text-[#5380b3]' : 'text-[#5380b3]'}`}>
                        Web Summit 2025 · Lisbon
                      </p>
                      {!isMounted ? (
                        <div className="h-[60px] flex items-center justify-center">
                          <div className={`text-[24px] font-light ${textColor}`}>
                            Loading...
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-5">
                          {[
                            { value: timeLeft.days, label: 'Days' },
                            { value: String(timeLeft.hours).padStart(2, '0'), label: 'Hours' },
                            { value: String(timeLeft.minutes).padStart(2, '0'), label: 'Mins' },
                            { value: String(timeLeft.seconds).padStart(2, '0'), label: 'Secs' },
                          ].map((item, idx) => (
                            <React.Fragment key={item.label}>
                              <div className="text-center">
                                <div className={`text-[32px] font-light ${textColor} tabular-nums`}>
                                  {item.value}
                                </div>
                                <div className={`text-[11px] ${subTextColor} uppercase tracking-wider font-medium mt-1`}>
                                  {item.label}
                                </div>
                              </div>
                              {idx < 3 && <div className={`${subTextColor} opacity-30`}>:</div>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={`mt-10 pt-10 text-center ${isDarkMode ? 'border-t border-white/[0.06]' : 'border-t border-gray-200'}`}>
                      <div className="flex gap-3 justify-center mb-4">
                        <Link href="/login">
                          <button className={`text-[13px] font-medium px-5 py-2.5 rounded-2xl transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white'
                              : 'bg-black/[0.02] hover:bg-black/[0.04] text-gray-600 hover:text-gray-900'
                          }`}>
                Sign In
                          </button>
              </Link>
                        <Link href="/upload">
                          <button className={`text-[13px] font-medium px-5 py-2.5 rounded-2xl transition-all duration-300 ${
                            isDarkMode
                              ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white'
                              : 'bg-black/[0.02] hover:bg-black/[0.04] text-gray-600 hover:text-gray-900'
                          }`}>
                            Upload Data
                          </button>
              </Link>
                      </div>
                      <p className={`text-[11px] font-medium uppercase tracking-wider ${subTextColor}`}>
                        Enterprise-ready · SOC2 · GDPR
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isDarkMode
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-green-500/10 border border-green-500/30'
                    }`}>
                      <Check className="w-10 h-10 text-green-500" strokeWidth={2} />
                    </div>
                    <h3 className={`text-[28px] font-light ${textColor} mb-3`}>
                      You're on the list!
                    </h3>
                    <p className={`${subTextColor} text-[15px]`}>
                      We'll notify you when we launch.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section - Refined */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className={`text-[13px] font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
                The Challenge
              </p>
              <h2 className={`text-[42px] font-light ${textColor} mb-4 tracking-tight`}>
                Why AI Transformations Fail
              </h2>
              <p className={`${subTextColor} text-[16px] max-w-2xl mx-auto`}>
                67% of AI initiatives fail to deliver expected value
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: Users,
                  title: 'Human Resistance',
                  description: 'Organizations underestimate emotional barriers, creating invisible roadblocks to adoption.',
                  points: [
                    'Teams resist without understanding',
                    'Leadership lacks sentiment visibility',
                    'No data-driven change management'
                  ],
                  color: 'red'
                },
                {
                  icon: Layers,
                  title: 'Capability Gaps',
                  description: 'Critical gaps in data, talent, and infrastructure remain hidden until it\'s too late.',
                  points: [
                    'No systematic assessment',
                    'Blind spots in key dimensions',
                    'Investment without priorities'
                  ],
                  color: 'orange'
                }
              ].map((item) => {
                const Icon = item.icon
                const colorClasses = item.color === 'red' 
                  ? 'text-red-500 bg-red-500/10 border-red-500/20'
                  : 'text-orange-500 bg-orange-500/10 border-orange-500/20'
                
                return (
                  <div key={item.title} className={`p-8 rounded-[28px] ${
                    isDarkMode
                      ? 'bg-white/[0.02] border border-white/[0.06]'
                      : 'bg-gray-50 border border-gray-200'
                  } transition-all duration-300 hover:scale-[1.01]`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorClasses}`}>
                      <Icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <h3 className={`text-[20px] font-semibold mb-3 ${textColor}`}>{item.title}</h3>
                    <p className={`${subTextColor} text-[14px] mb-5 leading-relaxed`}>{item.description}</p>
                    <ul className="space-y-2.5">
                      {item.points.map(point => (
                        <li key={point} className={`text-[13px] ${subTextColor} flex items-start gap-2`}>
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                            item.color === 'red' ? 'bg-red-500' : 'bg-orange-500'
                          }`} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

        {/* Features Section - Refined */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className={`text-[13px] font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-[#5380b3]' : 'text-[#5380b3]'}`}>
                Core Capabilities
              </p>
              <h2 className={`text-[42px] font-light ${textColor} mb-4 tracking-tight`}>
                Enterprise AI Assessment
              </h2>
          </div>

            <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                  icon: Target,
                title: 'Sentiment Analysis',
                description: 'Understand organizational readiness across 25 key dimensions',
                  metric: '25 dimensions analyzed'
              },
              {
                  icon: Hexagon,
                title: 'Capability Assessment',
                  description: 'Measure maturity across 8 critical dimensions and 32 constructs',
                  metric: '32 capability constructs'
              },
              {
                  icon: Zap,
                title: 'Smart Recommendations',
                description: 'Get targeted interventions based on your specific gaps',
                  metric: 'Real-time insights'
                }
              ].map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className={`group p-8 rounded-[28px] ${
                    isDarkMode
                      ? 'bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06]'
                      : 'bg-gray-50 hover:bg-white border border-gray-200'
                  } transition-all duration-300`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                      isDarkMode
                        ? 'bg-[#5380b3]/10 border border-[#5380b3]/20'
                        : 'bg-[#5380b3]/10 border border-[#5380b3]/30'
                    }`}>
                      <Icon className="w-6 h-6 text-[#5380b3]" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className={`text-[18px] font-semibold mb-3 ${textColor}`}>{feature.title}</h3>
                    <p className={`${subTextColor} mb-4 text-[14px] leading-relaxed`}>{feature.description}</p>
                    <p className={`text-[12px] font-semibold text-[#5380b3] uppercase tracking-wider`}>
                      {feature.metric}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Complete Picture Section - Enhanced */}
        <section className="py-32 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <p className={`text-[13px] font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-[#a74f8b]' : 'text-[#a74f8b]'}`}>
                Dual Framework
              </p>
              <h2 className={`text-[42px] font-light ${textColor} mb-4 tracking-tight`}>
                See the Complete Picture
              </h2>
              <p className={`${subTextColor} text-[16px] max-w-2xl mx-auto`}>
                Combine emotional and capability insights for comprehensive understanding
              </p>
            </div>

            {/* Tab Switcher - iOS Style */}
            <div className="flex justify-center mb-16">
              <div className={`inline-flex p-1 rounded-[24px] ${
                isDarkMode
                  ? 'bg-white/[0.04] border border-white/[0.06]'
                  : 'bg-gray-100 border border-gray-200'
              }`}>
                <button
                  onClick={() => setActiveTab('sentiment')}
                  className={`px-8 py-3 rounded-[20px] text-[14px] font-semibold transition-all duration-300 ${
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
                  className={`px-8 py-3 rounded-[20px] text-[14px] font-semibold transition-all duration-300 ${
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

            {/* Visualization Area */}
            <div className={`relative rounded-[32px] overflow-hidden ${
              isDarkMode
                ? 'bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.06]'
                : 'bg-gradient-to-b from-gray-50 to-white border border-gray-200'
            }`}>
              <div className="p-12">
                {activeTab === 'sentiment' ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-[24px] font-semibold mb-3 ${textColor}`}>
                        25-Zone Sentiment Heatmap
                      </h3>
                      <p className={`${subTextColor} text-[14px] max-w-2xl`}>
                        Visualize emotional readiness across your organization
                      </p>
                    </div>
                    
                    {/* Heatmap Grid */}
                    <div className="relative mx-auto max-w-3xl">
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          'bg-green-500 opacity-60', 'bg-yellow-500 opacity-40', 'bg-red-500 opacity-40', 'bg-yellow-500 opacity-60', 'bg-red-500 opacity-40',
                          'bg-yellow-500 opacity-40', 'bg-green-500 opacity-60', 'bg-yellow-500 opacity-60', 'bg-red-500 opacity-40', 'bg-yellow-500 opacity-40',
                          'bg-red-500 opacity-40', 'bg-yellow-500 opacity-40', 'bg-green-500 opacity-60', 'bg-yellow-500 opacity-60', 'bg-red-500 opacity-40',
                          'bg-yellow-500 opacity-60', 'bg-red-500 opacity-40', 'bg-yellow-500 opacity-40', 'bg-green-500 opacity-60', 'bg-yellow-500 opacity-40',
                          'bg-red-500 opacity-40', 'bg-yellow-500 opacity-60', 'bg-green-500 opacity-60', 'bg-yellow-500 opacity-40', 'bg-red-500 opacity-40'
                        ].map((classes, i) => (
                          <div
                            key={i}
                            className={`aspect-square rounded-2xl ${classes} transition-all duration-500 hover:scale-105 hover:opacity-100`}
                          />
                        ))}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex justify-center gap-8 mt-10">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-red-500 opacity-60" />
                          <span className={`text-[12px] ${subTextColor}`}>Resistance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-yellow-500 opacity-60" />
                          <span className={`text-[12px] ${subTextColor}`}>Neutral</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-green-500 opacity-60" />
                          <span className={`text-[12px] ${subTextColor}`}>Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-[24px] font-semibold mb-3 ${textColor}`}>
                        8-Dimensional Capability Diamond
                      </h3>
                      <p className={`${subTextColor} text-[14px] max-w-2xl`}>
                        Assess organizational maturity across critical dimensions
                      </p>
                    </div>
                    
                    {/* Diamond Visualization */}
                    <div className="relative mx-auto w-80 h-80">
                      <svg viewBox="0 0 320 320" className="w-full h-full">
                        {/* Grid circles */}
                        {[80, 120, 160, 200, 240].map((r) => (
                          <circle
                            key={r}
                            cx="160"
                            cy="160"
                            r={r/2}
                            fill="none"
                            stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                            strokeWidth="1"
                          />
                        ))}
                        
                        {/* Axes */}
                        {Array.from({length: 8}).map((_, i) => {
                          const angle = (i * 45 - 90) * (Math.PI / 180)
                          const x = 160 + 120 * Math.cos(angle)
                          const y = 160 + 120 * Math.sin(angle)
                          return (
                            <line
                              key={i}
                              x1="160"
                              y1="160"
                              x2={x}
                              y2={y}
                              stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                              strokeWidth="1"
                            />
                          )
                        })}
                        
                        {/* Filled area */}
                        <polygon
                          points={Array.from({length: 8}).map((_, i) => {
                            const angle = (i * 45 - 90) * (Math.PI / 180)
                            const radius = 60 + Math.random() * 40
                            const x = 160 + radius * Math.cos(angle)
                            const y = 160 + radius * Math.sin(angle)
                            return `${x},${y}`
                          }).join(' ')}
                          fill="url(#gradient)"
                          fillOpacity="0.3"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                        />
                        
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#5380b3" />
                            <stop offset="50%" stopColor="#7a6ca8" />
                            <stop offset="100%" stopColor="#a74f8b" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Labels */}
                      {['Strategy', 'Data', 'Technology', 'Talent', 'Process', 'Innovation', 'Adoption', 'Ethics'].map((label, i) => {
                        const angle = (i * 45 - 90) * (Math.PI / 180)
                        const x = 50 + 140 * Math.cos(angle)
                        const y = 50 + 140 * Math.sin(angle)
                        return (
                          <div
                            key={label}
                            className={`absolute text-[12px] font-medium ${subTextColor}`}
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            {label}
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Maturity Scale */}
                    <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                      {['Nascent', 'Developing', 'Advanced', 'Leading'].map((level, i) => (
                        <div key={level} className="text-center">
                          <div className={`text-[24px] font-light ${textColor} mb-1`}>
                            {25 * (i + 1)}%
                          </div>
                          <div className={`text-[11px] uppercase tracking-wider ${subTextColor}`}>{level}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* How it Works - Refined */}
        <section id="how-it-works" className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className={`text-[13px] font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-[#5380b3]' : 'text-[#5380b3]'}`}>
                Process
              </p>
              <h2 className={`text-[42px] font-light ${textColor} mb-4 tracking-tight`}>
                Three Simple Steps
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Upload Data',
                  description: 'Securely upload survey responses in any format',
                  details: ['CSV, Excel, JSON', 'Bank-grade encryption', 'GDPR compliant'],
                  icon: FileText
                },
                {
                  step: '02',
                  title: 'AI Analysis',
                  description: 'Our models analyze patterns across all dimensions',
                  details: ['25 sentiment areas', '8 capability dimensions', 'Real-time processing'],
                  icon: Activity
                },
                {
                  step: '03',
                  title: 'Get Insights',
                  description: 'Receive dashboard with actionable recommendations',
                  details: ['Interactive visuals', 'Export reports', 'Action plans'],
                  icon: TrendingUp
                }
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="relative">
                    {idx < 2 && (
                      <div className={`hidden md:block absolute top-16 -right-4 transform translate-x-full ${subTextColor}`}>
                        <ChevronRight size={20} strokeWidth={1} />
                      </div>
                    )}
                    
                    <div className={`p-8 rounded-[28px] h-full ${
                      isDarkMode
                        ? 'bg-white/[0.02] border border-white/[0.06]'
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`text-[40px] font-light bg-gradient-to-r from-[#5380b3] to-[#a74f8b] bg-clip-text text-transparent`}>
                          {item.step}
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isDarkMode
                            ? 'bg-white/[0.04] border border-white/[0.06]'
                            : 'bg-black/[0.02] border border-gray-200'
                        }`}>
                          <Icon className={`w-6 h-6 ${subTextColor}`} strokeWidth={1.5} />
                        </div>
                      </div>
                      
                      <h3 className={`text-[18px] font-semibold mb-3 ${textColor}`}>{item.title}</h3>
                      <p className={`${subTextColor} mb-5 text-[14px]`}>{item.description}</p>
                      
                      <ul className="space-y-2">
                        {item.details.map((detail) => (
                          <li key={detail} className={`text-[12px] ${subTextColor} flex items-center gap-2`}>
                            <Check className="w-3 h-3 text-[#5380b3]" strokeWidth={2.5} />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Security Section - Refined */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className={`text-[13px] font-semibold uppercase tracking-wider mb-4 text-green-500`}>
                Security First
              </p>
              <h2 className={`text-[42px] font-light ${textColor} mb-4 tracking-tight`}>
                Enterprise-Grade Protection
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: 'SOC2 Type II', detail: 'Certified' },
                { icon: Lock, title: 'AES-256', detail: 'Encryption' },
                { icon: Globe, title: 'GDPR', detail: 'Compliant' },
                { icon: Database, title: 'Data Residency', detail: 'Control' }
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.title} className={`p-6 rounded-[24px] text-center ${
                    isDarkMode
                      ? 'bg-white/[0.02] border border-white/[0.06]'
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-500" strokeWidth={1.5} />
                    </div>
                    <h3 className={`text-[15px] font-semibold mb-1 ${textColor}`}>{item.title}</h3>
                    <p className={`text-[12px] ${subTextColor}`}>{item.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-[48px] font-light ${textColor} mb-6 tracking-tight`}>
              Ready to Transform Your
              <span className="block text-[52px] font-normal bg-gradient-to-r from-[#5380b3] via-[#7a6ca8] to-[#a74f8b] bg-clip-text text-transparent">
                AI Journey?
              </span>
            </h2>
            
            <p className={`${subTextColor} text-[18px] mb-10 max-w-2xl mx-auto`}>
              Join the waitlist for early access at Web Summit 2025
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button variant="primary" isDark={isDarkMode}>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
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

      {/* Footer */}
        <footer className={`py-16 ${isDarkMode ? 'border-t border-white/[0.06]' : 'border-t border-gray-200'}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-[#5380b3]" strokeWidth={2} />
                <span className={`text-[14px] ${subTextColor}`}>AI Navigator © 2025</span>
              </div>
              
              <div className="flex gap-6">
                {['Demo', 'Features', 'Security'].map((item) => (
                  <a key={item} href="#" className={`text-[13px] ${subTextColor} hover:${textColor} transition-colors`}>
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