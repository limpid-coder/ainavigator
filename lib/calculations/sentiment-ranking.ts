// Correct Sentiment Heatmap Calculation with Relative Ranking
// Based on Excel heatmap logic

import { SENTIMENT_LEVELS, SENTIMENT_CATEGORIES, SENTIMENT_COLUMN_MAPPING, COLOR_RANKING } from '../constants/sentiment-metadata'
import { FilterState } from '../types/assessment'

export interface SentimentCellData {
  levelId: number
  categoryId: number
  cellId: string
  score: number
  count: number
  rank: number  // 1 = highest, 25 = lowest
  color: string
  levelName: string
  categoryName: string
  description: string
}

export interface SentimentStats {
  overallAverage: number
  standardDeviation: number
  totalRespondents: number
  rowAverages: number[]  // Average per level (5 totals)
  columnAverages: number[]  // Average per category (5 totals)
}

export function calculateSentimentHeatmap(
  data: any[],
  filters: FilterState = {}
): { cells: SentimentCellData[], stats: SentimentStats } {
  
  // Apply filters
  const filtered = filterData(data, filters)
  
  if (filtered.length === 0) {
    return {
      cells: [],
      stats: {
        overallAverage: 0,
        standardDeviation: 0,
        totalRespondents: 0,
        rowAverages: [0, 0, 0, 0, 0],
        columnAverages: [0, 0, 0, 0, 0]
      }
    }
  }
  
  // Calculate scores for all 25 cells
  const cellScores: { cellId: string, score: number, count: number }[] = []
  
  Object.entries(SENTIMENT_COLUMN_MAPPING).forEach(([cellId, columnName]) => {
    const scores = filtered
      .map(row => row[columnName])
      .filter((score): score is number => typeof score === 'number' && !isNaN(score))
    
    if (scores.length > 0) {
      const average = scores.reduce((sum, s) => sum + s, 0) / scores.length
      cellScores.push({ cellId, score: average, count: scores.length })
    } else {
      cellScores.push({ cellId, score: 0, count: 0 })
    }
  })
  
  // Get all valid scores for ranking
  const allValidScores = cellScores
    .filter(c => c.count > 0)
    .map(c => c.score)
    .sort((a, b) => b - a) // Descending (highest first)
  
  // Calculate color based on relative ranking
  const cells: SentimentCellData[] = cellScores.map((cell, index) => {
    const [levelStr, categoryStr] = cell.cellId.split('_')
    const levelId = parseInt(levelStr.replace('L', ''))
    const categoryId = parseInt(categoryStr.replace('C', ''))
    
    const level = SENTIMENT_LEVELS[levelId - 1]
    const category = SENTIMENT_CATEGORIES[categoryId - 1]
    
    // Determine rank (1 = highest score)
    const rank = cell.count > 0 
      ? allValidScores.findIndex(s => Math.abs(s - cell.score) < 0.001) + 1
      : 99
    
    // Determine color based on rank
    let color: string = COLOR_RANKING.NO_DATA
    if (cell.count > 0) {
      if (rank <= 3) {
        color = COLOR_RANKING.TOP_3
      } else if (rank <= 8) {
        color = COLOR_RANKING.TOP_8
      } else if (rank >= allValidScores.length - 2) {
        color = COLOR_RANKING.BOTTOM_3
      } else if (rank >= allValidScores.length - 7) {
        color = COLOR_RANKING.BOTTOM_8
      } else {
        color = COLOR_RANKING.MIDDLE
      }
    }
    
    return {
      levelId,
      categoryId,
      cellId: cell.cellId,
      score: cell.score,
      count: cell.count,
      rank,
      color,
      levelName: level?.name || '',
      categoryName: category?.name || '',
      description: `${level?.name} × ${category?.name}: ${level?.description}`
    }
  })
  
  // Calculate statistics
  const validScores = cells.filter(c => c.count > 0).map(c => c.score)
  const overallAverage = validScores.length > 0
    ? validScores.reduce((sum, s) => sum + s, 0) / validScores.length
    : 0
  
  const variance = validScores.length > 0
    ? validScores.reduce((sum, s) => sum + Math.pow(s - overallAverage, 2), 0) / validScores.length
    : 0
  const standardDeviation = Math.sqrt(variance)
  
  // Row averages (per level)
  const rowAverages = SENTIMENT_LEVELS.map((_, levelIdx) => {
    const levelCells = cells.filter(c => c.levelId === levelIdx + 1 && c.count > 0)
    if (levelCells.length === 0) return 0
    return levelCells.reduce((sum, c) => sum + c.score, 0) / levelCells.length
  })
  
  // Column averages (per category)
  const columnAverages = SENTIMENT_CATEGORIES.map((_, catIdx) => {
    const categoryCells = cells.filter(c => c.categoryId === catIdx + 1 && c.count > 0)
    if (categoryCells.length === 0) return 0
    return categoryCells.reduce((sum, c) => sum + c.score, 0) / categoryCells.length
  })
  
  return {
    cells,
    stats: {
      overallAverage,
      standardDeviation,
      totalRespondents: filtered.length,
      rowAverages,
      columnAverages
    }
  }
}

function filterData(data: any[], filters: FilterState): any[] {
  return data.filter(row => {
    if (filters.region && row.Region !== filters.region) return false
    if (filters.department && row.Department !== filters.department) return false
    if (filters.role && row.Employment_type !== filters.role) return false
    if (filters.ageGroup && row.Age !== filters.ageGroup) return false
    return true
  })
}

// Get lowest scoring cells for GPT analysis
export function getLowestScoringCells(
  cells: SentimentCellData[],
  count: number = 5
): SentimentCellData[] {
  return cells
    .filter(c => c.count > 0)
    .sort((a, b) => a.score - b.score) // Ascending (lowest first)
    .slice(0, count)
}

// Get highest scoring cells (strengths)
export function getHighestScoringCells(
  cells: SentimentCellData[],
  count: number = 5
): SentimentCellData[] {
  return cells
    .filter(c => c.count > 0)
    .sort((a, b) => b.score - a.score) // Descending (highest first)
    .slice(0, count)
}

