import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface NextStepIntervention {
  code: string
  name: string
  level: string
  core_function: string
}

/**
 * GET /api/interventions/{code}
 *
 * Returns full details for a specific intervention including next steps
 *
 * Path params:
 * - code: Intervention code (A1, A2, B1, etc.)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!code) {
      return NextResponse.json(
        { error: 'Intervention code is required' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get intervention details
    const { data: intervention, error: interventionError } = await supabase
      .from('interventions')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (interventionError || !intervention) {
      return NextResponse.json(
        { error: 'Intervention not found' },
        { status: 404 }
      )
    }

    // Get next steps for this intervention
    const { data: nextSteps, error: nextStepsError } = await supabase
      .from('intervention_next_steps')
      .select('*')
      .eq('intervention_code', code.toUpperCase())
      .single()

    const nextInterventions: NextStepIntervention[] = []
    if (!nextStepsError && nextSteps) {
      // Fetch details for the next interventions
      const { data: nextDetails, error: nextDetailsError } = await supabase
        .from('interventions')
        .select('code, name, level, core_function')
        .in('code', [
          nextSteps.primary_next_code,
          nextSteps.secondary_next_code,
          nextSteps.tertiary_next_code
        ])

      if (!nextDetailsError && nextDetails) {
        // Order by priority
        const ordered = [
          nextDetails.find(i => i.code === nextSteps.primary_next_code),
          nextDetails.find(i => i.code === nextSteps.secondary_next_code),
          nextDetails.find(i => i.code === nextSteps.tertiary_next_code),
        ].filter((item): item is NextStepIntervention => item !== undefined)

        nextInterventions.push(...ordered)
      }
    }

    return NextResponse.json({
      success: true,
      intervention: {
        ...intervention,
        next_steps: {
          rationale: nextSteps?.rationale || null,
          interventions: nextInterventions,
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
