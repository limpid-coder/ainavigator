import { NextRequest, NextResponse } from 'next/server'
import { gptService } from '@/lib/ai/gpt-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sentiment_data,
      capability_data,
      company_context,
      filters,
      type,
      open_ended_responses,
      dimension_context
    } = body

    let result

    if (type === 'executive') {
      // Generate executive summary
      result = await gptService.generateExecutiveSummary(
        sentiment_data,
        capability_data,
        company_context,
        filters || {}
      )
    } else if (type === 'open_ended') {
      // Summarize open-ended responses
      if (!open_ended_responses || !Array.isArray(open_ended_responses)) {
        return NextResponse.json(
          { error: 'Invalid input: open_ended_responses required' },
          { status: 400 }
        )
      }
      
      result = await gptService.summarizeOpenEndedResponses(
        open_ended_responses,
        dimension_context
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid type: must be "executive" or "open_ended"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result,
      generated_at: new Date().toISOString(),
      model_used: 'gpt-4-turbo-preview'
    })

  } catch (error: any) {
    console.error('GPT Summary API Error:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to generate summary',
        details: error.message
      },
      { status: 500 }
    )
  }
}


