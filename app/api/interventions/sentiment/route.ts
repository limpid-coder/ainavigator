import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/interventions/sentiment?level={1-5}&category={1-5}
 *
 * Returns 3 recommended interventions for a sentiment heatmap cell
 *
 * Query params:
 * - level: Sentiment level (1-5)
 * - category: Sentiment category (1-5)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const levelId = parseInt(searchParams.get('level') || '0')
    const categoryId = parseInt(searchParams.get('category') || '0')

    if (levelId < 1 || levelId > 5 || categoryId < 1 || categoryId > 5) {
      return NextResponse.json(
        { error: 'Invalid level or category. Must be between 1-5.' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the mapping for this cell
    const { data: mapping, error: mappingError } = await supabase
      .from('intervention_sentiment_mappings')
      .select('*')
      .eq('level_id', levelId)
      .eq('category_id', categoryId)
      .single()

    if (mappingError || !mapping) {
      return NextResponse.json(
        { error: 'No interventions found for this cell' },
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
      cell: {
        level_id: mapping.level_id,
        category_id: mapping.category_id,
        level_name: mapping.level_name,
        category: mapping.category,
        reason: mapping.reason,
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
