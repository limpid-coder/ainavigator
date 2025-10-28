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
      <div className="text-center">
        <div className="animate-spin mb-4 mx-auto">
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full" />
        </div>
        <p className="text-gray-400">Redirecting to assessment...</p>
      </div>
    </div>
  )
}
