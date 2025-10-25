'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500" />
              <span className="font-semibold text-lg">AI Navigator</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/demo" className="text-sm text-gray-400 hover:text-white">
                Demo
              </Link>
              <Link href="/upload" className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-sm">AI Readiness Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Transform Your
              <span className="block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                AI Journey
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Assess organizational readiness. Identify capability gaps.
              Accelerate AI adoption with data-driven insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo" className="px-6 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 inline-flex items-center justify-center gap-2">
                Explore Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/upload" className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 inline-flex items-center justify-center">
                Upload Your Data
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Core Capabilities</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: 'Sentiment Analysis',
                description: 'Understand organizational readiness across 25 key dimensions',
                metric: '67% of AI initiatives fail due to resistance'
              },
              {
                title: 'Capability Assessment',
                description: 'Measure maturity across 8 critical capability dimensions',
                metric: '8 dimensions, 32 constructs analyzed'
              },
              {
                title: 'Smart Recommendations',
                description: 'Get targeted interventions based on your specific gaps',
                metric: 'Actionable insights in 3 minutes'
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{feature.description}</p>
                <p className="text-xs text-teal-400 font-medium">{feature.metric}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-teal-500" />
              <span className="text-sm text-gray-400">AI Navigator</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 AI Navigator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
