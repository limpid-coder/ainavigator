/**
 * Benchmark Calculation Service
 * Provides company performance comparison against database averages
 * Supports filtering by region, department, and industry
 */

import { FilterState } from '@/lib/types/assessment'
import { SENTIMENT_COLUMN_MAPPING } from '@/lib/constants/sentiment-metadata'
import { CAPABILITY_DIMENSIONS } from '@/lib/constants/capability-metadata'

export interface SentimentBenchmark {
  overallAverage: number
  cellAverages: Record<string, number> // cellId -> average score
  companyScore: number
  companyVsBenchmark: number // Difference (negative = better than average)
  percentile: number // 0-100, where company ranks
  regionAverages?: Record<string, number> // region -> average
  departmentAverages?: Record<string, number> // department -> average
}

export interface CapabilityBenchmark {
  dimensionAverages: Record<number, number> // dimensionId -> average score
  overallAverage: number
  companyScores: Record<number, number> // dimensionId -> company score
  companyVsBenchmark: Record<number, number> // dimensionId -> difference
  percentiles: Record<number, number> // dimensionId -> percentile
  regionAverages?: Record<string, Record<number, number>> // region -> dimensionId -> average
  departmentAverages?: Record<string, Record<number, number>> // department -> dimensionId -> average
}

export interface BenchmarkFilters {
  region?: string
  department?: string
  industry?: string // Future: when industry field added to schema
}

/**
 * Calculate sentiment benchmark across all companies
 * Lower scores = better (less resistance)
 */
export function calculateSentimentBenchmark(
  allData: any[], // All respondents across all companies
  companyData: any[], // Current company's respondents
  filters: BenchmarkFilters = {}
): SentimentBenchmark {
  // Filter benchmark data by region/department if specified
  const benchmarkData = filterBenchmarkData(allData, filters)

  if (benchmarkData.length === 0) {
    return {
      overallAverage: 0,
      cellAverages: {},
      companyScore: 0,
      companyVsBenchmark: 0,
      percentile: 50,
    }
  }

  // Calculate average for each of the 25 sentiment cells
  const cellAverages: Record<string, number> = {}
  Object.entries(SENTIMENT_COLUMN_MAPPING).forEach(([cellId, columnName]) => {
    const scores = benchmarkData
      .map(row => row[columnName])
      .filter((score): score is number => typeof score === 'number' && !isNaN(score))

    if (scores.length > 0) {
      cellAverages[cellId] = scores.reduce((sum, s) => sum + s, 0) / scores.length
    } else {
      cellAverages[cellId] = 0
    }
  })

  // Calculate overall benchmark average
  const allBenchmarkScores = Object.values(cellAverages).filter(s => s > 0)
  const overallAverage = allBenchmarkScores.length > 0
    ? allBenchmarkScores.reduce((sum, s) => sum + s, 0) / allBenchmarkScores.length
    : 0

  // Calculate company's overall score
  const companyCellScores: number[] = []
  Object.entries(SENTIMENT_COLUMN_MAPPING).forEach(([, columnName]) => {
    const scores = companyData
      .map(row => row[columnName])
      .filter((score): score is number => typeof score === 'number' && !isNaN(score))

    if (scores.length > 0) {
      const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
      companyCellScores.push(avg)
    }
  })

  const companyScore = companyCellScores.length > 0
    ? companyCellScores.reduce((sum, s) => sum + s, 0) / companyCellScores.length
    : 0

  // Calculate difference (negative = company is better, as lower is better)
  const companyVsBenchmark = companyScore - overallAverage

  // Calculate percentile (where does company rank?)
  // Collect all company averages from benchmark data
  const allCompanyScores = calculateAllCompanyScores(benchmarkData)
  const percentile = calculatePercentile(companyScore, allCompanyScores)

  // Calculate regional and departmental averages if needed
  const regionAverages = calculateRegionalAverages(benchmarkData)
  const departmentAverages = calculateDepartmentalAverages(benchmarkData)

  return {
    overallAverage,
    cellAverages,
    companyScore,
    companyVsBenchmark,
    percentile,
    regionAverages,
    departmentAverages,
  }
}

/**
 * Calculate capability benchmark across all companies
 * Aggregates by 8 dimensions
 */
export function calculateCapabilityBenchmark(
  allData: any[], // All respondents across all companies
  companyData: any[], // Current company's respondents
  filters: BenchmarkFilters = {}
): CapabilityBenchmark {
  const benchmarkData = filterBenchmarkData(allData, filters)

  if (benchmarkData.length === 0) {
    return {
      dimensionAverages: {},
      overallAverage: 0,
      companyScores: {},
      companyVsBenchmark: {},
      percentiles: {},
    }
  }

  // Calculate benchmark average for each dimension
  const dimensionAverages: Record<number, number> = {}
  const companyScores: Record<number, number> = {}
  const companyVsBenchmark: Record<number, number> = {}
  const percentiles: Record<number, number> = {}

  CAPABILITY_DIMENSIONS.forEach(dimension => {
    // Get construct IDs for this dimension
    const constructIds = dimension.constructs

    // Calculate benchmark average for this dimension
    const benchmarkConstructScores: number[] = []
    constructIds.forEach(constructId => {
      const columnName = `construct_${constructId}`
      const scores = benchmarkData
        .map(row => row[columnName])
        .filter((score): score is number => typeof score === 'number' && !isNaN(score))

      if (scores.length > 0) {
        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
        benchmarkConstructScores.push(avg)
      }
    })

    const dimensionBenchmark = benchmarkConstructScores.length > 0
      ? benchmarkConstructScores.reduce((sum, s) => sum + s, 0) / benchmarkConstructScores.length
      : 0

    dimensionAverages[dimension.id] = dimensionBenchmark

    // Calculate company's average for this dimension
    const companyConstructScores: number[] = []
    constructIds.forEach(constructId => {
      const columnName = `construct_${constructId}`
      const scores = companyData
        .map(row => row[columnName])
        .filter((score): score is number => typeof score === 'number' && !isNaN(score))

      if (scores.length > 0) {
        const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length
        companyConstructScores.push(avg)
      }
    })

    const companyDimensionScore = companyConstructScores.length > 0
      ? companyConstructScores.reduce((sum, s) => sum + s, 0) / companyConstructScores.length
      : 0

    companyScores[dimension.id] = companyDimensionScore

    // Calculate difference (positive = company is better)
    companyVsBenchmark[dimension.id] = companyDimensionScore - dimensionBenchmark

    // Calculate percentile for this dimension
    const allDimensionScores = calculateAllCompanyDimensionScores(benchmarkData, dimension.id)
    percentiles[dimension.id] = calculatePercentile(companyDimensionScore, allDimensionScores, true)
  })

  // Calculate overall averages
  const validDimensionAverages = Object.values(dimensionAverages).filter(s => s > 0)
  const overallAverage = validDimensionAverages.length > 0
    ? validDimensionAverages.reduce((sum, s) => sum + s, 0) / validDimensionAverages.length
    : 0

  // Calculate regional and departmental dimension averages
  const regionAverages = calculateRegionalDimensionAverages(benchmarkData)
  const departmentAverages = calculateDepartmentalDimensionAverages(benchmarkData)

  return {
    dimensionAverages,
    overallAverage,
    companyScores,
    companyVsBenchmark,
    percentiles,
    regionAverages,
    departmentAverages,
  }
}

// Helper functions

function filterBenchmarkData(data: any[], filters: BenchmarkFilters): any[] {
  return data.filter(row => {
    if (filters.region && row.region !== filters.region) return false
    if (filters.department && row.department !== filters.department) return false
    if (filters.industry && row.industry !== filters.industry) return false
    return true
  })
}

function calculateAllCompanyScores(data: any[]): number[] {
  // Group by company_id and calculate average for each company
  const companyGroups: Record<string, any[]> = {}
  data.forEach(row => {
    const companyId = row.company_id
    if (!companyGroups[companyId]) {
      companyGroups[companyId] = []
    }
    companyGroups[companyId].push(row)
  })

  const companyScores: number[] = []
  Object.values(companyGroups).forEach(companyData => {
    const scores: number[] = []
    Object.values(SENTIMENT_COLUMN_MAPPING).forEach(columnName => {
      const cellScores = companyData
        .map(row => row[columnName])
        .filter((score): score is number => typeof score === 'number' && !isNaN(score))

      if (cellScores.length > 0) {
        scores.push(cellScores.reduce((sum, s) => sum + s, 0) / cellScores.length)
      }
    })

    if (scores.length > 0) {
      const companyAvg = scores.reduce((sum, s) => sum + s, 0) / scores.length
      companyScores.push(companyAvg)
    }
  })

  return companyScores
}

function calculateAllCompanyDimensionScores(data: any[], dimensionId: number): number[] {
  const dimension = CAPABILITY_DIMENSIONS.find(d => d.id === dimensionId)
  if (!dimension) return []

  // Group by company_id
  const companyGroups: Record<string, any[]> = {}
  data.forEach(row => {
    const companyId = row.company_id
    if (!companyGroups[companyId]) {
      companyGroups[companyId] = []
    }
    companyGroups[companyId].push(row)
  })

  const companyScores: number[] = []
  Object.values(companyGroups).forEach(companyData => {
    const constructScores: number[] = []
    dimension.constructs.forEach(constructId => {
      const columnName = `construct_${constructId}`
      const scores = companyData
        .map(row => row[columnName])
        .filter((score): score is number => typeof score === 'number' && !isNaN(score))

      if (scores.length > 0) {
        constructScores.push(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      }
    })

    if (constructScores.length > 0) {
      const dimensionAvg = constructScores.reduce((sum, s) => sum + s, 0) / constructScores.length
      companyScores.push(dimensionAvg)
    }
  })

  return companyScores
}

function calculatePercentile(score: number, allScores: number[], higherIsBetter: boolean = false): number {
  if (allScores.length === 0) return 50

  // For sentiment: lower is better, so invert logic
  // For capability: higher is better
  const betterCount = allScores.filter(s =>
    higherIsBetter ? s < score : s > score
  ).length

  return Math.round((betterCount / allScores.length) * 100)
}

function calculateRegionalAverages(data: any[]): Record<string, number> {
  const regionGroups: Record<string, any[]> = {}
  data.forEach(row => {
    const region = row.region || 'Unknown'
    if (!regionGroups[region]) {
      regionGroups[region] = []
    }
    regionGroups[region].push(row)
  })

  const regionAverages: Record<string, number> = {}
  Object.entries(regionGroups).forEach(([region, regionData]) => {
    const scores: number[] = []
    Object.values(SENTIMENT_COLUMN_MAPPING).forEach(columnName => {
      const cellScores = regionData
        .map(row => row[columnName])
        .filter((score): score is number => typeof score === 'number' && !isNaN(score))

      if (cellScores.length > 0) {
        scores.push(cellScores.reduce((sum, s) => sum + s, 0) / cellScores.length)
      }
    })

    if (scores.length > 0) {
      regionAverages[region] = scores.reduce((sum, s) => sum + s, 0) / scores.length
    }
  })

  return regionAverages
}

function calculateDepartmentalAverages(data: any[]): Record<string, number> {
  const deptGroups: Record<string, any[]> = {}
  data.forEach(row => {
    const dept = row.department || 'Unknown'
    if (!deptGroups[dept]) {
      deptGroups[dept] = []
    }
    deptGroups[dept].push(row)
  })

  const deptAverages: Record<string, number> = {}
  Object.entries(deptGroups).forEach(([dept, deptData]) => {
    const scores: number[] = []
    Object.values(SENTIMENT_COLUMN_MAPPING).forEach(columnName => {
      const cellScores = deptData
        .map(row => row[columnName])
        .filter((score): score is number => typeof score === 'number' && !isNaN(score))

      if (cellScores.length > 0) {
        scores.push(cellScores.reduce((sum, s) => sum + s, 0) / cellScores.length)
      }
    })

    if (scores.length > 0) {
      deptAverages[dept] = scores.reduce((sum, s) => sum + s, 0) / scores.length
    }
  })

  return deptAverages
}

function calculateRegionalDimensionAverages(data: any[]): Record<string, Record<number, number>> {
  const regionGroups: Record<string, any[]> = {}
  data.forEach(row => {
    const region = row.region || 'Unknown'
    if (!regionGroups[region]) {
      regionGroups[region] = []
    }
    regionGroups[region].push(row)
  })

  const regionAverages: Record<string, Record<number, number>> = {}
  Object.entries(regionGroups).forEach(([region, regionData]) => {
    regionAverages[region] = {}

    CAPABILITY_DIMENSIONS.forEach(dimension => {
      const constructScores: number[] = []
      dimension.constructs.forEach(constructId => {
        const columnName = `construct_${constructId}`
        const scores = regionData
          .map(row => row[columnName])
          .filter((score): score is number => typeof score === 'number' && !isNaN(score))

        if (scores.length > 0) {
          constructScores.push(scores.reduce((sum, s) => sum + s, 0) / scores.length)
        }
      })

      if (constructScores.length > 0) {
        regionAverages[region][dimension.id] =
          constructScores.reduce((sum, s) => sum + s, 0) / constructScores.length
      }
    })
  })

  return regionAverages
}

function calculateDepartmentalDimensionAverages(data: any[]): Record<string, Record<number, number>> {
  const deptGroups: Record<string, any[]> = {}
  data.forEach(row => {
    const dept = row.department || 'Unknown'
    if (!deptGroups[dept]) {
      deptGroups[dept] = []
    }
    deptGroups[dept].push(row)
  })

  const deptAverages: Record<string, Record<number, number>> = {}
  Object.entries(deptGroups).forEach(([dept, deptData]) => {
    deptAverages[dept] = {}

    CAPABILITY_DIMENSIONS.forEach(dimension => {
      const constructScores: number[] = []
      dimension.constructs.forEach(constructId => {
        const columnName = `construct_${constructId}`
        const scores = deptData
          .map(row => row[columnName])
          .filter((score): score is number => typeof score === 'number' && !isNaN(score))

        if (scores.length > 0) {
          constructScores.push(scores.reduce((sum, s) => sum + s, 0) / scores.length)
        }
      })

      if (constructScores.length > 0) {
        deptAverages[dept][dimension.id] =
          constructScores.reduce((sum, s) => sum + s, 0) / constructScores.length
      }
    })
  })

  return deptAverages
}
