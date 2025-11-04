import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/data/assessment-periods
 *
 * Returns list of assessment periods/waves for a company
 * Enables temporal tracking and progress measurement over time
 *
 * Headers:
 * - x-company-id: Company identifier (required)
 */
export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required in x-company-id header' },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch assessment periods ordered by date (most recent first)
    const { data: periods, error } = await supabase
      .from('assessment_periods')
      .select('*')
      .eq('company_id', companyId)
      .order('assessment_date', { ascending: false })

    if (error) {
      console.error('Supabase error fetching assessment periods:', error)
      return NextResponse.json(
        { error: 'Failed to fetch assessment periods' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: periods || [],
      metadata: {
        total: periods?.length || 0,
        companyId,
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/data/assessment-periods
 *
 * Create a new assessment period/wave
 * Used when uploading new assessment data
 *
 * Body:
 * - survey_wave: string (required) - Unique wave identifier
 * - assessment_date: string (required) - Date in YYYY-MM-DD format
 * - name: string (required) - Display name for the assessment
 * - description: string (optional)
 * - interventions_applied: string[] (optional) - Intervention codes applied
 */
export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required in x-company-id header' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { survey_wave, assessment_date, name, description, interventions_applied } = body

    if (!survey_wave || !assessment_date || !name) {
      return NextResponse.json(
        { error: 'survey_wave, assessment_date, and name are required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create new assessment period
    const { data: period, error } = await supabase
      .from('assessment_periods')
      .insert({
        company_id: companyId,
        survey_wave,
        assessment_date,
        name,
        description,
        interventions_applied: interventions_applied || [],
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating assessment period:', error)
      return NextResponse.json(
        { error: 'Failed to create assessment period' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: period
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
