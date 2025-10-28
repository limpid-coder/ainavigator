// Core type definitions for AI Navigator

export interface FilterState {
  region?: string
  department?: string
  function?: string
  role?: string
  ageGroup?: string
}

export interface CompanyProfile {
  id: string
  name: string
  displayName: string
  industry: string
  size: string
  logoUrl?: string
  aiMaturity?: 'early_adoption' | 'scaling' | 'mature'
  primaryConcerns?: string[]
}

export interface SentimentResponse {
  RespondentID: string
  Region: string
  Department: string
  Employment_type: string
  Age: string
  UserLanguage: string
  Sentiment_1: number
  Sentiment_2: number
  Sentiment_3: number
  Sentiment_4: number
  Sentiment_5: number
  Sentiment_6: number
  Sentiment_7: number
  Sentiment_8: number
  Sentiment_9: number
  Sentiment_10: number
  Sentiment_11: number
  Sentiment_12: number
  Sentiment_13: number
  Sentiment_14: number
  Sentiment_15: number
  Sentiment_16: number
  Sentiment_17: number
  Sentiment_18: number
  Sentiment_19: number
  Sentiment_20: number
  Sentiment_21: number
  Sentiment_22: number
  Sentiment_23: number
  Sentiment_24: number
  Sentiment_25: number
}

export interface CapabilityResponse {
  RespondentID: string
  Region: string
  Department: string
  Employment_type: string
  Age: string
  // Constructs 1-32 (dimension_construct format when we have real data)
  construct_1?: number
  construct_2?: number
  // ... would continue to construct_32
  // Open-ended responses
  open_response_1?: string
  open_response_2?: string
  open_response_3?: string
}

// View States for Dashboard Navigation
export type ViewState =
  | { type: 'overview' }
  | { type: 'sentiment_heatmap' }
  | { type: 'sentiment_problem_categories', lowestCells: any[] }
  | { type: 'sentiment_interventions', problemCategory: any }
  | { type: 'capability_overview' }
  | { type: 'capability_dimension', dimensionId: number }
  | { type: 'capability_summary' }
  | { type: 'recommendations_combined' }

export interface DashboardState {
  companyProfile: CompanyProfile
  sentimentData: SentimentResponse[]
  capabilityData: CapabilityResponse[]
  filters: FilterState
  currentView: ViewState
  selectedInterventions: any[]
}


