import { 
  SentimentResponse, 
  CapabilityResponse, 
  SentimentArea, 
  CapabilityDimension,
  FilterState,
  HeatmapCell
} from '@/lib/types'
import { SENTIMENT_COLORS, HEATMAP_DESCRIPTIONS, CAPABILITY_DIMENSIONS } from '@/lib/constants'

// Filter data based on filter state
export function filterResponses<T extends Record<string, any>>(
  data: T[],
  filters: FilterState
): T[] {
  return data.filter(item => {
    if (filters.region && item.region !== filters.region) return false
    if (filters.department && item.department !== filters.department) return false
    if (filters.function && item.function !== filters.function) return false
    if (filters.ageGroup && item.ageGroup !== filters.ageGroup) return false
    if (filters.businessUnit && item.businessUnit !== filters.businessUnit) return false
    if (filters.role && item.role !== filters.role) return false
    return true
  })
}

// Calculate sentiment heatmap data
// Groups respondents into 5x5 grid based on overall sentiment level and primary concern
export function calculateSentimentHeatmap(
  responses: SentimentResponse[],
  filters: FilterState = {}
): HeatmapCell[] {
  const filtered = filterResponses(responses, filters)
  const heatmapData: HeatmapCell[] = []
  
  // Create 5x5 grid - categorize each respondent into ONE cell
  for (let level = 5; level >= 1; level--) {
    for (let reasonIdx = 0; reasonIdx < 5; reasonIdx++) {
      // Get sentiment scores for this reason category (5 questions per reason)
      // Reason 1 (col 0): sentiment_1, 6, 11, 16, 21
      // Reason 2 (col 1): sentiment_2, 7, 12, 17, 22
      // etc.
      const sentimentIndices = [
        reasonIdx + 1,        // Level 1
        reasonIdx + 6,        // Level 2  
        reasonIdx + 11,       // Level 3
        reasonIdx + 16,       // Level 4
        reasonIdx + 21        // Level 5
      ]
      
      // Find respondents whose scores for this reason category match this level
      const respondentsInCell = filtered.filter(r => {
        // Get all scores for this reason category
        const reasonScores = sentimentIndices
          .map(idx => r[`sentiment_${idx}` as keyof SentimentResponse] as number)
          .filter(score => typeof score === 'number' && !isNaN(score))
        
        if (reasonScores.length === 0) return false
        
        // Calculate average score for this reason
        const avgReasonScore = reasonScores.reduce((sum, s) => sum + s, 0) / reasonScores.length
        
        // Check if this average falls in the level range
        // Level 5: 4.5-5.0, Level 4: 3.5-4.5, Level 3: 2.5-3.5, Level 2: 1.5-2.5, Level 1: 1.0-1.5
        const levelMin = level === 1 ? 1.0 : (level - 1) + 0.5
        const levelMax = level === 5 ? 5.0 : level + 0.5
        
        return avgReasonScore >= levelMin && avgReasonScore < levelMax
      })
      
      // Calculate average score for respondents in this cell
      const cellScores = respondentsInCell.flatMap(r => 
        sentimentIndices
          .map(idx => r[`sentiment_${idx}` as keyof SentimentResponse] as number)
          .filter(score => typeof score === 'number' && !isNaN(score))
      )
      
      const avgScore = cellScores.length > 0
        ? cellScores.reduce((sum, s) => sum + s, 0) / cellScores.length
        : 0
      
      const row = 5 - level
      const areaId = `L${level}_R${reasonIdx + 1}`
      const description = HEATMAP_DESCRIPTIONS[areaId as keyof typeof HEATMAP_DESCRIPTIONS]
      
      heatmapData.push({
        x: reasonIdx,
        y: row,
        value: avgScore,
        count: respondentsInCell.length,
        label: description?.label || `Level ${level}, Reason ${reasonIdx + 1}`,
        description: description?.description || '',
        color: getHeatmapColor(avgScore)
      })
    }
  }
  
  return heatmapData
}

// Calculate capability dimensions
export function calculateCapabilityDimensions(
  responses: CapabilityResponse[],
  filters: FilterState = {}
): CapabilityDimension[] {
  const filtered = filterResponses(responses, filters)
  
  return CAPABILITY_DIMENSIONS.map(dim => {
    const dimensionScores = filtered.map(r => {
      const scores = [
        r[`${dim.id}_C1` as keyof CapabilityResponse] as number,
        r[`${dim.id}_C2` as keyof CapabilityResponse] as number,
        r[`${dim.id}_C3` as keyof CapabilityResponse] as number,
        r[`${dim.id}_C4` as keyof CapabilityResponse] as number
      ].filter(s => typeof s === 'number')
      
      return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    }).filter(s => s > 0)
    
    const avgScore = dimensionScores.length > 0 
      ? dimensionScores.reduce((a, b) => a + b, 0) / dimensionScores.length 
      : 0
      
    return {
      dimensionId: dim.id,
      name: dim.name,
      averageScore: Number(avgScore.toFixed(2)),
      minScore: dimensionScores.length > 0 ? Math.min(...dimensionScores) : 0,
      maxScore: dimensionScores.length > 0 ? Math.max(...dimensionScores) : 0,
      benchmarkScore: 3.5, // Placeholder benchmark
      constructs: [] // Will be calculated separately when needed
    }
  })
}

// Calculate construct details for a specific dimension
export function calculateConstructDetails(
  responses: CapabilityResponse[],
  dimensionId: string,
  filters: FilterState = {}
) {
  const filtered = filterResponses(responses, filters)
  const constructs = []
  
  for (let i = 1; i <= 4; i++) {
    const constructKey = `${dimensionId}_C${i}` as keyof CapabilityResponse
    const scores = filtered
      .map(r => r[constructKey] as number)
      .filter(s => typeof s === 'number' && s > 0)
    
    const avgScore = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0
      
    constructs.push({
      constructId: `${dimensionId}_C${i}`,
      name: `Construct ${i}`, // You can map to actual names from CONSTRUCT_LABELS
      averageScore: Number(avgScore.toFixed(2)),
      benchmarkScore: 3.5, // Placeholder
      gapAnalysis: {
        vsAverage: avgScore - 3, // vs midpoint
        vsBenchmark: avgScore - 3.5
      }
    })
  }
  
  return constructs
}

// Get color for heatmap cell based on value - matching reference design
export function getHeatmapColor(value: number): string {
  if (value === 0) return '#6B7280' // gray-500 for no data
  if (value < 2.0) return '#B91C1C' // dark red - very negative (<2)
  if (value < 2.5) return '#EA580C' // orange-red - negative (2-2.5)
  if (value < 3.0) return '#FCD34D' // yellow - neutral (2.5-3)
  if (value < 3.5) return '#A3E635' // light green - positive (3-3.5)
  return '#15803D' // dark green - very positive (>3.5)
}

// Calculate overall readiness score
export function calculateReadinessScore(
  sentimentResponses: SentimentResponse[],
  capabilityResponses: CapabilityResponse[]
): number {
  const sentimentAvg = sentimentResponses.length > 0
    ? sentimentResponses.reduce((sum, r) => sum + (r.sentimentLevel ?? 0), 0) / sentimentResponses.length
    : 0
    
  const capabilityDims = calculateCapabilityDimensions(capabilityResponses)
  const capabilityAvg = capabilityDims.length > 0
    ? capabilityDims.reduce((sum, d) => sum + d.averageScore, 0) / capabilityDims.length
    : 0
    
  // Weight sentiment 40% and capability 60%
  return Number(((sentimentAvg * 0.4 + capabilityAvg * 0.6) * 20).toFixed(1))
}

// Get top issues from sentiment data
export function getTopSentimentIssues(
  heatmapData: HeatmapCell[],
  limit: number = 3
): string[] {
  return heatmapData
    .filter(cell => cell.count > 0 && cell.value < 3)
    .sort((a, b) => a.value - b.value)
    .slice(0, limit)
    .map(cell => cell.label)
}

// Get weakest capability areas
export function getWeakestCapabilities(
  dimensions: CapabilityDimension[],
  limit: number = 3
): string[] {
  return dimensions
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, limit)
    .map(d => d.name)
}

// Get strongest capability areas
export function getStrongestCapabilities(
  dimensions: CapabilityDimension[],
  limit: number = 3
): string[] {
  return dimensions
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, limit)
    .map(d => d.name)
}

// Generate AI summary placeholder (would integrate with OpenAI)
export function generateAISummary(
  openFeedback: string[],
  context: 'sentiment' | 'capability'
): string {
  // This would normally call OpenAI API
  // For now, return a placeholder summary
  
  const feedbackSample = openFeedback.slice(0, 5).join(' ')
  
  if (context === 'sentiment') {
    return `Based on employee feedback, the primary concerns revolve around job security and lack of understanding about AI's role. There's a mix of excitement and apprehension, with technical teams more ready than operational staff. Leadership communication and education emerge as critical needs.`
  } else {
    return `Organizations show strength in strategic vision but face challenges in data readiness and technical infrastructure. Skills gaps are evident, particularly in AI-specific competencies. Innovation culture is emerging but needs structured support. Ethics and governance frameworks require immediate attention.`
  }
}

// Format number for display
export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals)
}

// Format percentage
export function formatPercentage(num: number): string {
  return `${(num * 100).toFixed(0)}%`
}

// Get intervention recommendations based on gaps
export function getRecommendedInterventions(
  sentimentAreas: string[],
  capabilityDimensions: string[],
  interventions: any[]
): any[] {
  return interventions.filter(intervention => {
    const sentimentMatch = intervention.targetSentimentAreas?.some((area: string) => 
      sentimentAreas.includes(area)
    )
    const capabilityMatch = intervention.targetDimensions?.some((dim: string) => 
      capabilityDimensions.includes(dim)
    )
    return sentimentMatch || capabilityMatch
  })
}
