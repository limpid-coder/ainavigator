import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/taboos?level={1-5}&category={1-5}
 *
 * Returns all taboos (typically 4) for a sentiment heatmap cell
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

    // Fetch all taboos for this cell
    const { data: taboos, error } = await supabase
      .from('taboos')
      .select('*')
      .eq('level_id', levelId)
      .eq('category_id', categoryId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching taboos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch taboos' },
        { status: 500 }
      )
    }

    if (!taboos || taboos.length === 0) {
      return NextResponse.json(
        { error: 'No taboos found for this cell' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      cell: {
        level_id: levelId,
        category_id: categoryId,
        level_name: taboos[0]?.level_name || '',
        root_cause: taboos[0]?.root_cause || '',
      },
      taboos: taboos.map(t => ({
        id: t.id,
        name: t.name,
        short_description: t.short_description,
        description: t.description,
        how_it_shows_up: t.how_it_shows_up,
        possible_actions: t.possible_actions,
        root_cause_explanation: t.root_cause_explanation,
      })),
      count: taboos.length,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
