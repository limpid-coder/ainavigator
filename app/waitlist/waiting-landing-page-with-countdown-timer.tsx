'use client'

import React from "react"
import type { ReactElement } from "react"
import { useState, useEffect } from "react"
import Header from '@/components/shared/Header'

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`}
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
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    days: 89,
    hours: 14,
    minutes: 32,
    seconds: 45,
  })

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        }

        return { days, hours, minutes, seconds }
      })
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

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header />

      {/* Content Layer */}
      <section className="relative z-10 pt-20 pb-32">
        {/* Waitlist Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="glass rounded-2xl p-8">

              <div>
                {!isSubmitted ? (
                  <>
                    <div className="mb-8 text-center">
                      <h1 className="text-4xl font-bold text-white mb-4">
                        <span className="text-gradient">Join the Waitlist</span>
                      </h1>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Get early access to AI Navigator and transform
                        <br />
                        your organization's AI readiness
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-6">
                      <div className="flex gap-3">
                        <input
                          type="email"
                          placeholder="your@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1 h-12 px-4 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:border-teal-400/50 focus:outline-none focus:ring-1 focus:ring-teal-400/50 transition-all"
                        />
                        <button
                          type="submit"
                          className="btn-primary h-12 px-6"
                        >
                          Join Waitlist
                        </button>
                      </div>
                    </form>

                    <div className="flex items-center justify-center gap-3 mb-6 text-gray-400 text-sm">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-white text-xs">
                          2K
                        </div>
                      </div>
                      <span>Already joined</span>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-center">
                      <div>
                        <div className="text-3xl font-bold text-white">{timeLeft.days}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">days</div>
                      </div>
                      <div className="text-gray-700">:</div>
                      <div>
                        <div className="text-3xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">hours</div>
                      </div>
                      <div className="text-gray-700">:</div>
                      <div>
                        <div className="text-3xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">minutes</div>
                      </div>
                      <div className="text-gray-700">:</div>
                      <div>
                        <div className="text-3xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">seconds</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-400/10 flex items-center justify-center border border-teal-400/20">
                      <svg
                        className="w-8 h-8 text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">You're on the list!</h3>
                    <p className="text-gray-400">
                      We'll notify you when we launch. Thanks for joining!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}