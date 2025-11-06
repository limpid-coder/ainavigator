import { NextRequest, NextResponse } from 'next/server'
import { gptService } from '@/lib/ai/gpt-service'

export async function POST(request: NextRequest) {
  try {
    const {
      weak_dimensions,
      company_context,
      filters
    } = await request.json()

    // Validate input
    if (!weak_dimensions || !Array.isArray(weak_dimensions) || weak_dimensions.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: weak_dimensions required' },
        { status: 400 }
      )
    }

    if (!company_context || !company_context.name) {
      return NextResponse.json(
        { error: 'Invalid input: company_context required' },
        { status: 400 }
      )
    }

    // Generate capability insights using AI
    const insights = await gptService.generateCapabilityInsights(
      weak_dimensions,
      company_context,
      filters || {}
    )

    return NextResponse.json({
      success: true,
      data: {
        insights: insights,
        generated_at: new Date().toISOString(),
        model_used: 'AI Analysis Engine'
      }
    })

  } catch (error: any) {
    console.error('GPT Capability Insights API Error:', error)

    // Return helpful error message
    return NextResponse.json(
      {
        error: 'Failed to generate capability insights',
        details: error.message,
        suggestion: 'Check OpenAI API key and try again'
      },
      { status: 500 }
    )
  }
}
