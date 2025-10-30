import { NextRequest, NextResponse } from 'next/server'
import { ChatCompletionService } from '@/lib/ai/chat-service'

export const runtime = 'edge' // Enable edge runtime for streaming

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      message,
      conversation_history = [],
      context = {},
      stream = false
    } = body

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid input: message required' 
        },
        { status: 400 }
      )
    }

    // Initialize chat service with GPT-4o for better intelligence
    const chatService = new ChatCompletionService()
    
    // Handle streaming response
    if (stream) {
      const encoder = new TextEncoder()
      
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            const streamGen = chatService.streamChatResponse(
              message,
              conversation_history,
              context
            )
            
            for await (const chunk of streamGen) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`))
            }
            
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error) {
            console.error('Streaming error:', error)
            controller.error(error)
          }
        }
      })
      
      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }
    
    // Get AI response with full platform context
    const response = await chatService.getChatResponse(
      message,
      conversation_history,
      context
    )

    return NextResponse.json({
      success: true,
      response: response.message,
      metadata: response.metadata,
      tokens_used: response.tokensUsed,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process chat message',
        details: error.message,
        suggestion: 'Try rephrasing your question or check your API connection'
      },
      { status: 500 }
    )
  }
}

