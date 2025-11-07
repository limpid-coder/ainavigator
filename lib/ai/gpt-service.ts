// GPT-4/5 Integration Service for AI Navigator

import { SentimentCellData } from '../calculations/sentiment-ranking'
import { DimensionScore } from '../calculations/capability-analysis'
import {
  generateProblemCategoryPrompt,
  generateInterventionsPrompt,
  generateExecutiveSummaryPrompt,
  generateOpenEndedSummaryPrompt,
  CompanyContext
} from './prompts'

export interface ProblemCategory {
  category_id: string
  category_name: string
  reason: string
  level: string
  score: number
  affected_count: number
  rank: number
  severity: 'critical' | 'high' | 'medium'
  description: string
  business_impact: string
  examples: string[]
}

export interface Intervention {
  number: number
  title: string
  what_to_do: string
  why_it_works: string
  effort: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  timeframe: string
  budget_estimate: string
  required_resources: string[]
  key_stakeholders: string[]
  success_metrics: string[]
  quick_wins: string[]
}

export interface ExecutiveSummary {
  executive_summary: string
  key_priorities: string[]
  recommended_first_step: string
}

export interface OpenEndedSummary {
  overall_picture: string
  achievements: string
  challenges: string
  milestones: string
}

export class GPTService {
  private apiKey: string
  private model: string
  
  constructor(apiKey?: string, model: string = 'gpt-4o-mini') {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || ''
    this.model = model
  }
  
  async generateProblemCategories(
    lowestCells: SentimentCellData[],
    companyContext: CompanyContext,
    filters: Record<string, any> = {}
  ): Promise<ProblemCategory[]> {
    const prompt = generateProblemCategoryPrompt(lowestCells, companyContext, filters)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI adoption consultant who creates insightful problem categories from survey data. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 2000
        })
      })
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }
      
      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)
      
      return result.problem_categories || []
    } catch (error) {
      console.error('GPT Problem Categories Error:', error)
      throw error
    }
  }
  
  async generateInterventions(
    problemCategory: ProblemCategory,
    companyContext: CompanyContext
  ): Promise<Intervention[]> {
    const prompt = generateInterventionsPrompt(problemCategory, companyContext)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert at designing creative, actionable interventions for organizational AI adoption challenges. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.8, // Higher for creativity
          max_tokens: 2500
        })
      })
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }
      
      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)
      
      return result.interventions || []
    } catch (error) {
      console.error('GPT Interventions Error:', error)
      throw error
    }
  }
  
  async generateExecutiveSummary(
    sentimentData: any,
    capabilityData: any,
    companyContext: CompanyContext,
    filters: Record<string, any> = {}
  ): Promise<ExecutiveSummary> {
    const prompt = generateExecutiveSummaryPrompt(sentimentData, capabilityData, companyContext, filters)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an executive consultant writing board-ready AI readiness summaries. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.6,
          max_tokens: 1500
        })
      })
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }
      
      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)
      
      return result
    } catch (error) {
      console.error('GPT Executive Summary Error:', error)
      throw error
    }
  }
  
  async summarizeOpenEndedResponses(
    responses: string[],
    dimensionContext?: string
  ): Promise<OpenEndedSummary> {
    const prompt = generateOpenEndedSummaryPrompt(responses, dimensionContext)
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert at synthesizing qualitative survey data into actionable insights. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.5,
          max_tokens: 1200
        })
      })
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }
      
      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)
      
      return result
    } catch (error) {
      console.error('GPT Open-Ended Summary Error:', error)
      throw error
    }
  }

  async generateCapabilityInsights(
    weakDimensions: any[],
    companyContext: CompanyContext,
    filters: Record<string, any> = {}
  ): Promise<any[]> {
    // Build prompt for capability insights
    const dimensionsText = weakDimensions
      .map(dim => `- ${dim.name}: ${dim.average.toFixed(1)}/7 (Benchmark: ${dim.benchmark.toFixed(1)})`)
      .join('\n')

    const prompt = `Analyze these weak AI capability dimensions for ${companyContext.name}:

${dimensionsText}

Company Context:
- Industry: ${companyContext.industry}
- Size: ${companyContext.size}
- AI Maturity: ${companyContext.aiMaturity}

AVAILABLE STRATEGIC INTERVENTIONS (reference these by code):

LEVEL A - Strategy & Governance (direction, frameworks, alignment):
- A1: AI Roadmap Pressure Cooker - Accelerated workshop defining strategic direction, priorities, and responsibilities
- A2: AI Dialectics Sessions - Deep dialogues on AI dilemmas, values, and risks building shared understanding
- A3: AI Adoption Playbook Co-Design - Co-creation of behavioural principles and governance structures

LEVEL B - Adoption & Behaviour (motivation, learning psychology, culture change):
- B1: Adoption Challenge - Playful team challenge activating desired AI behaviours
- B2: AI Learning Week - Intensive hands-on learning program building AI skills and confidence
- B3: The Road to AI Adoption - Guided trajectory where teams design their own adoption journey
- B4: AI Ambassadors Network - Train-the-trainer program enabling peer support
- B5: Playful Nudging Toolkit - Creative micro-interventions reinforcing AI behaviours

LEVEL C - Innovation & Value Creation (experimentation, learning, ROI):
- C1: Kickstart with AI - Hackathon-style innovation sprint for AI prototyping
- C2: ROI Retrospective Workshop - Reflective evaluation of AI initiative outcomes

Generate 3-5 actionable insights. For EACH insight, you MUST recommend 2-3 specific interventions from the list above (reference by code like "A1", "B2", etc).

Return as JSON array with this structure:
{
  "insights": [
    {
      "dimension": "dimension name",
      "priority": "critical|high|medium",
      "gap_analysis": "detailed explanation of the gap",
      "business_impact": "how this affects the organization",
      "recommended_interventions": ["A1", "B2"],
      "intervention_rationale": "why these specific interventions address this gap",
      "quick_wins": ["quick win 1", "quick win 2"],
      "long_term_strategy": "strategic approach",
      "estimated_effort": "low|medium|high",
      "estimated_timeline": "time estimate"
    }
  ]
}`

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI capability consultant who provides detailed, actionable insights for improving organizational AI maturity. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 2500
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      const result = JSON.parse(data.choices[0].message.content)

      return result.insights || []
    } catch (error) {
      console.error('GPT Capability Insights Error:', error)
      throw error
    }
  }
}

// Singleton instance
export const gptService = new GPTService()


