'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.push('/login')
  }, [router])

  return null
}
