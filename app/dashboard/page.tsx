'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Redirect to new assessment page
export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/assessment')
  }, [router])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/10 via-transparent to-transparent" />
      </div>
      <div className="relative z-10 text-center">
        <div className="relative mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center animate-pulse shadow-2xl shadow-teal-500/30" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 animate-ping opacity-20" />
        </div>
        <p className="text-sm text-gray-400">Redirecting to assessment...</p>
        <div className="mt-6 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
