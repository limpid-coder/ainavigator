import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 401 }
      )
    }

    // Parse temporal query parameters
    const { searchParams } = new URL(request.url)
    const assessmentDate = searchParams.get('assessment_date') // Specific date (YYYY-MM-DD)
    const surveyWave = searchParams.get('survey_wave') // Wave identifier (e.g., 'baseline', 'wave-2')
    const dateFrom = searchParams.get('date_from') // Date range start
    const dateTo = searchParams.get('date_to') // Date range end

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Build query with temporal filters
    let query = supabase
      .from('respondents')
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
    // If no temporal filters provided, returns latest assessment by default
    // This maintains backward compatibility

    const { data: respondents, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }

    // Transform to match SentimentResponse type structure
    // Returns lowercase field names matching database schema
    const transformedData = respondents.map(r => ({
      RespondentID: r.respondent_id,
      Region: r.region,
      Department: r.department,
      Employment_type: r.employment_type,
      Age: r.age,
      UserLanguage: r.user_language,
      Industry: r.industry,
      Continent: r.continent,
      // Sentiment scores with lowercase keys matching database schema
      sentiment_1: r.sentiment_1,
      sentiment_2: r.sentiment_2,
      sentiment_3: r.sentiment_3,
      sentiment_4: r.sentiment_4,
      sentiment_5: r.sentiment_5,
      sentiment_6: r.sentiment_6,
      sentiment_7: r.sentiment_7,
      sentiment_8: r.sentiment_8,
      sentiment_9: r.sentiment_9,
      sentiment_10: r.sentiment_10,
      sentiment_11: r.sentiment_11,
      sentiment_12: r.sentiment_12,
      sentiment_13: r.sentiment_13,
      sentiment_14: r.sentiment_14,
      sentiment_15: r.sentiment_15,
      sentiment_16: r.sentiment_16,
      sentiment_17: r.sentiment_17,
      sentiment_18: r.sentiment_18,
      sentiment_19: r.sentiment_19,
      sentiment_20: r.sentiment_20,
      sentiment_21: r.sentiment_21,
      sentiment_22: r.sentiment_22,
      sentiment_23: r.sentiment_23,
      sentiment_24: r.sentiment_24,
      sentiment_25: r.sentiment_25,
      // Capability construct scores are now in capability_scores table (LONG format)
      // No longer stored in respondents table
    }))

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
      metadata: {
        companyId,
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

