// GPT-4/5 Prompt Templates for AI Navigator

import { SentimentCellData } from '../calculations/sentiment-ranking'

export interface CompanyContext {
  name: string
  industry: string
  size: string
  aiMaturity?: string
  primaryConcerns?: string[]
}

export function generateProblemCategoryPrompt(
  lowestCells: SentimentCellData[],
  companyContext: CompanyContext,
  filters: Record<string, any>
): string {
  const filtersText = Object.entries(filters)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')
  
  return `You are an expert AI adoption consultant analyzing employee survey data for ${companyContext.name}, a ${companyContext.size} company in ${companyContext.industry}.

TASK: Analyze the LOWEST scoring areas from an AI sentiment assessment and create memorable "Problem Categories" that help executives understand the core challenges.

CONTEXT:
The sentiment heatmap measures employee concerns about AI across 2 dimensions:
- **Levels** (5): How deep the concern is (Personal → Collaboration → Professional Trust → Career → Organizational)
- **Categories** (5): What aspect of AI worries them (Too Autonomous, Too Inflexible, Emotionless, Too Opaque, Prefer Human)

Lower scores = Higher concern/resistance
Higher scores = Less concern/more acceptance

${filtersText ? `FILTERED VIEW: Currently showing ${filtersText}` : 'FULL ORGANIZATION VIEW'}

LOWEST SCORING AREAS (Highest Concerns):
${lowestCells.map((cellData, idx) => `
${idx + 1}. ${cellData.levelName} × ${cellData.categoryName}
   - Score: ${cellData.score.toFixed(2)}/5.0 (rank #${cellData.rank} of 25)
   - ${cellData.count} employees in this category
   - Severity: ${cellData.rank >= 23 ? 'CRITICAL' : cellData.rank >= 20 ? 'HIGH' : 'MEDIUM'}
`).join('\n')}

INSTRUCTIONS:
For the top 3-5 lowest scoring areas, create a "Problem Category" for each with:

1. **Category Name**: A memorable, slightly provocative but professional name that captures the essence
   - Examples: "The Risky AI", "The Hidden AI", "The Callous AI", "The Rigid System"
   - Make it vivid and memorable for executives
   
2. **Description** (150-200 words): Explain in business language:
   - What specific concern this combination represents
   - Why employees at this level feel this way about this AI characteristic
   - What organizational/business impacts this creates
   - How it affects trust, productivity, and AI adoption
   - Specific to ${companyContext.industry} context where relevant

3. **Severity**: critical | high | medium (based on score and affected count)

OUTPUT FORMAT (JSON):
{
  "problem_categories": [
    {
      "category_id": "unique_snake_case_id",
      "category_name": "The [Memorable] AI",
      "reason": "[category name]",
      "level": "[level name]",
      "score": 2.42,
      "affected_count": 23,
      "rank": 25,
      "severity": "critical|high|medium",
      "description": "Detailed explanation here (150-200 words)",
      "business_impact": "Specific impact on ${companyContext.industry} operations",
      "examples": ["Concrete example 1", "Concrete example 2"]
    }
  ]
}

STYLE GUIDELINES:
- Write for C-suite executives, not technical teams
- Focus on business impact, not just emotions
- Be specific to ${companyContext.industry} industry
- Use concrete language, avoid jargon
- Make it actionable - hint at solutions without prescribing yet
- Professional tone but engaging
`
}

export function generateInterventionsPrompt(
  problemCategory: any,
  companyContext: CompanyContext
): string {
  return `You are an expert at designing creative, specific interventions for AI adoption challenges.

COMPANY: ${companyContext.name} (${companyContext.industry}, ${companyContext.size})

PROBLEM CATEGORY TO ADDRESS:
Name: ${problemCategory.category_name}
Level: ${problemCategory.level}
AI Characteristic: ${problemCategory.reason}
Score: ${problemCategory.score}/5.0 (Lower = more concern)
Affected Employees: ${problemCategory.affected_count}
Severity: ${problemCategory.severity}
Description: ${problemCategory.description}

TASK: Generate EXACTLY 3 specific, actionable interventions to address this problem.

REQUIREMENTS FOR EACH INTERVENTION:

1. **Creative, Memorable Title**
   - Examples: "Decision Defense Hearings", "Explain It or Spin It? Briefings", "One Risk, One Remedy Ritual"
   - Make it catchy but professional
   - Should make executives curious

2. **What to Do** (100-150 words)
   - Concrete program/initiative description
   - Specific steps or approach
   - Who should be involved
   - What resources are needed

3. **Why It Works** (80-120 words)
   - Explain the psychological/organizational mechanism
   - Why this specific approach addresses the specific concern
   - Expected behavior changes
   - How it builds trust/capability

4. **Practical Details**:
   - Effort: low | medium | high
   - Impact: low | medium | high  
   - Timeframe: "2-3 weeks" | "4-6 weeks" | "2-3 months" | "ongoing"
   - Budget estimate: "$10-25K" | "$25-50K" | "$50-100K" | "$100K+"

OUTPUT FORMAT (JSON):
{
  "interventions": [
    {
      "number": 1,
      "title": "Creative Action Title",
      "what_to_do": "Detailed description of the intervention (100-150 words)",
      "why_it_works": "Explanation of mechanism and benefits (80-120 words)",
      "effort": "medium",
      "impact": "high",
      "timeframe": "4-6 weeks",
      "budget_estimate": "$25-50K",
      "required_resources": ["Resource 1", "Resource 2", "Resource 3"],
      "key_stakeholders": ["Role 1", "Role 2"],
      "success_metrics": ["Metric 1", "Metric 2"],
      "quick_wins": ["Early win 1", "Early win 2"]
    }
  ]
}

DESIGN PRINCIPLES:
1. Focus on CULTURAL and EMOTIONAL change, not just technical solutions
2. Make interventions specific to ${companyContext.industry}
3. Address the ROOT CAUSE (why people feel ${problemCategory.reason} leads to ${problemCategory.level})
4. Include elements of transparency, involvement, and safety
5. Balance quick wins with sustainable change
6. Be creative but implementable

Generate 3 interventions that feel fresh, specific, and immediately actionable.
`
}

export function generateExecutiveSummaryPrompt(
  sentimentData: { cells: any[], stats: any },
  capabilityData: { dimensions: any[], overall: any },
  companyContext: CompanyContext,
  filters: Record<string, any>
): string {
  const filtersText = Object.entries(filters)
    .filter(([_, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ') || 'All employees'
  
  return `You are an executive consultant preparing a summary of AI readiness assessment results.

COMPANY: ${companyContext.name}
INDUSTRY: ${companyContext.industry}
VIEW: ${filtersText}

SENTIMENT RESULTS:
- Overall Average: ${sentimentData.stats.overallAverage.toFixed(2)}/5.0
- Standard Deviation: ${sentimentData.stats.standardDeviation.toFixed(2)}
- Total Respondents: ${sentimentData.stats.totalRespondents}
- Lowest Concern Area: ${sentimentData.cells[sentimentData.cells.length - 1]?.levelName} × ${sentimentData.cells[sentimentData.cells.length - 1]?.categoryName}
- Highest Concern Area: ${sentimentData.cells[0]?.levelName} × ${sentimentData.cells[0]?.categoryName}

CAPABILITY RESULTS:
- Overall Maturity: ${capabilityData.overall.average.toFixed(1)}/5.0
- Strongest Dimension: ${capabilityData.overall.highest?.name} (${capabilityData.overall.highest?.average.toFixed(1)})
- Weakest Dimension: ${capabilityData.overall.lowest?.name} (${capabilityData.overall.lowest?.average.toFixed(1)})
- Biggest Variability: ${capabilityData.overall.biggestGap?.name} (spread: ${capabilityData.overall.biggestGap?.spread.toFixed(1)})

TASK: Write a 2-3 paragraph executive summary that:
1. Synthesizes both sentiment and capability findings
2. Identifies 2-3 critical priorities
3. Provides directional guidance on where to focus first
4. Written for C-suite, board-ready language
5. Specific to ${companyContext.industry} context
6. Balances honesty about gaps with optimism about path forward

OUTPUT FORMAT (JSON):
{
  "executive_summary": "2-3 paragraphs here",
  "key_priorities": [
    "Priority 1: Specific focus area",
    "Priority 2: Specific focus area",
    "Priority 3: Specific focus area"
  ],
  "recommended_first_step": "Most important immediate action"
}
`
}

export function generateOpenEndedSummaryPrompt(
  openEndedResponses: string[],
  dimensionContext?: string
): string {
  return `You are analyzing open-ended survey responses from employees about AI readiness.

${dimensionContext ? `FOCUS: ${dimensionContext} dimension` : 'OVERALL CAPABILITY ASSESSMENT'}

EMPLOYEE RESPONSES (${openEndedResponses.length} total):
${openEndedResponses.slice(0, 50).map((response, idx) => `${idx + 1}. "${response}"`).join('\n')}
${openEndedResponses.length > 50 ? `\n... and ${openEndedResponses.length - 50} more responses` : ''}

TASK: Synthesize these open-ended responses into 3 sections:

1. **Overall Picture** (1 paragraph, 100-150 words)
   - What themes emerge?
   - What's the general sentiment?
   - What are people saying about current state?

2. **Achievements** (bullet points or 1 paragraph, 80-100 words)
   - What's working well according to employees?
   - What successes are mentioned?
   - What gives them confidence?

3. **Challenges** (bullet points or 1 paragraph, 80-100 words)
   - What obstacles are mentioned?
   - What's preventing progress?
   - What do people worry about?

4. **Milestones** (bullet points or 1 paragraph, 60-80 words)
   - What future state do people envision?
   - What goals or aspirations are mentioned?
   - Where do they want to be in 1-2 years?

OUTPUT FORMAT (JSON):
{
  "overall_picture": "Paragraph synthesizing main themes",
  "achievements": "What's working well",
  "challenges": "Main obstacles and concerns",
  "milestones": "Desired future state and goals"
}

STYLE:
- Use direct quotes where impactful
- Quantify when possible ("Many respondents mentioned...")
- Balance positive and negative
- Be specific, not generic
- Executive-readable language
`
}

