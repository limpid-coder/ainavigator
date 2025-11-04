import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/interventions/capability?dimension={1-8}
 *
 * Returns 3 recommended interventions for a capability dimension
 *
 * Query params:
 * - dimension: Capability dimension (1-8)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dimensionId = parseInt(searchParams.get('dimension') || '0')

    if (dimensionId < 1 || dimensionId > 8) {
      return NextResponse.json(
        { error: 'Invalid dimension. Must be between 1-8.' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the mapping for this dimension
    const { data: mapping, error: mappingError } = await supabase
      .from('intervention_capability_mappings')
      .select('*')
      .eq('dimension_id', dimensionId)
      .single()

    if (mappingError || !mapping) {
      return NextResponse.json(
        { error: 'No interventions found for this dimension' },
        { status: 404 }
      )
    }

    // Fetch the three intervention details
    const { data: interventions, error: interventionsError } = await supabase
      .from('interventions')
      .select('*')
      .in('code', [
        mapping.primary_intervention_code,
        mapping.secondary_intervention_code,
        mapping.tertiary_intervention_code
      ])

    if (interventionsError) {
      console.error('Error fetching interventions:', interventionsError)
      return NextResponse.json(
        { error: 'Failed to fetch interventions' },
        { status: 500 }
      )
    }

    // Order interventions by priority (primary, secondary, tertiary)
    const orderedInterventions = [
      interventions.find(i => i.code === mapping.primary_intervention_code),
      interventions.find(i => i.code === mapping.secondary_intervention_code),
      interventions.find(i => i.code === mapping.tertiary_intervention_code),
    ].filter(Boolean)

    return NextResponse.json({
      success: true,
      dimension: {
        id: mapping.dimension_id,
        name: mapping.dimension_name,
        rationale: mapping.rationale,
      },
      interventions: orderedInterventions,
      count: orderedInterventions.length,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
