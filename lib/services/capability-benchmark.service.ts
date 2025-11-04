/**
 * Capability Benchmark Service (LONG Format)
 * Calculates benchmarks from capability_scores table
 * Data structure: One row per (respondent, construct) pair
 */

import { CAPABILITY_DIMENSIONS } from '@/lib/constants/capability-metadata'

export interface CapabilityScore {
  respondent_id: string
  company_id: string
  dimension_id: number
  dimension: string
  construct_id: number
  construct: string
  score: number
  industry_synthetic?: string
  country_synthetic?: string
  continent_synthetic?: string
  role_synthetic?: string
}

export interface CapabilityBenchmark {
  dimensionAverages: Record<number, number> // dimensionId -> average score
  overallAverage: number
  companyScores: Record<number, number> // dimensionId -> company score
  companyVsBenchmark: Record<number, number> // dimensionId -> difference
  percentiles: Record<number, number> // dimensionId -> percentile
  regionAverages?: Record<string, Record<number, number>> // region -> dimensionId -> average
  industryAverages?: Record<string, Record<number, number>> // industry -> dimensionId -> average
}

export interface CapabilityBenchmarkFilters {
  region?: string
  industry?: string
  continent?: string
}

/**
 * Calculate capability benchmark from LONG format capability_scores data
 * Higher scores = better capability
 */
export function calculateCapabilityBenchmarkFromScores(
  allScores: CapabilityScore[], // All capability scores across all companies
  companyScores: CapabilityScore[], // Current company's capability scores
  filters: CapabilityBenchmarkFilters = {}
): CapabilityBenchmark {
  // Filter benchmark data
  const benchmarkScores = filterCapabilityScores(allScores, filters)

  if (benchmarkScores.length === 0) {
    return {
      dimensionAverages: {},
      overallAverage: 0,
      companyScores: {},
      companyVsBenchmark: {},
      percentiles: {},
    }
  }

  const dimensionAverages: Record<number, number> = {}
  const companyDimensionScores: Record<number, number> = {}
  const companyVsBenchmark: Record<number, number> = {}
  const percentiles: Record<number, number> = {}

  // Calculate for each dimension (1-8)
  CAPABILITY_DIMENSIONS.forEach(dimension => {
    const dimensionId = dimension.id

    // Calculate benchmark average for this dimension
    const benchmarkDimensionScores = benchmarkScores
      .filter(score => score.dimension_id === dimensionId)
      .map(score => score.score)

    const benchmarkAvg = benchmarkDimensionScores.length > 0
      ? benchmarkDimensionScores.reduce((sum, s) => sum + s, 0) / benchmarkDimensionScores.length
      : 0

    dimensionAverages[dimensionId] = benchmarkAvg

    // Calculate company average for this dimension
    const companyDimensionData = companyScores
      .filter(score => score.dimension_id === dimensionId)
      .map(score => score.score)

    const companyAvg = companyDimensionData.length > 0
      ? companyDimensionData.reduce((sum, s) => sum + s, 0) / companyDimensionData.length
      : 0

    companyDimensionScores[dimensionId] = companyAvg

    // Calculate difference (positive = company is better, as higher is better)
    companyVsBenchmark[dimensionId] = companyAvg - benchmarkAvg

    // Calculate percentile for this dimension
    const allCompanyDimensionScores = calculateAllCompanyDimensionScores(benchmarkScores, dimensionId)
    percentiles[dimensionId] = calculatePercentile(companyAvg, allCompanyDimensionScores, true)
  })

  // Calculate overall average
  const validDimensionAverages = Object.values(dimensionAverages).filter(s => s > 0)
  const overallAverage = validDimensionAverages.length > 0
    ? validDimensionAverages.reduce((sum, s) => sum + s, 0) / validDimensionAverages.length
    : 0

  // Calculate regional and industry dimension averages
  const regionAverages = calculateRegionalDimensionAverages(benchmarkScores)
  const industryAverages = calculateIndustryDimensionAverages(benchmarkScores)

  return {
    dimensionAverages,
    overallAverage,
    companyScores: companyDimensionScores,
    companyVsBenchmark,
    percentiles,
    regionAverages,
    industryAverages,
  }
}

// Helper functions

function filterCapabilityScores(scores: CapabilityScore[], filters: CapabilityBenchmarkFilters): CapabilityScore[] {
  return scores.filter(score => {
    if (filters.region && score.country_synthetic !== filters.region) return false
    if (filters.industry && score.industry_synthetic !== filters.industry) return false
    if (filters.continent && score.continent_synthetic !== filters.continent) return false
    return true
  })
}

function calculateAllCompanyDimensionScores(scores: CapabilityScore[], dimensionId: number): number[] {
  // Group by company and calculate average for each company for this dimension
  const companyGroups: Record<string, CapabilityScore[]> = {}
  scores
    .filter(score => score.dimension_id === dimensionId)
    .forEach(score => {
      const companyId = score.company_id
      if (!companyGroups[companyId]) {
        companyGroups[companyId] = []
      }
      companyGroups[companyId].push(score)
    })

  return Object.values(companyGroups).map(companyScores => {
    const scores = companyScores.map(s => s.score)
    return scores.reduce((sum, s) => sum + s, 0) / scores.length
  })
}

function calculatePercentile(value: number, allValues: number[], higherIsBetter: boolean = true): number {
  if (allValues.length === 0) return 50

  const sorted = [...allValues].sort((a, b) => a - b)
  let rank = 0

  if (higherIsBetter) {
    // Count how many values are less than or equal to our value
    rank = sorted.filter(v => v <= value).length
  } else {
    // Count how many values are greater than or equal to our value (for lower-is-better)
    rank = sorted.filter(v => v >= value).length
  }

  return Math.round((rank / sorted.length) * 100)
}

function calculateRegionalDimensionAverages(scores: CapabilityScore[]): Record<string, Record<number, number>> {
  const regionAverages: Record<string, Record<number, number>> = {}

  scores.forEach(score => {
    const region = score.country_synthetic
    if (!region) return

    if (!regionAverages[region]) {
      regionAverages[region] = {}
    }

    if (!regionAverages[region][score.dimension_id]) {
      regionAverages[region][score.dimension_id] = 0
    }
  })

  // Calculate averages for each region-dimension combination
  Object.keys(regionAverages).forEach(region => {
    CAPABILITY_DIMENSIONS.forEach(dimension => {
      const dimensionScores = scores
        .filter(s => s.country_synthetic === region && s.dimension_id === dimension.id)
        .map(s => s.score)

      regionAverages[region][dimension.id] = dimensionScores.length > 0
        ? dimensionScores.reduce((sum, s) => sum + s, 0) / dimensionScores.length
        : 0
    })
  })

  return regionAverages
}

function calculateIndustryDimensionAverages(scores: CapabilityScore[]): Record<string, Record<number, number>> {
  const industryAverages: Record<string, Record<number, number>> = {}

  scores.forEach(score => {
    const industry = score.industry_synthetic
    if (!industry) return

    if (!industryAverages[industry]) {
      industryAverages[industry] = {}
    }

    if (!industryAverages[industry][score.dimension_id]) {
      industryAverages[industry][score.dimension_id] = 0
    }
  })

  // Calculate averages for each industry-dimension combination
  Object.keys(industryAverages).forEach(industry => {
    CAPABILITY_DIMENSIONS.forEach(dimension => {
      const dimensionScores = scores
        .filter(s => s.industry_synthetic === industry && s.dimension_id === dimension.id)
        .map(s => s.score)

      industryAverages[industry][dimension.id] = dimensionScores.length > 0
        ? dimensionScores.reduce((sum, s) => sum + s, 0) / dimensionScores.length
        : 0
    })
  })

  return industryAverages
}
