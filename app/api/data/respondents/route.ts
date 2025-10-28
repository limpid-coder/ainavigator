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

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all respondents for this company
    const { data: respondents, error } = await supabase
      .from('respondents')
      .select('*')
      .eq('company_id', companyId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      )
    }

    // Transform to match SentimentResponse type structure
    const transformedData = respondents.map(r => ({
      RespondentID: r.respondent_id,
      Region: r.region,
      Department: r.department,
      Employment_type: r.employment_type,
      Age: r.age,
      UserLanguage: r.user_language,
      // Flatten sentiment scores with capitalized keys
      Sentiment_1: r.sentiment_1,
      Sentiment_2: r.sentiment_2,
      Sentiment_3: r.sentiment_3,
      Sentiment_4: r.sentiment_4,
      Sentiment_5: r.sentiment_5,
      Sentiment_6: r.sentiment_6,
      Sentiment_7: r.sentiment_7,
      Sentiment_8: r.sentiment_8,
      Sentiment_9: r.sentiment_9,
      Sentiment_10: r.sentiment_10,
      Sentiment_11: r.sentiment_11,
      Sentiment_12: r.sentiment_12,
      Sentiment_13: r.sentiment_13,
      Sentiment_14: r.sentiment_14,
      Sentiment_15: r.sentiment_15,
      Sentiment_16: r.sentiment_16,
      Sentiment_17: r.sentiment_17,
      Sentiment_18: r.sentiment_18,
      Sentiment_19: r.sentiment_19,
      Sentiment_20: r.sentiment_20,
      Sentiment_21: r.sentiment_21,
      Sentiment_22: r.sentiment_22,
      Sentiment_23: r.sentiment_23,
      Sentiment_24: r.sentiment_24,
      Sentiment_25: r.sentiment_25,
    }))

    return NextResponse.json({
      success: true,
      data: transformedData,
      count: transformedData.length,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

