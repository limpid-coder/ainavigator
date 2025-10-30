/**
 * Advanced Conversational AI Chat Service
 * Provides context-aware, action-capable chat functionality for the entire platform
 */

import { generateChatSystemPrompt, generateContextMessage, generateDataSummary } from './chat-prompts'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: any
}

export interface PlatformContext {
  current_page: string
  user_info: {
    name: string
    organization: string
  }
  data_state: {
    has_sentiment_data: boolean
    has_capability_data: boolean
    sentiment_count: number
    capability_count: number
    sentiment_summary?: any
    capability_summary?: any
  }
  active_filters?: any
  timestamp: string
  recent_actions?: string[]
}

export interface ChatAction {
  type: 'navigate' | 'filter' | 'query' | 'generate' | 'visualize'
  payload: any
  description: string
}

export interface ChatResponse {
  message: string
  metadata?: {
    actions?: ChatAction[]
    suggestions?: string[]
    data_insights?: any
    confidence?: number
  }
  tokensUsed?: number
  streaming?: boolean
}

export class ChatCompletionService {
  private apiKey: string
  private model: string
  private conversationMemory: Map<string, ChatMessage[]> = new Map()
  
  constructor(apiKey?: string, model: string = 'gpt-4o') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || ''
    this.model = model // Upgraded to GPT-4o for better reasoning
  }
  
  async getChatResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    context: PlatformContext
  ): Promise<ChatResponse> {
    try {
      // Enhance context with data summaries if available
      const enhancedContext = await this.enhanceContext(context)
      
      // Build message array for OpenAI with advanced system prompts
      const messages = [
        {
          role: 'system',
          content: generateChatSystemPrompt()
        },
        {
          role: 'system',
          content: generateContextMessage(enhancedContext)
        },
        // Add data summary if available
        ...(enhancedContext.data_state.sentiment_summary || enhancedContext.data_state.capability_summary ? [{
          role: 'system',
          content: generateDataSummary(enhancedContext)
        }] : []),
        // Include recent conversation history (last 15 messages for better context)
        ...conversationHistory.slice(-15).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ]

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 2500,
          presence_penalty: 0.6,
          frequency_penalty: 0.3
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API error: ${response.statusText} - ${JSON.stringify(errorData)}`)
      }
      
      const data = await response.json()
      const assistantMessage = data.choices[0].message.content
      
      // Parse metadata and extract insights
      const metadata = await this.parseResponseMetadata(assistantMessage, context)
      
      return {
        message: assistantMessage,
        metadata,
        tokensUsed: data.usage?.total_tokens
      }
      
    } catch (error) {
      console.error('Chat Completion Error:', error)
      throw error
    }
  }
  
  /**
   * Stream chat response for real-time output
   */
  async *streamChatResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    context: PlatformContext
  ): AsyncGenerator<string, void, unknown> {
    try {
      const enhancedContext = await this.enhanceContext(context)
      
      const messages = [
        {
          role: 'system',
          content: generateChatSystemPrompt()
        },
        {
          role: 'system',
          content: generateContextMessage(enhancedContext)
        },
        ...(enhancedContext.data_state.sentiment_summary || enhancedContext.data_state.capability_summary ? [{
          role: 'system',
          content: generateDataSummary(enhancedContext)
        }] : []),
        ...conversationHistory.slice(-15).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ]

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 2500,
          presence_penalty: 0.6,
          frequency_penalty: 0.3,
          stream: true
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body reader')
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(line => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content
              if (content) {
                yield content
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error)
      throw error
    }
  }
  
  /**
   * Enhance context with additional data insights
   */
  private async enhanceContext(context: PlatformContext): Promise<PlatformContext> {
    // This would integrate with your data services to fetch summaries
    // For now, return context as-is, but structure is ready for enhancement
    return {
      ...context,
      recent_actions: [] // Could track recent user actions
    }
  }
  
  /**
   * Define available functions for the AI to call
   */
  private getAvailableFunctions() {
    return [
      {
        name: 'navigate_to_page',
        description: 'Navigate user to a specific page in the platform',
        parameters: {
          type: 'object',
          properties: {
            page: {
              type: 'string',
              enum: ['dashboard', 'assessment', 'demo', 'upload'],
              description: 'The page to navigate to'
            },
            reason: {
              type: 'string',
              description: 'Why this navigation is helpful'
            }
          },
          required: ['page', 'reason']
        }
      },
      {
        name: 'apply_filter',
        description: 'Apply a filter to the current data view',
        parameters: {
          type: 'object',
          properties: {
            filter_type: {
              type: 'string',
              enum: ['department', 'region', 'age_group', 'business_unit'],
              description: 'Type of filter to apply'
            },
            filter_value: {
              type: 'string',
              description: 'Value to filter by'
            }
          },
          required: ['filter_type', 'filter_value']
        }
      },
      {
        name: 'generate_report',
        description: 'Generate a specific type of report',
        parameters: {
          type: 'object',
          properties: {
            report_type: {
              type: 'string',
              enum: ['executive_summary', 'problem_analysis', 'capability_assessment', 'recommendations'],
              description: 'Type of report to generate'
            },
            focus_area: {
              type: 'string',
              description: 'Specific area to focus the report on (optional)'
            }
          },
          required: ['report_type']
        }
      },
      {
        name: 'query_data',
        description: 'Query specific data from the platform',
        parameters: {
          type: 'object',
          properties: {
            query_type: {
              type: 'string',
              enum: ['sentiment_scores', 'capability_scores', 'top_problems', 'dimension_breakdown', 'department_comparison'],
              description: 'Type of data query'
            },
            filters: {
              type: 'object',
              description: 'Optional filters to apply to the query'
            }
          },
          required: ['query_type']
        }
      }
    ]
  }
  
  /**
   * Parse function calls into actions
   */
  private parseFunctionCall(functionCall: any): ChatAction[] {
    const { name, arguments: args } = functionCall
    const parsedArgs = JSON.parse(args)
    
    const actionMap: Record<string, (args: any) => ChatAction> = {
      navigate_to_page: (args) => ({
        type: 'navigate',
        payload: { page: args.page },
        description: args.reason || `Navigate to ${args.page}`
      }),
      apply_filter: (args) => ({
        type: 'filter',
        payload: { type: args.filter_type, value: args.filter_value },
        description: `Filter by ${args.filter_type}: ${args.filter_value}`
      }),
      generate_report: (args) => ({
        type: 'generate',
        payload: { type: args.report_type, focus: args.focus_area },
        description: `Generate ${args.report_type} report`
      }),
      query_data: (args) => ({
        type: 'query',
        payload: { query: args.query_type, filters: args.filters },
        description: `Query ${args.query_type} data`
      })
    }
    
    const action = actionMap[name]?.(parsedArgs)
    return action ? [action] : []
  }
  
  private async parseResponseMetadata(
    message: string, 
    context: PlatformContext
  ): Promise<ChatResponse['metadata']> {
    const metadata: ChatResponse['metadata'] = {}
    
    // Extract action markers
    const actionPattern = /\[ACTION:([^:]+):([^\]]+)\]/g
    const actions: ChatAction[] = []
    let match
    
    while ((match = actionPattern.exec(message)) !== null) {
      const [_, actionType, actionData] = match
      
      if (actionType === 'navigate') {
        actions.push({
          type: 'navigate',
          payload: { page: actionData },
          description: `Navigate to ${actionData}`
        })
      } else if (actionType === 'filter') {
        const [type, value] = actionData.split('=')
        actions.push({
          type: 'filter',
          payload: { type, value },
          description: `Filter by ${type}: ${value}`
        })
      }
    }
    
    if (actions.length > 0) {
      metadata.actions = actions
    }
    
    // Generate smart suggestions based on context and message
    metadata.suggestions = this.generateSmartSuggestions(message, context)
    
    // Calculate confidence based on data availability
    metadata.confidence = this.calculateConfidence(context)
    
    return metadata
  }
  
  /**
   * Generate contextual smart suggestions
   */
  private generateSmartSuggestions(message: string, context: PlatformContext): string[] {
    const suggestions: string[] = []
    
    // Context-aware suggestions
    if (context.current_page === '/dashboard') {
      suggestions.push('Show me detailed capability analysis')
      suggestions.push('Which department needs attention?')
    } else if (context.current_page === '/assessment') {
      suggestions.push('Compare dimensions side by side')
      suggestions.push('Generate intervention recommendations')
    }
    
    // Data-driven suggestions
    if (context.data_state.has_sentiment_data) {
      suggestions.push('What are the top 3 sentiment concerns?')
    }
    
    if (context.data_state.has_capability_data) {
      suggestions.push('Which capability dimension is weakest?')
    }
    
    // Message-based suggestions
    if (message.toLowerCase().includes('problem')) {
      suggestions.push('What interventions would address this?')
      suggestions.push('Show me the business impact')
    }
    
    return suggestions.slice(0, 3)
  }
  
  /**
   * Calculate AI response confidence
   */
  private calculateConfidence(context: PlatformContext): number {
    let confidence = 0.5 // Base confidence
    
    if (context.data_state.has_sentiment_data) confidence += 0.2
    if (context.data_state.has_capability_data) confidence += 0.2
    if (context.data_state.sentiment_count > 100) confidence += 0.05
    if (context.data_state.capability_count > 100) confidence += 0.05
    
    return Math.min(confidence, 1.0)
  }
  
  /**
   * Generate a smart summary of data for chat context
   */
  async generateDataSummary(
    sentimentData: any[],
    capabilityData: any[]
  ): Promise<string> {
    const summary = []
    
    if (sentimentData.length > 0) {
      const avgSentiment = sentimentData.reduce((acc, d) => acc + (d.score || 0), 0) / sentimentData.length
      summary.push(`Sentiment: ${sentimentData.length} responses, avg score ${avgSentiment.toFixed(2)}/5.0`)
    }
    
    if (capabilityData.length > 0) {
      const avgCapability = capabilityData.reduce((acc, d) => acc + (d.score || 0), 0) / capabilityData.length
      summary.push(`Capability: ${capabilityData.length} responses, avg score ${avgCapability.toFixed(2)}/5.0`)
    }
    
    return summary.join(' | ')
  }
}

export const chatService = new ChatCompletionService()

