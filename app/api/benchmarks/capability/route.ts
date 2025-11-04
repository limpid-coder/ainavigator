import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { calculateCapabilityBenchmarkFromScores } from '@/lib/services/capability-benchmark.service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')
    const { searchParams } = new URL(request.url)

    const region = searchParams.get('region') || undefined
    const industry = searchParams.get('industry') || undefined
    const continent = searchParams.get('continent') || undefined

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all capability scores across all companies (for benchmark)
    const { data: allScores, error: allError } = await supabase
      .from('capability_scores')
      .select('*')

    if (allError) {
      console.error('Supabase error fetching all capability scores:', allError)
      return NextResponse.json(
        { error: 'Failed to fetch benchmark data' },
        { status: 500 }
      )
    }

    // Fetch current company's capability scores
    const { data: companyScores, error: companyError } = await supabase
      .from('capability_scores')
      .select('*')
      .eq('company_id', companyId)

    if (companyError) {
      console.error('Supabase error fetching company capability scores:', companyError)
      return NextResponse.json(
        { error: 'Failed to fetch company data' },
        { status: 500 }
      )
    }

    // Calculate capability benchmark
    const benchmark = calculateCapabilityBenchmarkFromScores(
      allScores || [],
      companyScores || [],
      { region, industry, continent }
    )

    return NextResponse.json({
      success: true,
      benchmark,
      filters: { region, industry, continent },
      companyId,
      metadata: {
        totalScores: allScores?.length || 0,
        companyScores: companyScores?.length || 0,
        uniqueRespondents: new Set((companyScores || []).map((s: any) => s.respondent_id)).size,
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
