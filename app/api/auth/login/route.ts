import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Query demo_users table
    const { data: user, error } = await supabase
      .from('demo_users')
      .select(`
        id,
        email,
        full_name,
        role,
        company_id,
        companies (
          id,
          name,
          display_name,
          logo_url
        )
      `)
      .eq('email', email)
      .eq('password_hash', password) // Simple demo auth - use bcrypt in production
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session data
    const sessionData = {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      company: user.companies,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    }

    // Return session data - client will store in sessionStorage/localStorage
    return NextResponse.json({
      success: true,
      session: sessionData,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


