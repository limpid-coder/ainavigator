import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculateSentimentBenchmark } from '@/lib/services/benchmark.service'
import { calculateCapabilityBenchmarkFromScores } from '@/lib/services/capability-benchmark.service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Combined overview endpoint that returns both sentiment and capability benchmarks
 */
export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')
    const { searchParams } = new URL(request.url)

    const region = searchParams.get('region') || undefined
    const department = searchParams.get('department') || undefined
    const industry = searchParams.get('industry') || undefined
    const continent = searchParams.get('continent') || undefined

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch sentiment data from respondents table
    const { data: allRespondents, error: allError } = await supabase
      .from('respondents')
      .select('*')

    if (allError) {
      console.error('Supabase error fetching respondent data:', allError)
      return NextResponse.json(
        { error: 'Failed to fetch sentiment benchmark data' },
        { status: 500 }
      )
    }

    const { data: companyRespondents, error: companyError } = await supabase
      .from('respondents')
      .select('*')
      .eq('company_id', companyId)

    if (companyError) {
      console.error('Supabase error fetching company respondent data:', companyError)
      return NextResponse.json(
        { error: 'Failed to fetch company sentiment data' },
        { status: 500 }
      )
    }

    // Fetch capability data from capability_scores table
    const { data: allCapabilityScores, error: capAllError } = await supabase
      .from('capability_scores')
      .select('*')

    if (capAllError) {
      console.error('Supabase error fetching capability scores:', capAllError)
      return NextResponse.json(
        { error: 'Failed to fetch capability benchmark data' },
        { status: 500 }
      )
    }

    const { data: companyCapabilityScores, error: capCompanyError } = await supabase
      .from('capability_scores')
      .select('*')
      .eq('company_id', companyId)

    if (capCompanyError) {
      console.error('Supabase error fetching company capability scores:', capCompanyError)
      return NextResponse.json(
        { error: 'Failed to fetch company capability data' },
        { status: 500 }
      )
    }

    // Calculate sentiment benchmark
    const sentimentBenchmark = calculateSentimentBenchmark(
      allRespondents || [],
      companyRespondents || [],
      { region, department, industry }
    )

    // Calculate capability benchmark
    const capabilityBenchmark = calculateCapabilityBenchmarkFromScores(
      allCapabilityScores || [],
      companyCapabilityScores || [],
      { region, industry, continent }
    )

    // Get company info
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single()

    return NextResponse.json({
      success: true,
      company: {
        id: company?.id,
        name: company?.name,
        displayName: company?.display_name,
      },
      sentiment: sentimentBenchmark,
      capability: capabilityBenchmark,
      filters: { region, department, industry, continent },
      metadata: {
        sentiment: {
          totalRespondents: allRespondents?.length || 0,
          companyRespondents: companyRespondents?.length || 0,
        },
        capability: {
          totalScores: allCapabilityScores?.length || 0,
          companyScores: companyCapabilityScores?.length || 0,
          uniqueRespondents: new Set((companyCapabilityScores || []).map((s: any) => s.respondent_id)).size,
        },
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
