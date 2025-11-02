import { NextRequest, NextResponse } from 'next/server'
import { gptService } from '@/lib/ai/gpt-service'

export async function POST(request: NextRequest) {
  try {
    const {
      problem_category,
      company_context
    } = await request.json()

    // Validate input
    if (!problem_category) {
      return NextResponse.json(
        { error: 'Invalid input: problem_category required' },
        { status: 400 }
      )
    }

    if (!company_context || !company_context.name) {
      return NextResponse.json(
        { error: 'Invalid input: company_context required' },
        { status: 400 }
      )
    }

    // Generate interventions using AI
    const interventions = await gptService.generateInterventions(
      problem_category,
      company_context
    )

    return NextResponse.json({
      success: true,
      data: {
        interventions,
        category_name: problem_category.category_name,
        generated_at: new Date().toISOString(),
        model_used: 'AI Analysis Engine'
      }
    })

  } catch (error: any) {
    console.error('GPT Interventions API Error:', error)
    
    // Return helpful error message
    return NextResponse.json(
      {
        error: 'Failed to generate interventions',
        details: error.message,
        suggestion: 'Check OpenAI API key and try again'
      },
      { status: 500 }
    )
  }
}


