import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/data/open-ended
 *
 * Returns open-ended responses for capability assessment questions (Q39, Q40, Q41)
 *
 * Query params:
 * - survey_wave: Filter by specific survey wave (optional)
 * - assessment_date: Filter by specific assessment date (optional)
 * - limit: Maximum number of responses to return (default: 100)
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const surveyWave = searchParams.get('survey_wave')
    const assessmentDate = searchParams.get('assessment_date')
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Build query with filters
    let query = supabase
      .from('respondents')
      .select('respondent_id, q39_achievements, q40_challenges, q41_future_goals, assessment_date, survey_wave, region, department, age')
      .eq('company_id', companyId)
      .or('q39_achievements.not.is.null,q40_challenges.not.is.null,q41_future_goals.not.is.null')
      .limit(limit)

    // Apply temporal filters
    if (surveyWave) {
      query = query.eq('survey_wave', surveyWave)
    }
    if (assessmentDate) {
      query = query.eq('assessment_date', assessmentDate)
    }

    const { data: responses, error } = await query

    if (error) {
      console.error('Supabase error fetching open-ended responses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch open-ended responses' },
        { status: 500 }
      )
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        metadata: {
          total: 0,
          companyId,
          message: 'No open-ended responses found for this company'
        }
      })
    }

    // Aggregate all text responses for AI summarization
    const allResponses: string[] = []

    responses.forEach((resp) => {
      if (resp.q39_achievements) allResponses.push(resp.q39_achievements)
      if (resp.q40_challenges) allResponses.push(resp.q40_challenges)
      if (resp.q41_future_goals) allResponses.push(resp.q41_future_goals)
    })

    return NextResponse.json({
      success: true,
      data: responses,
      allResponses, // Flat array of all text for AI processing
      metadata: {
        total: responses.length,
        totalResponses: allResponses.length,
        companyId,
        surveyWave: surveyWave || 'all',
        assessmentDate: assessmentDate || 'all',
        breakdown: {
          q39Count: responses.filter(r => r.q39_achievements).length,
          q40Count: responses.filter(r => r.q40_challenges).length,
          q41Count: responses.filter(r => r.q41_future_goals).length
        }
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
