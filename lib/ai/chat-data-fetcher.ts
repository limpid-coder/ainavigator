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
 * Data format: sentiment_1 through sentiment_25 (5 levels × 5 categories)
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

  // Sentiment cell metadata (5 levels × 5 categories = 25 cells)
  const SENTIMENT_LEVELS = ['Personal', 'Collaboration', 'Professional Trust', 'Career', 'Organizational']
  const SENTIMENT_CATEGORIES = ['Too Autonomous', 'Too Inflexible', 'Emotionless', 'Too Opaque', 'Prefer Human']

  // Calculate average for each of the 25 cells
  const cellAverages: Array<{level: string, category: string, score: number, rawScore: number, count: number}> = []

  for (let levelIdx = 0; levelIdx < 5; levelIdx++) {
    for (let catIdx = 0; catIdx < 5; catIdx++) {
      const sentimentNum = levelIdx * 5 + catIdx + 1 // sentiment_1 to sentiment_25
      const columnName = `sentiment_${sentimentNum}`

      // Collect all valid scores for this cell
      const cellScores = sentimentData
        .map(row => row[columnName])
        .filter((score): score is number => typeof score === 'number' && !isNaN(score))

      if (cellScores.length > 0) {
        // Calculate raw average
        const rawAvg = cellScores.reduce((sum, s) => sum + s, 0) / cellScores.length

        // Transform from 1-2 scale to inverted 1-4 display scale
        // Raw: 1=positive (low resistance), 2=negative (high resistance)
        // Display: 1=negative (dark red), 4=positive (green)
        const transformedScore = Math.max(1.0, Math.min(4.0, (2.0 - rawAvg) * 3.0 + 1.0))

        cellAverages.push({
          level: SENTIMENT_LEVELS[levelIdx],
          category: SENTIMENT_CATEGORIES[catIdx],
          score: transformedScore,
          rawScore: rawAvg,
          count: cellScores.length
        })
      }
    }
  }

  if (cellAverages.length === 0) {
    console.warn('No valid scores found in sentiment data')
    return {
      overall_avg: 0,
      response_count: sentimentData.length,
      std_dev: 0,
      lowest_areas: [],
      highest_areas: []
    }
  }

  // Calculate overall average from cell averages
  const overall_avg = cellAverages.reduce((sum, cell) => sum + cell.score, 0) / cellAverages.length

  // Calculate standard deviation
  const variance = cellAverages.reduce((sum, cell) =>
    sum + Math.pow(cell.score - overall_avg, 2), 0
  ) / cellAverages.length
  const std_dev = Math.sqrt(variance)

  // Sort by score to find lowest (most concerning) and highest areas
  const sorted = [...cellAverages].sort((a, b) => a.score - b.score)

  return {
    overall_avg: Math.round(overall_avg * 100) / 100,
    response_count: sentimentData.length,
    std_dev: Math.round(std_dev * 100) / 100,
    lowest_areas: sorted.slice(0, 5).map(cell => ({
      level: cell.level,
      category: cell.category,
      score: Math.round(cell.score * 100) / 100,
      affected_count: sentimentData.length // All respondents contribute to each cell
    })),
    highest_areas: sorted.slice(-3).reverse().map(cell => ({
      level: cell.level,
      category: cell.category,
      score: Math.round(cell.score * 100) / 100
    }))
  }
}

/**
 * Calculate capability summary from raw data
 * Data format: construct_1 through construct_32 (8 dimensions × 4 constructs each)
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

  // 8 Dimensions with 4 constructs each = 32 total constructs
  const DIMENSIONS = [
    { name: 'Strategy & Vision', constructs: [1, 2, 3, 4] },
    { name: 'Data', constructs: [5, 6, 7, 8] },
    { name: 'Technology', constructs: [9, 10, 11, 12] },
    { name: 'Talent & Skills', constructs: [13, 14, 15, 16] },
    { name: 'Organisation & Processes', constructs: [17, 18, 19, 20] },
    { name: 'Innovation', constructs: [21, 22, 23, 24] },
    { name: 'Adaptation & Adoption', constructs: [25, 26, 27, 28] },
    { name: 'Ethics & Responsibility', constructs: [29, 30, 31, 32] }
  ]

  // Calculate average for each dimension
  const dimensionAverages = DIMENSIONS.map(dim => {
    const dimensionScores: number[] = []

    dim.constructs.forEach(constructId => {
      const constructScores = capabilityData
        .map(row => row[`construct_${constructId}`])
        .filter((score): score is number => typeof score === 'number' && !isNaN(score) && score > 0)

      if (constructScores.length > 0) {
        const avg = constructScores.reduce((sum, s) => sum + s, 0) / constructScores.length
        dimensionScores.push(avg)
      }
    })

    const dimAverage = dimensionScores.length > 0
      ? dimensionScores.reduce((sum, s) => sum + s, 0) / dimensionScores.length
      : 0

    return {
      name: dim.name,
      score: Math.round(dimAverage * 100) / 100,
      allScores: dimensionScores
    }
  }).filter(d => d.score > 0)

  if (dimensionAverages.length === 0) {
    console.warn('No valid scores found in capability data')
    return {
      overall_avg: 0,
      response_count: capabilityData.length,
      maturity_level: 'Unknown',
      dimensions: [],
      weakest_dimension: { name: 'Unknown', score: 0 },
      strongest_dimension: { name: 'Unknown', score: 0 },
      biggest_gap: { dimension: 'Unknown', spread: 0 }
    }
  }

  // Calculate overall average
  const overall_avg = dimensionAverages.reduce((sum, d) => sum + d.score, 0) / dimensionAverages.length

  // Determine maturity level
  let maturity_level = 'Nascent'
  if (overall_avg >= 5.5) maturity_level = 'Leading'
  else if (overall_avg >= 4.5) maturity_level = 'Maturing'
  else if (overall_avg >= 3.0) maturity_level = 'Developing'

  // Find weakest and strongest
  const sorted = [...dimensionAverages].sort((a, b) => a.score - b.score)
  const weakest = sorted[0]
  const strongest = sorted[sorted.length - 1]

  // Find biggest gap (largest variance within a dimension)
  const gaps = dimensionAverages.map(d => {
    if (d.allScores.length === 0) return { dimension: d.name, spread: 0 }
    const min = Math.min(...d.allScores)
    const max = Math.max(...d.allScores)
    return { dimension: d.name, spread: Math.round((max - min) * 100) / 100 }
  })
  const biggest_gap = gaps.sort((a, b) => b.spread - a.spread)[0]

  return {
    overall_avg: Math.round(overall_avg * 100) / 100,
    response_count: capabilityData.length,
    maturity_level,
    dimensions: dimensionAverages.map(d => ({ name: d.name, score: d.score })),
    weakest_dimension: { name: weakest.name, score: weakest.score },
    strongest_dimension: { name: strongest.name, score: strongest.score },
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

