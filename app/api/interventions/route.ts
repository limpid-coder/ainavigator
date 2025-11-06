import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/interventions
 *
 * Returns all interventions from the catalogue
 * Supports both large/strategic and small/tactical interventions
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all interventions
    const { data: interventions, error: interventionsError } = await supabase
      .from('interventions')
      .select('*')
      .order('code', { ascending: true })

    if (interventionsError) {
      console.error('Error fetching interventions:', interventionsError)
      return NextResponse.json(
        { error: 'Failed to fetch interventions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      interventions: interventions || [],
      count: interventions?.length || 0
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
