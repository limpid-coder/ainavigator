import { NextResponse } from 'next/server'

export async function POST() {
  // Simple demo logout - just return success
  // Client will clear session storage
  return NextResponse.json({ success: true })
}
