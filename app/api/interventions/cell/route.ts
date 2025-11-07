import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/interventions/cell
 *
 * Returns the 3 interventions mapped to a specific sentiment heatmap cell
 * Query params: level_id (1-5), category_id (1-5)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const levelId = searchParams.get('level_id')
    const categoryId = searchParams.get('category_id')

    if (!levelId || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required parameters: level_id and category_id' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch the cell mapping
    const { data: mapping, error: mappingError } = await supabase
      .from('intervention_sentiment_mappings')
      .select('*')
      .eq('level_id', parseInt(levelId))
      .eq('category_id', parseInt(categoryId))
      .single()

    if (mappingError) {
      console.error('Error fetching cell mapping:', mappingError)
      return NextResponse.json(
        { error: 'Failed to fetch cell mapping' },
        { status: 500 }
      )
    }

    if (!mapping) {
      return NextResponse.json(
        { error: 'No mapping found for this cell' },
        { status: 404 }
      )
    }

    // Fetch the intervention details for all three codes
    const codes = [
      mapping.primary_intervention_code,
      mapping.secondary_intervention_code,
      mapping.tertiary_intervention_code
    ]

    const { data: interventions, error: interventionsError } = await supabase
      .from('interventions')
      .select('*')
      .in('code', codes)

    if (interventionsError) {
      console.error('Error fetching interventions:', interventionsError)
      return NextResponse.json(
        { error: 'Failed to fetch intervention details' },
        { status: 500 }
      )
    }

    // Sort interventions by priority (primary, secondary, tertiary)
    const sortedInterventions = codes.map(code =>
      interventions?.find(i => i.code === code)
    ).filter(Boolean)

    return NextResponse.json({
      success: true,
      cell: {
        level_id: mapping.level_id,
        category_id: mapping.category_id,
        category: mapping.category,
        reason: mapping.reason,
        level_name: mapping.level_name
      },
      interventions: sortedInterventions,
      priority_order: {
        primary: mapping.primary_intervention_code,
        secondary: mapping.secondary_intervention_code,
        tertiary: mapping.tertiary_intervention_code
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
