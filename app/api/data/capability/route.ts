import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/data/capability
 *
 * Returns capability assessment data for a company
 * Transforms LONG format (capability_scores table) to WIDE format for frontend compatibility
 *
 * Query params:
 * - (none - uses company from header)
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

    // Parse temporal query parameters
    const { searchParams } = new URL(request.url)
    const assessmentDate = searchParams.get('assessment_date')
    const surveyWave = searchParams.get('survey_wave')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Build query with temporal filters
    let query = supabase
      .from('capability_scores')
      .select('*')
      .eq('company_id', companyId)

    // Apply temporal filters
    if (assessmentDate) {
      query = query.eq('assessment_date', assessmentDate)
    } else if (surveyWave) {
      query = query.eq('survey_wave', surveyWave)
    } else if (dateFrom && dateTo) {
      query = query.gte('assessment_date', dateFrom).lte('assessment_date', dateTo)
    } else if (dateFrom) {
      query = query.gte('assessment_date', dateFrom)
    } else if (dateTo) {
      query = query.lte('assessment_date', dateTo)
    }

    const { data: scores, error: scoresError } = await query

    if (scoresError) {
      console.error('Supabase error fetching capability scores:', scoresError)
      return NextResponse.json(
        { error: 'Failed to fetch capability scores' },
        { status: 500 }
      )
    }

    if (!scores || scores.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        metadata: {
          total: 0,
          companyId,
        }
      })
    }

    // Transform LONG format to WIDE format
    // Group by respondent_id and pivot construct scores into columns
    const respondentMap = new Map<string, any>()

    scores.forEach((score: any) => {
      const respondentId = score.respondent_id

      if (!respondentMap.has(respondentId)) {
        respondentMap.set(respondentId, {
          RespondentID: respondentId,
          Region: score.country_synthetic || 'Unknown',
          Department: null, // capability_scores doesn't have department
          Employment_type: score.role_synthetic || null, // Map role_synthetic to Employment_type for filter compatibility
          Age: null, // capability_scores doesn't have age
          UserLanguage: 'EN',
          Industry: score.industry_synthetic || null,
          Continent: score.continent_synthetic || null,
          Role: score.role_synthetic || null,
        })
      }

      // Add construct score (construct_1 through construct_32)
      const constructKey = `construct_${score.construct_id}`
      respondentMap.get(respondentId)[constructKey] = score.score
    })

    const transformedData = Array.from(respondentMap.values())

    return NextResponse.json({
      success: true,
      data: transformedData,
      metadata: {
        total: transformedData.length,
        companyId,
        totalScores: scores.length,
        assessmentDate: assessmentDate || 'latest',
        surveyWave: surveyWave || 'all',
        temporalFilter: assessmentDate || surveyWave || (dateFrom && dateTo) ? 'applied' : 'none'
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
