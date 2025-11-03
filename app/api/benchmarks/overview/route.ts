import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculateSentimentBenchmark, calculateCapabilityBenchmark } from '@/lib/services/benchmark.service'

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

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all respondents across all companies (for benchmark)
    const { data: allRespondents, error: allError } = await supabase
      .from('respondents')
      .select('*')

    if (allError) {
      console.error('Supabase error fetching all data:', allError)
      return NextResponse.json(
        { error: 'Failed to fetch benchmark data' },
        { status: 500 }
      )
    }

    // Fetch current company's respondents
    const { data: companyRespondents, error: companyError } = await supabase
      .from('respondents')
      .select('*')
      .eq('company_id', companyId)

    if (companyError) {
      console.error('Supabase error fetching company data:', companyError)
      return NextResponse.json(
        { error: 'Failed to fetch company data' },
        { status: 500 }
      )
    }

    // Calculate both benchmarks
    const sentimentBenchmark = calculateSentimentBenchmark(
      allRespondents || [],
      companyRespondents || [],
      { region, department, industry }
    )

    const capabilityBenchmark = calculateCapabilityBenchmark(
      allRespondents || [],
      companyRespondents || [],
      { region, department, industry }
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
      filters: { region, department, industry },
      metadata: {
        totalCompanies: new Set(allRespondents?.map(r => r.company_id) || []).size,
        totalRespondents: allRespondents?.length || 0,
        companyRespondents: companyRespondents?.length || 0,
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
