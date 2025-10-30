/**
 * Data Fetching Layer for AI Chat
 * Fetches and prepares data summaries for AI context
 */

export interface SentimentSummary {
  overall_avg: number
  response_count: number
  std_dev: number
  lowest_areas: Array<{
    level: string
    category: string
    score: number
    affected_count: number
  }>
  highest_areas: Array<{
    level: string
    category: string
    score: number
  }>
}

export interface CapabilitySummary {
  overall_avg: number
  response_count: number
  maturity_level: string
  dimensions: Array<{
    name: string
    score: number
  }>
  weakest_dimension: {
    name: string
    score: number
  }
  strongest_dimension: {
    name: string
    score: number
  }
  biggest_gap: {
    dimension: string
    spread: number
  }
}

/**
 * Fetch sentiment data summary for AI context
 */
export async function fetchSentimentSummary(): Promise<SentimentSummary | null> {
  try {
    const response = await fetch('/api/data?type=sentiment&summary=true')
    if (!response.ok) return null
    
    const data = await response.json()
    return data.summary
  } catch (error) {
    console.error('Error fetching sentiment summary:', error)
    return null
  }
}

/**
 * Fetch capability data summary for AI context
 */
export async function fetchCapabilitySummary(): Promise<CapabilitySummary | null> {
  try {
    const response = await fetch('/api/data?type=capability&summary=true')
    if (!response.ok) return null
    
    const data = await response.json()
    return data.summary
  } catch (error) {
    console.error('Error fetching capability summary:', error)
    return null
  }
}

/**
 * Calculate sentiment summary from raw data
 */
export function calculateSentimentSummary(sentimentData: any[]): SentimentSummary {
  if (!sentimentData || sentimentData.length === 0) {
    return {
      overall_avg: 0,
      response_count: 0,
      std_dev: 0,
      lowest_areas: [],
      highest_areas: []
    }
  }
  
  console.log('Calculating sentiment summary from:', sentimentData.length, 'records')
  console.log('Sample record:', sentimentData[0])
  
  // Extract scores based on data structure (handle different formats)
  const scores = sentimentData.map(d => {
    // Try different score field names
    const score = d.score || d.sentiment_score || d.value || d.rating || 0
    return typeof score === 'number' ? score : parseFloat(score) || 0
  }).filter(score => score > 0) // Filter out invalid scores
  
  if (scores.length === 0) {
    console.warn('No valid scores found in sentiment data')
    return {
      overall_avg: 0,
      response_count: sentimentData.length,
      std_dev: 0,
      lowest_areas: [],
      highest_areas: []
    }
  }
  
  // Calculate overall average
  const overall_avg = scores.reduce((a, b) => a + b, 0) / scores.length
  
  // Calculate standard deviation
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - overall_avg, 2), 0) / scores.length
  const std_dev = Math.sqrt(variance)
  
  // Sort by score to get lowest and highest
  const validData = sentimentData.filter(d => (d.score || d.sentiment_score || d.value || 0) > 0)
  const sorted = [...validData].sort((a, b) => {
    const scoreA = a.score || a.sentiment_score || a.value || 0
    const scoreB = b.score || b.sentiment_score || b.value || 0
    return scoreA - scoreB
  })
  
  return {
    overall_avg: Math.round(overall_avg * 100) / 100,
    response_count: sentimentData.length,
    std_dev: Math.round(std_dev * 100) / 100,
    lowest_areas: sorted.slice(0, 5).map(d => ({
      level: d.level || d.level_name || d.sentiment_level || 'Unknown',
      category: d.category || d.category_name || d.sentiment_category || 'Unknown',
      score: Math.round((d.score || d.sentiment_score || d.value || 0) * 100) / 100,
      affected_count: d.count || d.respondent_count || d.affected_count || 1
    })),
    highest_areas: sorted.slice(-3).reverse().map(d => ({
      level: d.level || d.level_name || d.sentiment_level || 'Unknown',
      category: d.category || d.category_name || d.sentiment_category || 'Unknown',
      score: Math.round((d.score || d.sentiment_score || d.value || 0) * 100) / 100
    }))
  }
}

/**
 * Calculate capability summary from raw data
 */
export function calculateCapabilitySummary(capabilityData: any[]): CapabilitySummary {
  if (!capabilityData || capabilityData.length === 0) {
    return {
      overall_avg: 0,
      response_count: 0,
      maturity_level: 'Unknown',
      dimensions: [],
      weakest_dimension: { name: 'Unknown', score: 0 },
      strongest_dimension: { name: 'Unknown', score: 0 },
      biggest_gap: { dimension: 'Unknown', spread: 0 }
    }
  }
  
  console.log('Calculating capability summary from:', capabilityData.length, 'records')
  console.log('Sample record:', capabilityData[0])
  
  // Calculate averages by dimension
  const dimensionMap = new Map<string, number[]>()
  
  capabilityData.forEach(d => {
    const dimension = d.dimension || d.dimension_name || d.capability_dimension || 'Unknown'
    const score = d.score || d.capability_score || d.value || d.rating || 0
    const validScore = typeof score === 'number' ? score : parseFloat(score) || 0
    
    if (!dimensionMap.has(dimension)) {
      dimensionMap.set(dimension, [])
    }
    if (validScore > 0) {
      dimensionMap.get(dimension)!.push(validScore)
    }
  })
  
  const dimensions = Array.from(dimensionMap.entries()).map(([name, scores]) => ({
    name,
    score: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
  }))
  
  const overall_avg = dimensions.length > 0 
    ? dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length 
    : 0
  
  // Determine maturity level
  let maturity_level = 'Nascent'
  if (overall_avg >= 4.0) maturity_level = 'Leading'
  else if (overall_avg >= 3.0) maturity_level = 'Maturing'
  else if (overall_avg >= 2.0) maturity_level = 'Developing'
  
  // Find weakest and strongest
  const sorted = [...dimensions].sort((a, b) => a.score - b.score)
  const weakest = sorted[0]
  const strongest = sorted[sorted.length - 1]
  
  // Find biggest gap
  const gaps = dimensions.map(d => {
    const dimScores = dimensionMap.get(d.name) || []
    const min = Math.min(...dimScores)
    const max = Math.max(...dimScores)
    return { dimension: d.name, spread: max - min }
  })
  const biggest_gap = gaps.sort((a, b) => b.spread - a.spread)[0]
  
  return {
    overall_avg,
    response_count: capabilityData.length,
    maturity_level,
    dimensions,
    weakest_dimension: weakest || { name: 'Unknown', score: 0 },
    strongest_dimension: strongest || { name: 'Unknown', score: 0 },
    biggest_gap: biggest_gap || { dimension: 'Unknown', spread: 0 }
  }
}

/**
 * Prepare enhanced context with data summaries
 */
export async function prepareEnhancedContext(
  baseContext: any,
  sentimentData?: any[],
  capabilityData?: any[]
): Promise<any> {
  const enhancedContext = { ...baseContext }
  
  // Add sentiment summary if data available
  if (sentimentData && sentimentData.length > 0) {
    enhancedContext.data_state.sentiment_summary = calculateSentimentSummary(sentimentData)
  }
  
  // Add capability summary if data available
  if (capabilityData && capabilityData.length > 0) {
    enhancedContext.data_state.capability_summary = calculateCapabilitySummary(capabilityData)
  }
  
  return enhancedContext
}

