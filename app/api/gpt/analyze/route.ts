import { NextRequest, NextResponse } from 'next/server'
import { gptService } from '@/lib/ai/gpt-service'

export async function POST(request: NextRequest) {
  try {
    const {
      lowest_cells,
      company_context,
      filters
    } = await request.json()

    // Validate input
    if (!lowest_cells || !Array.isArray(lowest_cells) || lowest_cells.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: lowest_cells required' },
        { status: 400 }
      )
    }

    if (!company_context || !company_context.name) {
      return NextResponse.json(
        { error: 'Invalid input: company_context required' },
        { status: 400 }
      )
    }

    // Generate problem categories using our AI
    const problemCategories = await gptService.generateProblemCategories(
      lowest_cells,
      company_context,
      filters || {}
    )

    return NextResponse.json({
      success: true,
      data: {
        problem_categories: problemCategories,
        generated_at: new Date().toISOString(),
        model_used: 'AI Analysis Engine'
      }
    })

  } catch (error: any) {
    console.error('GPT Analysis API Error:', error)
    
    // Return helpful error message
    return NextResponse.json(
      {
        error: 'Failed to generate problem categories',
        details: error.message,
        suggestion: 'Check OpenAI API key and try again'
      },
      { status: 500 }
    )
  }
}


