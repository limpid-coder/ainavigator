"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import type { ReactElement } from "react"
import { Sun, Moon, Home, DollarSign, Rocket, CalendarDays, Bell, Building2, Shield, Check, X } from "lucide-react"
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  QuadraticBezierCurve3,
  Vector3,
  TubeGeometry,
  ShaderMaterial,
  Mesh,
  AdditiveBlending,
  DoubleSide,
} from "three"

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

// We'll pass isDarkMode via data attribute and check it in the component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { isDark?: boolean }>(
  ({ className, type, isDark = true, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-11 w-full rounded-[14px] border backdrop-blur-2xl px-4 py-2 text-[15px] focus:outline-none focus:ring-1 transition-all duration-200 ${
          isDark
            ? 'border-white/[0.05] bg-black/40 text-white placeholder:text-white/30 focus:ring-white/20 focus:bg-black/50 focus:border-white/10'
            : 'border-gray-900/[0.08] bg-white/60 text-gray-900 placeholder:text-gray-500 focus:ring-[#5380b3]/30 focus:bg-white/80 focus:border-[#5380b3]/20'
        } ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { isDark?: boolean }>(
  ({ className, children, isDark = true, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-[14px] text-[15px] font-semibold transition-all duration-200 focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] h-11 px-6 shadow-lg ${
          isDark
            ? 'bg-gradient-to-br from-[#5380b3] to-[#a74f8b] text-white hover:from-[#5380b3]/90 hover:to-[#a74f8b]/90 shadow-[#5380b3]/20 focus:ring-white/20'
            : 'bg-gradient-to-br from-[#5380b3] to-[#a74f8b] text-white hover:from-[#5380b3]/95 hover:to-[#a74f8b]/95 shadow-[#5380b3]/25 focus:ring-[#5380b3]/30'
        } ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export function WaitlistExperience(): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Scene | undefined>(undefined)
  const rendererRef = useRef<WebGLRenderer | undefined>(undefined)
  const animationIdRef = useRef<number | undefined>(undefined)

  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [accessCode, setAccessCode] = useState("")
  const [showCompanyLogin, setShowCompanyLogin] = useState(false)
  const [companyData, setCompanyData] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [codeError, setCodeError] = useState("")
  
  // Calculate time until Web Summit - Nov 12, 2025 CET
  const calculateTimeLeft = () => {
    const webSummitDate = new Date('2025-11-12T09:00:00+01:00') // Nov 12, 2025 9AM CET
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
    return {
      days: 0,
      hours: 0, 
      minutes: 0,
      seconds: 0,
    }
  }
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  // Three.js background effect
  useEffect(() => {
    if (!mountRef.current) return

    const scene = new Scene()
    sceneRef.current = scene

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    rendererRef.current = renderer

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(isDarkMode ? 0x000000 : 0xf5f1ed, 1)
    mountRef.current.appendChild(renderer.domElement)

    const curve = new QuadraticBezierCurve3(new Vector3(-15, -4, 0), new Vector3(2, 3, 0), new Vector3(18, 0.8, 0))
    const tubeGeometry = new TubeGeometry(curve, 200, 0.8, 32, false)

    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      uniform float time;
      uniform float isDark;
      varying vec2 vUv;
      varying vec3 vPosition;
      
      void main() {
        // Brand colors: orange #e0874e, purple #a74f8b, blue #5380b3
        vec3 brandOrange = vec3(0.878, 0.529, 0.306);
        vec3 brandPurple = vec3(0.655, 0.310, 0.545);
        vec3 brandBlue = vec3(0.325, 0.502, 0.702);
        
        vec3 color1 = mix(brandBlue * 0.9, brandBlue * 0.7, isDark);
        vec3 color2 = mix(brandPurple * 0.8, brandPurple * 0.9, isDark);
        vec3 color3 = mix(brandOrange * 0.7, brandOrange * 0.6, isDark);
        
        vec3 finalColor = mix(color1, color2, vUv.x * 0.6);
        finalColor = mix(finalColor, color3, vUv.x * 0.4);
        
        float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
        glow = pow(glow, 2.0);
        
        float fade = 1.0;
        if (vUv.x > 0.85) {
          fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
        }
        
        float pulse = sin(time * 2.0) * 0.05 + 0.95;
        
        float alpha = mix(0.3, 0.5, isDark);
        gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * alpha);
      }
    `

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        isDark: { value: isDarkMode ? 1.0 : 0.0 },
      },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    })

    const lightStreak = new Mesh(tubeGeometry, material)
    scene.add(lightStreak)

    const glowGeometry = new TubeGeometry(curve, 200, 1.5, 32, false)
    const glowMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader: `
        uniform float time;
        uniform float isDark;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Brand colors for glow layer
          vec3 brandPurple = vec3(0.655, 0.310, 0.545);
          vec3 brandBlue = vec3(0.325, 0.502, 0.702);
          
          vec3 color1 = mix(brandBlue * 0.8, brandBlue * 0.6, isDark);
          vec3 color2 = mix(brandPurple * 0.7, brandPurple * 0.8, isDark);
          
          vec3 finalColor = mix(color1, color2, vUv.x);
          
          float glow = 1.0 - abs(vUv.y - 0.5) * 2.0;
          glow = pow(glow, 4.0);
          
          float fade = 1.0;
          if (vUv.x > 0.85) {
            fade = 1.0 - smoothstep(0.85, 1.0, vUv.x);
          }
          
          float pulse = sin(time * 1.5) * 0.05 + 0.95;
          
          float alpha = mix(0.15, 0.25, isDark);
          gl_FragColor = vec4(finalColor * glow * pulse * fade, glow * fade * alpha);
        }
      `,
      uniforms: {
        time: { value: 0 },
        isDark: { value: isDarkMode ? 1.0 : 0.0 },
      },
      transparent: true,
      blending: AdditiveBlending,
      side: DoubleSide,
    })

    const glowLayer = new Mesh(glowGeometry, glowMaterial)
    scene.add(glowLayer)

    camera.position.z = 7
    camera.position.y = -0.8

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)

      const time = Date.now() * 0.001
      material.uniforms.time.value = time
      glowMaterial.uniforms.time.value = time

      lightStreak.rotation.z = Math.sin(time * 0.2) * 0.05
      glowLayer.rotation.z = Math.sin(time * 0.2) * 0.05

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      tubeGeometry.dispose()
      glowGeometry.dispose()
      material.dispose()
      glowMaterial.dispose()
    }
  }, [isDarkMode])

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
    }
  }

  const handleAccessCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    setCodeError("")
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const company = COMPANY_ACCESS_CODES[accessCode.toUpperCase() as keyof typeof COMPANY_ACCESS_CODES]
    
    if (company) {
      setCompanyData(company)
      setIsValidating(false)
      
      // Store in session and redirect after animation
      setTimeout(() => {
        sessionStorage.setItem('companyAccess', JSON.stringify(company))
        window.location.href = "/dashboard"
      }, 2000)
    } else {
      setCodeError("Invalid access code. Please check and try again.")
      setIsValidating(false)
    }
  }

  const navItems = [
    { name: "Home", icon: Home, active: false },
    { name: "Pricing", icon: DollarSign, active: false },
    { name: "Beta", icon: Rocket, active: true },
    { name: "Launch", icon: CalendarDays, active: false },
    { name: "Updates", icon: Bell, active: false },
  ]

  const bgColor = isDarkMode ? "bg-black" : "bg-[#f5f1ed]"
  const textColor = isDarkMode ? "text-white" : "text-gray-900"
  const subTextColor = isDarkMode ? "text-white/50" : "text-gray-600"

  return (
    <main className={`relative min-h-screen overflow-hidden ${bgColor} w-full transition-colors duration-300`}>
      {/* Three.js Background */}
      <div ref={mountRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen">
        {/* Enhanced Navigation Bar - Ultra iOS Style */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-5xl px-6">
          <div className={`relative ${isDarkMode ? 'bg-black/60 border-white/[0.06] shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]' : 'bg-white/70 border-gray-900/[0.06] shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]'} backdrop-blur-[80px] border rounded-[24px] px-3 py-2.5`}>
            {/* Multiple glass layers for depth */}
            <div className={`absolute inset-0 rounded-[24px] ${isDarkMode ? 'bg-gradient-to-br from-white/[0.04] via-transparent to-transparent' : 'bg-gradient-to-br from-white/60 via-transparent to-transparent'} pointer-events-none`} />
            <div className={`absolute inset-0 rounded-[24px] ${isDarkMode ? 'bg-gradient-to-t from-black/40 via-transparent to-white/[0.02]' : 'bg-gradient-to-t from-gray-100/30 via-transparent to-white/20'} pointer-events-none`} />
            
            <div className="relative flex items-center justify-between">
              {/* Nav Items */}
              <div className="flex items-center gap-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.name}
                      className={`
                        flex items-center gap-2 text-[13px] px-4 py-2 rounded-[18px] transition-all duration-200 font-medium
                        ${item.active 
                          ? isDarkMode
                            ? "bg-white/[0.15] text-white shadow-lg backdrop-blur-xl"
                            : "bg-[#5380b3]/10 text-[#5380b3] shadow-md backdrop-blur-xl"
                          : isDarkMode
                            ? "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-900/[0.04]"
                        }
                      `}
                    >
                      <Icon size={14} strokeWidth={2} />
                      <span>{item.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCompanyLogin(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-[18px] text-white text-[13px] font-semibold transition-all duration-200 shadow-lg backdrop-blur-xl ${
                    isDarkMode 
                      ? "bg-gradient-to-br from-[#5380b3]/80 to-[#a74f8b]/80 hover:from-[#5380b3] hover:to-[#a74f8b] shadow-[#5380b3]/20"
                      : "bg-gradient-to-br from-[#5380b3] to-[#a74f8b] hover:from-[#5380b3]/90 hover:to-[#a74f8b]/90 shadow-[#5380b3]/25"
                  }`}
                >
                  <Building2 size={14} strokeWidth={2} />
                  <span>Company Access</span>
                </button>
                
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`
                    p-2 rounded-[18px] transition-all duration-200 backdrop-blur-xl
                    ${isDarkMode 
                      ? "bg-white/[0.06] text-[#e0874e]/90 hover:bg-white/[0.1] hover:text-[#e0874e]" 
                      : "bg-gray-900/[0.06] text-gray-700 hover:bg-gray-900/[0.1] hover:text-gray-900"
                    }
                  `}
                >
                  {isDarkMode ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Company Login Modal - Ultra iOS Style */}
        {showCompanyLogin && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-200 ${isDarkMode ? 'bg-black/80' : 'bg-gray-900/60'}`}>
            <div className={`relative w-full max-w-md backdrop-blur-[100px] border rounded-[28px] p-8 animate-in zoom-in-95 duration-200 ${
              isDarkMode 
                ? 'bg-black/70 border-white/[0.05] shadow-[0_20px_80px_0_rgba(0,0,0,0.9)]'
                : 'bg-white/80 border-gray-900/[0.08] shadow-[0_20px_80px_0_rgba(0,0,0,0.2)]'
            }`}>
              {/* Glass layers */}
              <div className={`absolute inset-0 rounded-[28px] pointer-events-none ${isDarkMode ? 'bg-gradient-to-br from-white/[0.03] via-transparent to-transparent' : 'bg-gradient-to-br from-white/60 via-transparent to-transparent'}`} />
              <div className={`absolute inset-0 rounded-[28px] pointer-events-none ${isDarkMode ? 'bg-gradient-to-t from-black/60 via-transparent to-transparent' : 'bg-gradient-to-t from-gray-100/40 via-transparent to-transparent'}`} />
              
              {!companyData ? (
                <>
                  <button
                    onClick={() => {
                      setShowCompanyLogin(false)
                      setCodeError("")
                      setAccessCode("")
                    }}
                    className={`absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/80'
                        : 'bg-gray-900/[0.04] hover:bg-gray-900/[0.08] text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <X size={16} />
                  </button>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-8">
                      <div className={`w-12 h-12 rounded-[16px] backdrop-blur-xl flex items-center justify-center border ${
                        isDarkMode
                          ? 'bg-black/40 border-[#5380b3]/20'
                          : 'bg-white/60 border-[#5380b3]/30'
                      }`}>
                        <Building2 className={`w-6 h-6 ${isDarkMode ? 'text-[#5380b3]/80' : 'text-[#5380b3]'}`} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className={`text-[20px] font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Company Access</h3>
                        <p className={`text-[13px] font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>Enter your organization code</p>
                      </div>
                    </div>

                    <form onSubmit={handleAccessCode}>
                      <div className="space-y-4">
                        <div>
                          <label className={`text-[11px] uppercase tracking-wider mb-2 block font-semibold ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>
                            Access Code
                          </label>
                          <Input
                            type="text"
                            value={accessCode}
                            onChange={(e) => {
                              setAccessCode(e.target.value.toUpperCase())
                              setCodeError("")
                            }}
                            placeholder="Enter your code..."
                            className={`font-mono text-center text-[16px] tracking-[0.3em] ${
                              codeError ? "border-red-500/40 focus:ring-red-500/20" : ""
                            }`}
                            disabled={isValidating}
                            isDark={isDarkMode}
                          />
                          {codeError && (
                            <p className="text-[12px] text-red-400/90 mt-2 flex items-center gap-1.5 font-medium">
                              <X size={13} strokeWidth={2} />
                              {codeError}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={!accessCode || isValidating}
                          className="w-full h-12 text-[15px] font-semibold rounded-[16px]"
                          isDark={isDarkMode}
                        >
                          {isValidating ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              Validating...
                            </span>
                          ) : (
                            "Access Dashboard"
                          )}
                        </Button>
                      </div>
                    </form>

                    <div className={`mt-6 pt-6 ${isDarkMode ? 'border-t border-white/[0.04]' : 'border-t border-gray-900/[0.06]'}`}>
                      <p className={`text-[11px] text-center font-medium mb-3 ${isDarkMode ? 'text-white/25' : 'text-gray-500'}`}>
                        Demo codes available:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {Object.keys(COMPANY_ACCESS_CODES).map(code => (
                          <button
                            key={code}
                            onClick={() => setAccessCode(code)}
                            className={`text-[11px] px-3 py-1.5 rounded-full transition-all duration-200 font-medium ${
                              isDarkMode
                                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white/70'
                                : 'bg-gray-900/[0.04] hover:bg-gray-900/[0.08] text-gray-600 hover:text-gray-900'
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
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full backdrop-blur-xl flex items-center justify-center border ${
                    isDarkMode
                      ? 'bg-black/40 border-green-400/20'
                      : 'bg-white/60 border-green-500/30'
                  }`}>
                    <Check className={`w-10 h-10 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} strokeWidth={2} />
                  </div>
                  
                  <h3 className={`text-[24px] font-light mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Welcome, {companyData.contact}
                  </h3>
                  <p className={`text-[17px] font-medium mb-1 ${isDarkMode ? 'text-white/70' : 'text-gray-700'}`}>
                    {companyData.name}
                  </p>
                  <p className={`text-[13px] mb-6 font-medium ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>
                    {companyData.role}
                  </p>
                  
                  <div className={`p-5 rounded-[20px] backdrop-blur-xl border mb-6 ${
                    isDarkMode
                      ? 'bg-black/40 border-white/[0.04]'
                      : 'bg-white/60 border-gray-900/[0.06]'
                  }`}>
                    <p className={`text-[11px] mb-2 uppercase tracking-wider font-semibold ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>AI Readiness Score</p>
                    <div className={`text-[36px] font-light tracking-tight ${isDarkMode ? 'text-[#5380b3]' : 'text-[#5380b3]'}`}>
                      {companyData.readiness}%
                    </div>
                  </div>
                  
                  <p className={`text-[13px] font-medium ${isDarkMode ? 'text-white/50' : 'text-gray-600'}`}>
                    Redirecting to your dashboard...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Waitlist Card - Ultra iOS Style */}
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="relative">
            <div className={`relative backdrop-blur-[100px] border rounded-[28px] p-12 w-[520px] overflow-hidden ${
              isDarkMode 
                ? 'bg-black/70 border-white/[0.05] shadow-[0_20px_80px_0_rgba(0,0,0,0.9)]'
                : 'bg-white/80 border-gray-900/[0.08] shadow-[0_20px_80px_0_rgba(0,0,0,0.2)]'
            }`}>
              {/* Multiple glass layers for premium feel */}
              <div className={`absolute inset-0 rounded-[28px] pointer-events-none ${isDarkMode ? 'bg-gradient-to-br from-white/[0.03] via-transparent to-transparent' : 'bg-gradient-to-br from-white/60 via-transparent to-transparent'}`} />
              <div className={`absolute inset-0 rounded-[28px] pointer-events-none ${isDarkMode ? 'bg-gradient-to-t from-black/60 via-transparent to-white/[0.02]' : 'bg-gradient-to-t from-gray-100/40 via-transparent to-transparent'}`} />
              <div className={`absolute top-0 left-0 right-0 h-px ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300/30 to-transparent'}`} />
              
              <div className="relative z-10">
                {!isSubmitted ? (
                  <>
                    <div className="mb-10 text-center">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <Shield className={`w-7 h-7 ${isDarkMode ? 'text-[#5380b3]/80' : 'text-[#5380b3]'}`} strokeWidth={1.5} />
                      </div>
                      <h1 className={`text-[44px] font-light ${textColor} mb-4 tracking-[-0.02em] leading-[1.1]`}>
                        AI Adoption,<br />Simplified
                      </h1>
                      <p className={`${subTextColor} text-[15px] font-normal leading-relaxed max-w-sm mx-auto`}>
                        Join leading enterprises using data-driven insights to navigate their AI transformation journey
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
                          className="flex-1 text-base"
                          isDark={isDarkMode}
                        />
                        <Button
                          type="submit"
                          className="px-8 rounded-2xl shadow-xl"
                          isDark={isDarkMode}
                        >
                          Join Waitlist
                        </Button>
                      </div>
                    </form>

                    <div className="flex flex-col items-center justify-center text-center">
                      <p className={`text-[13px] font-semibold mb-4 ${isDarkMode ? 'text-[#5380b3]/80' : 'text-[#5380b3]'}`}>
                        Web Summit 2025 · Lisbon
                      </p>
                      {timeLeft.days === 0 && timeLeft.hours < 24 ? (
                        <div className={`text-[48px] font-light ${textColor} tracking-tight mb-2`}>
                          Today
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-6 text-center">
                          <div className="flex flex-col">
                            <div className={`text-[32px] font-light ${textColor} tabular-nums tracking-tight`}>
                              {timeLeft.days}
                            </div>
                            <div className={`text-[11px] ${subTextColor} uppercase tracking-wider mt-0.5 font-medium`}>
                              days
                            </div>
                          </div>
                          <div className={`${subTextColor} opacity-20 text-xl`}>·</div>
                          <div className="flex flex-col">
                            <div className={`text-[32px] font-light ${textColor} tabular-nums tracking-tight`}>
                              {String(timeLeft.hours).padStart(2, '0')}
                            </div>
                            <div className={`text-[11px] ${subTextColor} uppercase tracking-wider mt-0.5 font-medium`}>
                              hours
                            </div>
                          </div>
                          <div className={`${subTextColor} opacity-20 text-xl`}>·</div>
                          <div className="flex flex-col">
                            <div className={`text-[32px] font-light ${textColor} tabular-nums tracking-tight`}>
                              {String(timeLeft.minutes).padStart(2, '0')}
                            </div>
                            <div className={`text-[11px] ${subTextColor} uppercase tracking-wider mt-0.5 font-medium`}>
                              mins
                            </div>
                          </div>
                          <div className={`${subTextColor} opacity-20 text-xl`}>·</div>
                          <div className="flex flex-col">
                            <div className={`text-[32px] font-light ${textColor} tabular-nums tracking-tight`}>
                              {String(timeLeft.seconds).padStart(2, '0')}
                            </div>
                            <div className={`text-[11px] ${subTextColor} uppercase tracking-wider mt-0.5 font-medium`}>
                              secs
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`mt-8 pt-8 text-center ${isDarkMode ? 'border-t border-white/[0.04]' : 'border-t border-gray-900/[0.06]'}`}>
                      <p className={`text-[12px] font-medium ${isDarkMode ? 'text-white/30' : 'text-gray-500'}`}>
                        Trusted by 500+ enterprises worldwide
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full backdrop-blur-xl flex items-center justify-center border ${
                      isDarkMode
                        ? 'bg-black/40 border-green-400/20'
                        : 'bg-white/60 border-green-500/30'
                    }`}>
                      <Check className={`w-9 h-9 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} strokeWidth={2} />
                    </div>
                    <h3 className={`text-[26px] font-light ${textColor} mb-3 tracking-tight`}>
                      You're on the list!
                    </h3>
                    <p className={`${subTextColor} text-[15px] font-normal`}>
                      We'll notify you when we launch.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Subtle glow effect */}
            <div className={`absolute inset-0 rounded-[28px] blur-2xl scale-110 -z-10 ${
              isDarkMode
                ? 'bg-gradient-to-r from-[#5380b3]/5 via-[#a74f8b]/5 to-[#e0874e]/5 opacity-40'
                : 'bg-gradient-to-r from-[#5380b3]/8 via-[#a74f8b]/8 to-[#e0874e]/8 opacity-30'
            }`} />
          </div>
        </div>
      </div>
    </main>
  )
}